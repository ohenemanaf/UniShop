// Guest cart: public preview of browser-held items, and merge into the account cart at login.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const express=require('express');const jwt=require('jsonwebtoken');
process.env.JWT_SECRET='isolated-guest-cart-test-secret';

// Fake catalogue: available = stock - reserved. INACTIVE is not returned (inactive product).
const catalogue={ONE:{stock:5,reserved:0},TWO:{stock:3,reserved:1},GONE:{stock:0,reserved:0}};
let cartItems=[];let statements=[];let cartExists=true;
const query=async(sql,params=[])=>{
  statements.push({sql,params});
  if(sql.includes('FROM product_variants pv')&&sql.includes('IN (')){
    const skus=params[0];
    return [skus.filter(s=>catalogue[s]).map(s=>({sku:s,product_id:'p-'+s,product_name:'Item '+s,price:10,available_stock:catalogue[s].stock-catalogue[s].reserved}))];
  }
  if(sql.includes('SELECT id FROM cart WHERE user_id'))return [cartExists?[{id:'cart-1'}]:[]];
  if(sql.startsWith('INSERT INTO cart (')){cartExists=true;return [{affectedRows:1}];}
  if(sql.includes('SELECT quantity FROM cart_items')){const row=cartItems.find(i=>i.sku===params[1]);return [row?[{quantity:row.quantity}]:[]];}
  if(sql.startsWith('INSERT INTO cart_items')){cartItems.push({sku:params[1],quantity:params[2]});return [{affectedRows:1}];}
  if(sql.startsWith('UPDATE cart_items SET quantity')){cartItems.find(i=>i.sku===params[2]).quantity=params[0];return [{affectedRows:1}];}
  return [[]];
};
const conn={query,beginTransaction:async()=>statements.push({sql:'BEGIN'}),commit:async()=>statements.push({sql:'COMMIT'}),rollback:async()=>statements.push({sql:'ROLLBACK'}),release:()=>{}};
const dbPath=require.resolve('../config/db');
require.cache[dbPath]={id:dbPath,filename:dbPath,loaded:true,exports:{query,getConnection:async()=>conn}};
const app=express();app.use(express.json());app.use('/cart',require('./cart'));
app.use((err,req,res,next)=>res.status(err.status||500).json({error:err.message}));

test('guest cart preview is public, validates input and reports unavailable SKUs',async t=>{
  const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
  t.after(()=>{server.closeAllConnections();server.close();});
  const post=body=>fetch('http://127.0.0.1:'+server.address().port+'/cart/preview',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  let res=await post({items:[{sku:'ONE',quantity:2},{sku:'MISSING',quantity:1}]});
  assert.equal(res.status,200);
  const body=await res.json();
  assert.deepEqual(body.items.map(i=>[i.sku,i.quantity]),[['ONE',2]]);
  assert.deepEqual(body.unavailable,['MISSING']);
  assert.equal(body.total,20);assert.equal(body.item_count,2);
  for(const bad of [{},{items:'x'},{items:[{sku:'ONE',quantity:0}]},{items:[{sku:'ONE',quantity:1.5}]},{items:[{sku:'',quantity:1}]},{items:Array.from({length:51},(_,i)=>({sku:'S'+i,quantity:1}))}])
    assert.equal((await post(bad)).status,400,JSON.stringify(bad).slice(0,60));
  res=await post({items:[]});assert.equal(res.status,200);assert.deepEqual((await res.json()).items,[]);
});

test('merge requires login, caps at available stock, skips sold-out SKUs, and runs in a transaction',async t=>{
  const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
  t.after(()=>{server.closeAllConnections();server.close();});
  const token=jwt.sign({id:'user-1',role:'customer'},process.env.JWT_SECRET,{expiresIn:'1m'});
  const merge=(body,auth=true)=>fetch('http://127.0.0.1:'+server.address().port+'/cart/merge',{method:'POST',headers:{'Content-Type':'application/json',...(auth?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)});
  assert.equal((await merge({items:[{sku:'ONE',quantity:1}]},false)).status,401);
  cartItems=[{sku:'ONE',quantity:4}];statements=[];
  const res=await merge({items:[{sku:'ONE',quantity:3},{sku:'TWO',quantity:1},{sku:'GONE',quantity:1},{sku:'MISSING',quantity:1}]});
  assert.equal(res.status,200);
  const body=await res.json();
  assert.equal(cartItems.find(i=>i.sku==='ONE').quantity,5,'4 + 3 capped at 5 available');
  assert.equal(cartItems.find(i=>i.sku==='TWO').quantity,1);
  assert.ok(!cartItems.some(i=>i.sku==='GONE'));
  assert.deepEqual(body.adjusted,['ONE']);
  assert.deepEqual(body.skipped.sort(),['GONE','MISSING']);
  assert.equal(statements[0].sql,'BEGIN');assert.equal(statements.at(-1).sql,'COMMIT');
  assert.ok(statements.some(s=>s.sql.includes('FOR UPDATE')),'locks variant rows while merging');
  cartExists=false;statements=[];
  assert.equal((await merge({items:[{sku:'TWO',quantity:1}]})).status,200);
  assert.ok(statements.some(s=>s.sql.startsWith('INSERT INTO cart (')),'creates a cart when the user has none');
  assert.equal((await merge({items:[{sku:'ONE',quantity:-1}]})).status,400);
});
