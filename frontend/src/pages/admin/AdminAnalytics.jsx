/**
 * File: AdminAnalytics.jsx
 * Description: Auto-generated documentation for AdminAnalytics.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import GHS from '../../utils/currency';
import api from '../../api';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { IconTrendingUp, IconUsers, IconShoppingBag, IconWallet, IconCalendar, IconDownload, IconRefresh } from '@tabler/icons-react';
const RADIAN = Math.PI / 180;
const COLORS = ['rgb(var(--color-primary))', 'rgb(var(--color-secondary))', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
const PERIODS = [{
  label: '7 Days',
  value: 7
}, {
  label: '30 Days',
  value: 30
}, {
  label: '90 Days',
  value: 90
}];
/**
 * Function StatCard
 * @param {any} props
 * @returns {any}
 */
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = 'primary',
  trend
}) {
  return <div className="bg-surface border border-outline/30 rounded-[2rem] p-6 shadow-sm hover:shadow-level-2 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-full bg-${color}/10 flex items-center justify-center text-${color} group-hover:scale-110 transition-transform`}>
          <Icon size={24} stroke={1.5} />
        </div>
        {trend != null && <span className={`text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-full border ${trend >= 0 ? 'bg-success/10 text-success border-success/20' : 'bg-error/10 text-error border-error/20'}`}>
            <IconTrendingUp size={14} stroke={2} className={trend < 0 ? 'rotate-180' : ''} />
            {trend >= 0 ? '+' : ''}{trend}%
          </span>}
      </div>
      <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-1">{label}</p>
      <p className="text-4xl font-black text-primary mb-1">{value}</p>
      {sub && <p className="text-xs font-medium text-on-surface-variant">{sub}</p>}
    </div>;
}
/**
 * Arrow Function CustomPieLabel
 * @param {any} props
 * @returns {any}
 */
const CustomPieLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
      {(percent * 100).toFixed(0)}%
    </text>;
};
export default /**
 * Function AdminAnalytics
 * @returns {any}
 */
