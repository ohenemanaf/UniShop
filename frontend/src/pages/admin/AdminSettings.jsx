import {useEffect,useState} from 'react';
import api from '../../api';
import {useStoreSettings} from '../../context/StoreSettingsContext';
export default function AdminSettings() {
  const [form,setForm] = useState(null);
  const [error,setError] = useState('');
  const [saved,setSaved] = useState(false);
  const [saving,setSaving] = useState(false);
  const {refresh} = useStoreSettings();
  const load = () => { setError(''); api.get('/admin/settings').then(res=>setForm(res.data.settings)).catch(()=>setError('Could not load store settings. Check that the backend is running.')); };
  useEffect(()=>{load();},[]);
  const update = (key,value) => { setSaved(false); setForm(prev=>({...prev,[key]:value})); };
  const save = async event => {
    event.preventDefault(); setSaving(true); setError(''); setSaved(false);
    try {const res = await api.put('/admin/settings',form); setForm(res.data.settings); await refresh(); setSaved(true);}
    catch(err) {setError(err.response?.data?.error || 'Settings could not be saved. Your changes are still here.');}
    finally {setSaving(false);}
  };
  if(!form) return <div className="bg-surface rounded-2xl border border-outline-variant p-8">{error ? <><p role="alert" className="text-error">{error}</p><button className="btn-primary mt-4" onClick={load}>Try again</button></> : <p role="status">Loading settings…</p>}</div>;
  const field = (key,label,maxLength,help,type='text') => <label className="block" key={key}><span className="block text-sm font-semibold mb-2">{label}</span><input type={type} maxLength={maxLength} required={['store_name','hero_title','hero_subtitle'].includes(key)} value={form[key]} onChange={e=>update(key,e.target.value)} className="w-full border border-outline rounded-xl px-4 py-3 bg-background text-on-surface" /><span className="block text-xs text-on-surface-variant mt-2">{help}</span></label>;
  return <form onSubmit={save} className="max-w-4xl space-y-6"><div><p className="shop-eyebrow mb-2">Make it yours</p><h1 className="shop-heading">Store settings</h1><p className="text-on-surface-variant mt-2">Changes apply to the storefront after you save.</p></div>
    <section className="bg-surface border border-outline-variant rounded-2xl p-6 space-y-5"><h2 className="text-lg font-bold">Brand & contact</h2>{field('store_name','Store name',60,'Shown in the navigation and footer.')}{field('support_email','Support email',254,'Optional contact link in the footer.','email')}{field('announcement','Announcement',180,'Shown above the homepage. Leave empty to hide.')}</section>
    <section className="bg-surface border border-outline-variant rounded-2xl p-6 space-y-5"><h2 className="text-lg font-bold">Homepage copy</h2>{field('hero_title','Default hero headline',120,'Used when there is no active hero banner.')}{field('hero_subtitle','Default hero description',400,'Use Banners to manage campaign images, headlines, and links.')}</section>
    <section className="bg-surface border border-outline-variant rounded-2xl p-6 space-y-5"><h2 className="text-lg font-bold">Storefront features</h2>{[['show_trending','Trending products','Show the popular products section.'],['show_collections','Collections','Show curated edits on the homepage.'],['live_chat_enabled','Customer live chat','Show the floating support chat.']].map(([key,label,help])=><label key={key} className="flex items-center justify-between gap-5 border-b border-outline-variant pb-4 last:border-0"><span><span className="block font-semibold text-sm">{label}</span><span className="text-xs text-on-surface-variant">{help}</span></span><input type="checkbox" checked={form[key]} onChange={e=>update(key,e.target.checked)} className="w-5 h-5 accent-primary" /></label>)}</section>
    {error && <p role="alert" className="text-error">{error}</p>}{saved && <p role="status" className="text-primary font-semibold">Settings saved. The storefront has been updated.</p>}
    <button disabled={saving} className="btn-primary disabled:opacity-60">{saving?'Saving…':'Save changes'}</button>
  </form>;
}
