import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
const defaults = {store_name:'UniShop',announcement:'',support_email:'',hero_title:'Good finds. Better campus living.',hero_subtitle:'From study sessions to your own little space. Discover tech, style, and everyday essentials for life at university.',show_trending:true,show_collections:true,live_chat_enabled:true};
const StoreSettingsContext = createContext({settings:defaults,refresh:()=>{}});
export function StoreSettingsProvider({children}) {
  const [settings,setSettings] = useState(defaults);
  const refresh = () => api.get('/storefront/settings').then(res => setSettings({...defaults,...res.data.settings})).catch(() => {});
  useEffect(() => { refresh(); }, []);
  return <StoreSettingsContext.Provider value={{settings,refresh}}>{children}</StoreSettingsContext.Provider>;
}
export const useStoreSettings = () => useContext(StoreSettingsContext);
