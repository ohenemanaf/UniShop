const {test} = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const jwt = require('jsonwebtoken');
// Isolate route behavior from the developer's live database.
let stored;
const dbPath = require.resolve('../config/db');
require.cache[dbPath] = {id:dbPath,filename:dbPath,loaded:true,exports:{query:async(sql,params)=>{
  if(sql.startsWith('SELECT')) return [stored ? [{settings_json:JSON.stringify(stored)}] : []];
  if(sql.startsWith('INSERT')) stored = {...stored,...JSON.parse(params[0])};
  return [{}];
}}};
process.env.JWT_SECRET = 'isolated-settings-route-test-secret';
const router = require('./storeSettings');
test('settings routes enforce roles, validate updates, and retain saved fields', async t => {
  const app=express(); app.use(express.json()); app.use('/api/v1',router);
  const server=app.listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));
  t.after(()=>{server.closeAllConnections();server.close();});
  const base='http://127.0.0.1:'+server.address().port+'/api/v1';
  const token=role=>jwt.sign({id:'test',role},process.env.JWT_SECRET,{expiresIn:'1m'});
  const options=(role,body)=>({method:'PUT',headers:{'Content-Type':'application/json',...(role?{Authorization:'Bearer '+token(role)}:{})},body:JSON.stringify(body)});
  assert.equal((await fetch(base+'/admin/settings')).status,401);
  assert.equal((await fetch(base+'/admin/settings',options('customer',{store_name:'Blocked'}))).status,403);
  assert.equal((await fetch(base+'/admin/settings',options('seller',{show_trending:false}))).status,403);
  assert.equal(stored,undefined);
  assert.equal((await fetch(base+'/admin/settings',options('admin',{show_trending:'false'}))).status,400);
  let response=await fetch(base+'/admin/settings',options('admin',{store_name:'Campus Store',show_trending:false}));
  assert.equal(response.status,200);
  assert.equal((await response.json()).settings.show_trending,false);
  response=await fetch(base+'/admin/settings',options('admin',{announcement:'Welcome back'}));
  assert.equal(response.status,200);
  const result=await (await fetch(base+'/storefront/settings')).json();
  assert.equal(result.settings.store_name,'Campus Store');
  assert.equal(result.settings.announcement,'Welcome back');
  assert.equal(result.settings.show_trending,false);
  assert.equal(result.settings.live_chat_enabled,true);
});
