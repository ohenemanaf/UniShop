// create-payment-intent must check the payment method before any order is written.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const express=require('express');const jwt=require('jsonwebtoken');
process.env.JWT_SECRET='isolated-momo-test-secret';
delete process.env.STRIPE_SECRET_KEY;
let statements=[];
const query=async(sql,params)=>{
  statements.push({sql,params});
  if(sql.includes('SELECT id FROM cart'))return [[{id:'test-cart'}]];
  if(sql.includes('FROM cart_items ci'))return [[{sku:'TEST',quantity:1,price:20,product_name:'Test item',stock:5,reserved:0}]];
  if(sql.startsWith('UPDATE inventory SET reserved = reserved +'))return [{affectedRows:1}];
  return [{affectedRows:1}];
};
const dbPath=require.resolve('../config/db');
require.cache[dbPath]={id:dbPath,filename:dbPath,loaded:true,exports:{query,getConnection:async()=>({query,beginTransaction:async()=>{},commit:async()=>{},rollback:async()=>{},release:()=>{}})}};
const app=express();app.use(express.json());app.use('/payments',require('./stripe'));
app.use((err,req,res,next)=>res.status(err.status||500).json({error:err.message}));

test('Mobile Money checkout is validated before an order is created',async t=>{
  const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
  t.after(()=>{server.closeAllConnections();server.close();delete process.env.PORTFOLIO_DEMO;});
  const token=jwt.sign({id:'test-user',role:'customer'},process.env.JWT_SECRET,{expiresIn:'1m'});
  const pay=body=>fetch('http://127.0.0.1:'+server.address().port+'/payments/create-payment-intent',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({shipping_address:{line1:'Test street',city:'Accra',zip:'GA-123-4567'},...body})});
  const wroteOrder=()=>statements.some(s=>s.sql.includes('INSERT INTO orders'));

  process.env.PORTFOLIO_DEMO='true';
  statements=[];let res=await pay({payment_method:'momo_mtn',momo_phone:'0201234567'});
  assert.equal(res.status,400);assert.match((await res.json()).error,/MTN/);assert.ok(!wroteOrder());
  statements=[];res=await pay({payment_method:'cod'});
  assert.equal(res.status,400);assert.ok(!wroteOrder());
  statements=[];res=await pay({payment_method:'momo_mtn',momo_phone:'024 123 4567'});
  assert.equal(res.status,200);const body=await res.json();assert.equal(body.mocked,true);
  const insert=statements.find(s=>s.sql.includes('INSERT INTO orders'));
  assert.ok(insert.params.includes('momo_mtn'),'order records the chosen method');
  assert.ok(!insert.params.some(p=>String(p).includes('1234567')),'full phone number is not stored');

  process.env.PORTFOLIO_DEMO='false';process.env.STRIPE_SECRET_KEY='sk_test_configured';
  statements=[];res=await pay({payment_method:'momo_mtn',momo_phone:'0241234567'});
  assert.equal(res.status,400);assert.ok(!wroteOrder(),'live mode refuses MoMo until a provider exists');
  delete process.env.STRIPE_SECRET_KEY;
});
