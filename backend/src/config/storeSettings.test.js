const { test } = require('node:test');
const assert = require('node:assert/strict');
const { defaults, validateSettings } = require('./storeSettings');
test('validates and trims a partial update without inventing other changes', () => {
  assert.deepEqual(validateSettings({store_name:' Campus Shop ',show_trending:false}), {store_name:'Campus Shop',show_trending:false});
  assert.equal(defaults.store_name,'UniShop');
});
test('rejects unknown fields, coerced booleans, invalid email and blank branding', () => {
  for (const value of [{role:'admin'},{show_trending:'false'},{support_email:'bad'},{store_name:' '},{announcement:'x'.repeat(181)},null,[]]) assert.throws(() => validateSettings(value));
  assert.throws(() => validateSettings(JSON.parse('{"__proto__":{}}')));
});
test('allows clearing optional content and accepts actual booleans', () => {
  assert.deepEqual(validateSettings({announcement:'',support_email:'',live_chat_enabled:false}),{announcement:'',support_email:'',live_chat_enabled:false});
});
