const {test}=require('node:test');
const assert=require('node:assert/strict');
const {normaliseGhanaPhone,validatePayment}=require('./mobileMoney');

test('normalises Ghana numbers written locally or internationally',()=>{
  assert.equal(normaliseGhanaPhone('024 123 4567'),'0241234567');
  assert.equal(normaliseGhanaPhone('+233 24 123 4567'),'0241234567');
  assert.equal(normaliseGhanaPhone('233241234567'),'0241234567');
  assert.equal(normaliseGhanaPhone('24-123-4567'),'0241234567');
  for(const bad of ['', '12345', '02412345678', 'abc', null, 42]) assert.equal(normaliseGhanaPhone(bad),null,String(bad));
});

test('validates payment method and Mobile Money network prefix',()=>{
  assert.deepEqual(validatePayment({payment_method:'card'},{demo:false}),{ok:true,method:'card'});
  assert.equal(validatePayment({payment_method:'bitcoin'},{demo:true}).ok,false);
  assert.equal(validatePayment({payment_method:'cod'},{demo:true}).ok,false,'methods without a flow are refused');
  assert.equal(validatePayment({payment_method:'momo_mtn',momo_phone:'0241234567'},{demo:false}).ok,false,'MoMo is demo-only until a provider is connected');
  assert.deepEqual(validatePayment({payment_method:'momo_mtn',momo_phone:'+233 24 123 4567'},{demo:true}),{ok:true,method:'momo_mtn',phone:'0241234567'});
  assert.equal(validatePayment({payment_method:'momo_mtn',momo_phone:'0201234567'},{demo:true}).ok,false,'Telecel number on MTN');
  assert.equal(validatePayment({payment_method:'momo_voda',momo_phone:'0501234567'},{demo:true}).ok,true);
  assert.equal(validatePayment({payment_method:'momo_at',momo_phone:'0271234567'},{demo:true}).ok,true);
  assert.equal(validatePayment({payment_method:'momo_at',momo_phone:''},{demo:true}).ok,false);
  assert.deepEqual(validatePayment({},{demo:false}),{ok:true,method:'card'},'card is the default');
});
