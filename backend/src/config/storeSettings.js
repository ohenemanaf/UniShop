const defaults = Object.freeze({
  store_name: 'UniShop', announcement: '', support_email: '',
  hero_title: 'Good finds. Better campus living.',
  hero_subtitle: 'From study sessions to your own little space. Discover tech, style, and everyday essentials for life at university.',
  show_trending: true, show_collections: true, live_chat_enabled: true
});
const limits = { store_name: 60, announcement: 180, support_email: 254, hero_title: 120, hero_subtitle: 400 };
function validateSettings(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Settings must be an object.');
  const result = {};
  for (const key of Object.keys(body)) {
    if (!(key in defaults) || !Object.hasOwn(defaults, key)) throw new Error('Unknown setting: ' + key);
    const value = body[key];
    if (typeof defaults[key] === 'boolean') {
      if (typeof value !== 'boolean') throw new Error(key + ' must be true or false.');
      result[key] = value;
    } else {
      if (typeof value !== 'string' || value.trim().length > limits[key]) throw new Error(key + ' must be text under ' + limits[key] + ' characters.');
      result[key] = value.trim();
      if (['store_name','hero_title','hero_subtitle'].includes(key) && !result[key]) throw new Error(key + ' cannot be empty.');
      if (key === 'support_email' && result[key] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result[key])) throw new Error('Enter a valid support email.');
    }
  }
  return result;
}
module.exports = { defaults, validateSettings };
