/**
 * File: AdminDashboard.jsx
 * Description: Auto-generated documentation for AdminDashboard.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import GHS from '../../utils/currency';
import { Link } from 'react-router-dom';
import api from '../../api';
import { IconWallet, IconUsers, IconShoppingBag, IconArrowRight, IconSpeakerphone, IconUserCog, IconMessages, IconDownload } from '@tabler/icons-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
export default /**
 * Function AdminDashboard
 * @returns {any}
 */
function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/admin/dashboard').then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load dashboard:', err);
      setLoading(false);
    });
  }, []);
  if (loading) {
    return <div className="flex-grow animate-pulse"><div className="h-32 bg-surface-container rounded-xl mb-4"></div><div className="h-64 bg-surface-container rounded-xl"></div></div>;
  }
  if (!data) {
    return <div className="text-error font-bold p-lg">Failed to load admin dashboard data.</div>;
  }
  const {
    stats,
    recent_orders,
    revenue_chart
  } = data;

  // Format revenue dates for better display
  const chartData = revenue_chart?.map(item => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  })) || [];
  return <div>
      {/* Top Metrics Row */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-primary mb-6 tracking-tight">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenue */}
          <div className="bg-surface border border-outline/30 rounded-[2rem] p-6 shadow-sm hover:shadow-level-2 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <IconWallet size={24} stroke={1.5} />
              </div>
            </div>
            <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Total Revenue</p>
            <p className="text-4xl font-black text-primary">{GHS(stats.revenue)}</p>
          </div>

          {/* Users */}
          <div className="bg-surface border border-outline/30 rounded-[2rem] p-6 shadow-sm hover:shadow-level-2 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <IconUsers size={24} stroke={1.5} />
              </div>
            </div>
            <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Active Users</p>
            <p className="text-4xl font-black text-primary">{stats.users.toLocaleString()}</p>
          </div>

          {/* Orders */}
          <div className="bg-surface border border-outline/30 rounded-[2rem] p-6 shadow-sm hover:shadow-level-2 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-full bg-surface-variant/50 flex items-center justify-center text-primary border border-outline/30 group-hover:scale-110 transition-transform">
                <IconShoppingBag size={24} stroke={1.5} />
              </div>
            </div>
            <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Total Orders</p>
            <p className="text-4xl font-black text-primary">{stats.orders.toLocaleString()}</p>
          </div>

          {/* Active products */}
          <Link to="/admin/products" className="bg-surface border border-outline-variant rounded-[2rem] p-6 shadow-sm"><IconShoppingBag size={24} className="text-primary mb-6"/><p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Active Products</p><p className="text-4xl font-black text-primary">{stats.products.toLocaleString()}</p></Link>
        </div>
      </section>

      {/* Main Layout Split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <section className="xl:col-span-2 flex flex-col gap-8">
          
          {/* Revenue Chart */}
          <div className="bg-surface border border-outline/30 rounded-[2rem] shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-primary mb-6">Revenue Trend (Last 7 Days)</h2>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0
              }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#185C43" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#185C43" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E1E7DE" />
                  <XAxis dataKey="formattedDate" axisLine={false} tickLine={false} tick={{
                  fontSize: 12,
                  fill: '#59675F'
                }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{
                  fontSize: 12,
                  fill: '#59675F'
                }} tickFormatter={value => GHS(value)} />
                  <Tooltip contentStyle={{
                  borderRadius: '16px',
                  border: '1px solid #E1E7DE',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  backgroundColor: '#FFFFFF'
                }} itemStyle={{
                  color: '#185C43',
                  fontWeight: 'bold'
                }} formatter={value => [GHS(value), 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#185C43" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{
                  r: 6,
                  fill: '#185C43',
                  stroke: '#FFFFFF',
                  strokeWidth: 2
                }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-surface border border-outline/30 rounded-[2rem] shadow-sm p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-primary">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center gap-1">
                View All <IconArrowRight size={16} stroke={2} />
              </Link>
            </div>
            <div className="overflow-x-auto rounded-xl border border-outline/30">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-variant/30 border-b border-outline/30">
                    <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Order ID</th>
                    <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Customer</th>
                    <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Date</th>
                    <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recent_orders.length === 0 ? <tr><td colSpan={5} className="p-4 text-center text-on-surface-variant font-medium">No recent orders</td></tr> : recent_orders.map(order => <tr key={order.id} className="border-b border-outline/30 hover:bg-surface-variant/30 transition-colors cursor-pointer group" onClick={() => window.location.href = `/admin/orders`}>
                        <td className="p-4 font-bold text-primary group-hover:text-secondary transition-colors">#{order.id.slice(0, 8).toUpperCase()}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm shrink-0 border border-secondary/20">
                              {order.customer_name.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-primary truncate group-hover:text-secondary transition-colors">{order.customer_name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm font-medium text-on-surface-variant">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${order.status === 'PENDING' ? 'bg-surface-variant text-on-surface-variant border-outline/50' : 'bg-primary/10 text-primary border-primary/20'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-right font-bold text-primary">{GHS(order.total)}</td>
                      </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* System Alerts & Quick Actions */}
        <section className="xl:col-span-1 flex flex-col gap-8 h-full">
          
          {/* Store management */}
          <div className="bg-surface border border-outline-variant rounded-2xl p-6"><h2 className="text-xl font-bold mb-4">Manage your store</h2><p className="text-sm text-on-surface-variant mb-5">Review inventory, seller applications, and support requests in their dedicated sections.</p><Link to="/admin" className="text-primary font-semibold">Open control center →</Link></div>
          {/* Quick Actions */}
          <div className="bg-surface border border-outline/30 rounded-[2rem] shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-primary mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/promos" className="bg-surface border border-outline/30 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-primary active:scale-95 transition-all flex flex-col items-center justify-center gap-3 text-center group">
                <IconSpeakerphone size={28} stroke={1.5} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Create Promo</span>
              </Link>
              <Link to="/admin/users" className="bg-surface border border-outline/30 p-5 rounded-2xl shadow-sm hover:shadow-md hover:primary active:scale-95 transition-all flex flex-col items-center justify-center gap-3 text-center group">
                <IconUserCog size={28} stroke={1.5} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Manage Users</span>
              </Link>
              <Link to="/admin/support" className="bg-surface border border-outline/30 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-primary active:scale-95 transition-all flex flex-col items-center justify-center gap-3 text-center group">
                <IconMessages size={28} stroke={1.5} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Support Chat</span>
              </Link>
              <button onClick={() => { const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'}); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'unishop-overview.json'; link.click(); URL.revokeObjectURL(url); }} className="bg-surface border border-outline/30 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-primary active:scale-95 transition-all flex flex-col items-center justify-center gap-3 text-center group">
                <IconDownload size={28} stroke={1.5} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Export Data</span>
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>;
}