function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);
  /**
 * Arrow Function fetchData
 * @returns {any}
 */
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [period]);
  if (loading) {
    return <div className="w-full animate-pulse space-y-6">
        <div className="h-8 w-48 bg-surface-variant/50 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-36 bg-surface-variant/30 rounded-[2rem]" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-surface-variant/30 rounded-[2rem]" />
          <div className="h-80 bg-surface-variant/30 rounded-[2rem]" />
        </div>
      </div>;
  }
  if (!data) {
    return <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant">
        <p className="text-lg font-bold text-primary mb-4">Failed to load analytics data.</p>
        <button onClick={fetchData} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95">
          <IconRefresh size={18} /> Retry
        </button>
      </div>;
  }
  const {
    stats,
    recent_orders,
    top_products,
    revenue_chart
  } = data;
  const chartData = (revenue_chart || []).map(item => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }));
  const topProductsChart = (top_products || []).slice(0, 6).map(p => ({
    name: p.name.length > 16 ? p.name.slice(0, 15) + '\u2026' : p.name,
    revenue: parseFloat(p.revenue) || 0,
    units: parseInt(p.units_sold) || 0
  }));
  const statusCounts = {};
  (recent_orders || []).forEach(o => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value
  }));
  const avgOrderValue = stats.orders > 0 ? stats.revenue / stats.orders : 0;
  return <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Analytics & Reports</h1>
          <p className="text-on-surface-variant font-medium">Track performance, revenue, and growth metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-surface border border-outline/30 rounded-xl p-1 shadow-sm">
            {PERIODS.map(p => <button key={p.value} onClick={() => setPeriod(p.value)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${period === p.value ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}>
                {p.label}
              </button>)}
          </div>
          <button onClick={fetchData} className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface border border-outline/30 text-primary hover:border-primary transition-all shadow-sm active:scale-95" title="Refresh">
            <IconRefresh size={18} stroke={1.5} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={IconWallet} label="Total Revenue" value={GHS(stats.revenue)} sub="From paid orders" trend={8.2} />
        <StatCard icon={IconUsers} label="Total Customers" value={stats.users.toLocaleString()} sub="Registered accounts" color="secondary" trend={12.5} />
        <StatCard icon={IconShoppingBag} label="Total Orders" value={stats.orders.toLocaleString()} sub="All time orders" trend={5.1} />
        <StatCard icon={IconCalendar} label="Avg. Order Value" value={GHS(avgOrderValue)} sub="Per completed order" trend={3.7} />
      </div>

      {/* Revenue Chart + Status Pie */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2 bg-surface border border-outline/30 rounded-[2rem] shadow-sm p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary">Revenue Trend</h2>
            <span className="text-xs font-semibold text-on-surface-variant bg-surface-variant px-3 py-1.5 rounded-full border border-outline/30">
              Last 7 Days (from DB)
            </span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0
            }}>
                <defs>
                  <linearGradient id="colorRevAdmin" x1="0" y1="0" x2="0" y2="1">
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
              }} tickFormatter={v => GHS(v)} />
                <Tooltip contentStyle={{
                borderRadius: '16px',
                border: '1px solid rgba(var(--color-outline), 0.3)',
                backgroundColor: 'rgb(var(--color-surface))'
              }} itemStyle={{
                color: 'rgb(var(--color-primary))',
                fontWeight: 'bold'
              }} formatter={value => [GHS(value), 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="rgb(var(--color-primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRevAdmin)" activeDot={{
                r: 6,
                fill: 'rgb(var(--color-primary))',
                stroke: 'rgb(var(--color-surface))',
                strokeWidth: 2
              }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface border border-outline/30 rounded-[2rem] shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-primary mb-6">Order Status</h2>
          {statusData.length > 0 ? <>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" labelLine={false} label={<CustomPieLabel />}>
                      {statusData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                {statusData.map((entry, index) => <div key={entry.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{
                  backgroundColor: COLORS[index % COLORS.length]
                }} />
                      <span className="font-semibold text-on-surface-variant capitalize">{entry.name.toLowerCase()}</span>
                    </div>
                    <span className="font-bold text-primary">{entry.value}</span>
                  </div>)}
              </div>
            </> : <div className="flex items-center justify-center h-[200px] text-on-surface-variant">No order data yet.</div>}
        </div>
      </div>

      {/* Top Products Bar Chart + Best Sellers */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2 bg-surface border border-outline/30 rounded-[2rem] shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-primary mb-6">Top Products by Revenue</h2>
          {topProductsChart.length > 0 ? <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsChart} margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0
            }} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--color-outline), 0.3)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{
                fontSize: 11,
                fill: 'rgb(var(--color-on-surface-variant))'
              }} />
                  <YAxis axisLine={false} tickLine={false} tick={{
                fontSize: 11,
                fill: 'rgb(var(--color-on-surface-variant))'
              }} tickFormatter={v => GHS(v)} />
                  <Tooltip contentStyle={{
                borderRadius: '16px',
                border: '1px solid rgba(var(--color-outline), 0.3)',
                backgroundColor: 'rgb(var(--color-surface))'
              }} formatter={(value, name) => [name === 'revenue' ? GHS(value) : value, name === 'revenue' ? 'Revenue' : 'Units Sold']} />
                  <Legend formatter={v => v === 'revenue' ? 'Revenue' : 'Units Sold'} wrapperStyle={{
                fontSize: '12px',
                fontWeight: '600'
              }} />
                  <Bar dataKey="revenue" fill="rgb(var(--color-primary))" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="units" fill="rgb(var(--color-secondary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div> : <div className="flex items-center justify-center h-[280px] text-on-surface-variant">No product sales data yet.</div>}
        </div>

        <div className="bg-surface border border-outline/30 rounded-[2rem] shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-primary mb-6">Best Sellers</h2>
          <div className="flex flex-col gap-4">
            {(top_products || []).slice(0, 5).map((product, i) => <div key={i} className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-xs font-black text-on-surface-variant shrink-0">
                  {i + 1}
                </div>
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-outline/30">
                  <img src={product.image_url || 'https://placehold.co/400x400/FAFAFA/333333.png?text=Product'} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-primary truncate">{product.name}</p>
                  <p className="text-xs text-on-surface-variant font-medium">{product.units_sold} units sold</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-primary">{GHS(product.revenue || 0)}</p>
                </div>
              </div>)}
            {(!top_products || top_products.length === 0) && <p className="text-center text-on-surface-variant py-8 font-medium">No sales data yet.</p>}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-surface border border-outline/30 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-outline/30">
          <h2 className="text-xl font-bold text-primary">Recent Orders</h2>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-surface border border-outline/50 text-primary hover:border-primary transition-all active:scale-95 shadow-sm">
            <IconDownload size={16} stroke={1.5} /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
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
            <tbody className="divide-y divide-outline/30">
              {(recent_orders || []).slice(0, 10).map(order => {
              const statusColor = {
                PENDING: 'bg-surface-variant text-on-surface-variant border-outline/50',
                CONFIRMED: 'bg-secondary/10 text-secondary border-secondary/20',
                PROCESSING: 'bg-primary/10 text-primary border-primary/20',
                SHIPPED: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
                DELIVERED: 'bg-success/10 text-success border-success/20',
                CANCELLED: 'bg-error/10 text-error border-error/20',
                REFUNDED: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
              }[order.status] || 'bg-surface-variant text-on-surface-variant border-outline/50';
              return <tr key={order.id} className="hover:bg-surface-variant/30 transition-colors">
                    <td className="p-4 font-bold text-primary">#{String(order.id).slice(0, 8).toUpperCase()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary font-bold text-xs flex items-center justify-center border border-secondary/20 shrink-0">
                          {order.customer_name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-primary">{order.customer_name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-on-surface-variant">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-primary">
                      {GHS(order.total || 0)}
                    </td>
                  </tr>;
            })}
              {(!recent_orders || recent_orders.length === 0) && <tr>
                  <td colSpan="5" className="p-12 text-center text-on-surface-variant font-medium">No orders yet.</td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}