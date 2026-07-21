/**
 * File: AdminDashboard.jsx
 * Description: Auto-generated documentation for AdminDashboard.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import GHS from '../../utils/currency';
import { Link } from 'react-router-dom';
import api from '../../api';
import { IconWallet, IconTrendingUp, IconUsers, IconShoppingBag, IconHeadset, IconArrowRight, IconAlertTriangle, IconBox, IconUserPlus, IconSpeakerphone, IconUserCog, IconMessages, IconDownload } from '@tabler/icons-react';
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
              <span className="text-xs font-bold text-success flex items-center gap-1 bg-success/10 px-3 py-1.5 rounded-full border border-success/20">
                <IconTrendingUp size={14} stroke={2} /> +8.2%
              </span>
            </div>
            <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Total Revenue</p>
            <p className="text-4xl font-black text-primary">${stats.revenue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</p>
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

          {/* Support Tickets */}
          <div className="bg-error border border-error/20 rounded-[2rem] p-6 shadow-sm hover:shadow-level-2 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-on-error/10 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-12 h-12 rounded-full bg-on-error/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <IconHeadset size={24} stroke={1.5} />
              </div>
              <span className="text-xs font-bold text-error flex items-center gap-1 bg-surface px-3 py-1.5 rounded-full shadow-sm">
                Action Needed
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-2">Open Support Tickets</p>
              <p className="text-4xl font-black text-white">24</p>
            </div>
          </div>
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
                      <stop offset="5%" stopColor="rgb(var(--color-primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="rgb(var(--color-primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--color-outline), 0.3)" />
                  <XAxis dataKey="formattedDate" axisLine={false} tickLine={false} tick={{
                  fontSize: 12,
                  fill: 'rgb(var(--color-on-surface-variant))'
                }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{
                  fontSize: 12,
                  fill: 'rgb(var(--color-on-surface-variant))'
                }} tickFormatter={value => `$${value}`} />
                  <Tooltip contentStyle={{
                  borderRadius: '16px',
                  border: '1px solid rgba(var(--color-outline), 0.3)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  backgroundColor: 'rgb(var(--color-surface))'
                }} itemStyle={{
                  color: 'rgb(var(--color-primary))',
                  fontWeight: 'bold'
                }} formatter={value => [`{GHS(value)}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="rgb(var(--color-primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{
                  r: 6,
                  fill: 'rgb(var(--color-primary))',
                  stroke: 'rgb(var(--color-surface))',
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
          
          {/* System Alerts */}
          <div className="bg-surface border border-outline/30 rounded-[2rem] shadow-sm p-6 md:p-8 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-primary">System Alerts</h2>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 p-4 bg-error/10 rounded-2xl border border-error/20 items-start">
                <IconAlertTriangle size={24} stroke={1.5} className="text-error shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-error uppercase tracking-wider mb-1">High Server Load</h4>
                  <p className="text-sm font-medium text-error/80">Database CPU usage reached 85% in the last 15 mins.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 hover:bg-surface-variant/30 rounded-2xl border border-transparent hover:border-outline/30 transition-colors cursor-pointer group items-start">
                <IconBox size={24} stroke={1.5} className="text-secondary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-1 group-hover:text-secondary transition-colors">Low Stock Warning</h4>
                  <p className="text-sm font-medium text-on-surface-variant">15 products have dropped below minimum stock levels.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 hover:bg-surface-variant/30 rounded-2xl border border-transparent hover:border-outline/30 transition-colors cursor-pointer group items-start">
                <IconUserPlus size={24} stroke={1.5} className="text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-1 group-hover:text-secondary transition-colors">New Seller Approvals</h4>
                  <p className="text-sm font-medium text-on-surface-variant">3 new seller accounts are waiting for manual review.</p>
                </div>
              </div>
            </div>
          </div>

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
              <button className="bg-surface border border-outline/30 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-primary active:scale-95 transition-all flex flex-col items-center justify-center gap-3 text-center group">
                <IconDownload size={28} stroke={1.5} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Export Data</span>
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>;
}