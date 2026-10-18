import {useState} from 'react';
import {Link} from 'react-router-dom';
import {IconArrowUpRight,IconSearch} from '@tabler/icons-react';
const groups = [
  {title:'Store & catalog',items:[['products','Products','Create and edit products, prices, images, and variants.'],['inventory','Inventory','Manage stock levels and availability.'],['categories','Categories','Organize the catalog.'],['promos','Promotions','Create discounts and manage promo codes.']]},
  {title:'Sales & people',items:[['orders','Orders','Review orders and update fulfilment status.'],['users','Users & sellers','Manage roles, customers, and seller applications.'],['payouts','Seller payouts','Review and process seller payout requests.'],['analytics','Analytics','Explore sales and store performance.']]},
  {title:'Storefront & support',items:[['settings','Store settings','Branding, announcements, homepage sections, and live chat.'],['banners','Banners','Control campaign images, headlines, and destination links.'],['edits','Curated edits','Manage featured collections and bundles.'],['messages','Contact inbox','Read messages submitted through the public contact page.'],['reviews','Reviews','Moderate product reviews.'],['support','Support tickets','Track and respond to customer issues.'],['live-chat','Live chat','Reply to customers in real time.']]},
];
export default function AdminControlCenter() {
  const [search,setSearch] = useState('');
  const filtered = groups.map(group=>({...group,items:group.items.filter(item=>item.join(' ').toLowerCase().includes(search.toLowerCase()))})).filter(group=>group.items.length);
  return <div className="space-y-8"><div className="bg-primary text-white rounded-2xl p-6 md:p-9"><p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-3">UniShop administration</p><h1 className="text-3xl md:text-4xl font-bold tracking-tight">Your store. Under control.</h1><p className="text-white/80 mt-3 max-w-[36rem]">Manage your catalog, customers, orders, and storefront from one place.</p><Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold mt-6">View storefront <IconArrowUpRight size={18}/></Link></div>
    <label className="flex items-center gap-3 bg-surface border border-outline rounded-xl px-4 py-3 max-w-[36rem]"><IconSearch size={20} className="text-on-surface-variant"/><input aria-label="Find an admin control" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find a control…" className="w-full bg-transparent outline-none"/></label>
    {filtered.map(group=><section key={group.title}><h2 className="text-lg font-bold mb-4">{group.title}</h2><div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">{group.items.map(([route,title,description])=><Link key={route} to={'/admin/'+route} className="bg-surface border border-outline-variant rounded-2xl p-5 hover:border-primary transition-colors group"><div className="flex justify-between gap-4"><h3 className="font-bold text-primary">{title}</h3><IconArrowUpRight size={18}/></div><p className="text-sm text-on-surface-variant mt-3 leading-relaxed">{description}</p></Link>)}</div></section>)}
    {!filtered.length && <p className="text-on-surface-variant">No controls match your search.</p>}
  </div>;
}
