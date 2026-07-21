/**
 * File: SellerAnalytics.jsx
 * Description: Auto-generated documentation for SellerAnalytics.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect, useCallback } from 'react';
import GHS from '../../utils/currency';
import { Link } from 'react-router-dom';
import api from '../../api';
import { useSocket } from '../../context/SocketContext';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IconTrendingUp, IconBox, IconClock, IconCoin, IconArrowRight, IconRefresh, IconChartBar, IconPackage, IconShoppingCart } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
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
  variant = 'default',
  trend
}) {
  const isPrimary = variant === 'primary';
  return <motion.div whileHover={{
    y: -5
  }} className={`rounded-3xl p-6 shadow-sm hover:shadow-level-2 transition-all duration-300 group relative overflow-hidden ${isPrimary ? 'bg-gradient-to-br from-primary to-primary-fixed border border-primary-fixed' : 'bg-surface border border-outline/20'}`}>
      {isPrimary && <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/20 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />}
      {!isPrimary && <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>}
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform ${isPrimary ? 'bg-white/20 text-white border border-white/20 backdrop-blur-md' : 'bg-primary/10 text-primary'}`}>
          <Icon size={24} stroke={2} />
        </div>
        {trend != null && <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 px-3 py-1.5 rounded-full border ${isPrimary ? 'bg-white text-primary border-white/50' : trend >= 0 ? 'bg-success/10 text-success border-success/20' : 'bg-error/10 text-error border-error/20'}`}>
            <IconTrendingUp size={14} stroke={2} className={!isPrimary && trend < 0 ? 'rotate-180' : ''} />
            {trend >= 0 ? '+' : ''}{trend}%
          </span>}
      </div>
      <p className={`text-sm font-bold uppercase tracking-wider mb-1 relative z-10 ${isPrimary ? 'text-white/80' : 'text-on-surface-variant'}`}>{label}</p>
      <p className={`text-4xl font-black relative z-10 ${isPrimary ? 'text-white' : 'text-primary'}`}>{value}</p>
      {sub && <p className={`text-xs font-semibold mt-2 relative z-10 ${isPrimary ? 'text-white/60' : 'text-on-surface-variant'}`}>{sub}</p>}
    </motion.div>;
}
export default /**
 * Function SellerAnalytics
 * @returns {any}
 */
function SellerAnalytics() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(7);
  const {
    socket
  } = useSocket();
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes] = await Promise.all([api.get('/seller/dashboard-stats'), api.get('/seller/orders?limit=50'), api.get('/seller/products')]);
      setStats(statsRes.data);
      setOrders(ordersRes.data.orders || []);
      setProducts(productsRes.data.products || []);
    } catch (err) {
      console.error('Error fetching seller analytics:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => {
    if (!socket) return;
    socket.on('new_order', fetchData);
    return () => socket.off('new_order', fetchData);
  }, [socket, fetchData]);
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };
  if (loading) {
    return <div className="w-full animate-pulse space-y-6 p-4">
        <div className="h-12 w-64 bg-surface-container rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-surface-container rounded-3xl" />)}
        </div>
        <div className="h-96 bg-surface-container rounded-3xl" />
      </div>;
  }
  if (!stats) {
    return <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant bg-surface border border-outline/20 rounded-[2.5rem] max-w-[1400px] mx-auto mt-8">
        <IconChartBar size={48} stroke={1.5} className="mb-4 opacity-50 text-error" />
        <p className="text-xl font-black text-primary mb-6">Failed to load analytics data.</p>
        <button onClick={fetchData} className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-md hover:-translate-y-1 transition-all active:scale-95">
          <IconRefresh size={20} stroke={2} /> Retry
        </button>
      </div>;
  }
  const chartData = (stats.revenue_chart || []).map(item => ({
    ...item,
    revenue: parseFloat(item.revenue),
    formattedDate: new Date(item.date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }));

  // Fulfillment status breakdown from orders
  const statusGroups = {};
  orders.forEach(o => {
    statusGroups[o.fulfillment_status] = (statusGroups[o.fulfillment_status] || 0) + 1;
  });
  const statusChartData = Object.entries(statusGroups).map(([status, count]) => ({
    status: status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' '),
    count
  }));

  // Top products by appearance in orders
  const productSales = {};
  orders.forEach(o => {
    const key = o.product_name;
    if (!productSales[key]) productSales[key] = {
      name: key,
      revenue: 0,
      units: 0
    };
    productSales[key].revenue += parseFloat(o.price_at_purchase) * parseInt(o.quantity);
    productSales[key].units += parseInt(o.quantity);
  });
  const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5).map(p => ({
    ...p,
    name: p.name.length > 25 ? p.name.slice(0, 24) + '\u2026' : p.name
  }));
  const avgOrderRevenue = orders.length > 0 ? orders.reduce((sum, o) => sum + parseFloat(o.price_at_purchase) * parseInt(o.quantity), 0) / orders.length : 0;
  return <motion.div variants={containerVariants} initial="hidden" animate="show" className="w-full max-w-[1400px] mx-auto pb-12">
      <SEO title="Analytics | Seller Dashboard" />

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary mb-2 flex items-center gap-3 tracking-tight">
            <IconChartBar size={32} stroke={2.5} /> Analytics
          </h1>
          <p className="text-on-surface-variant font-medium">Monitor your store performance and sales trends.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface border border-outline/20 rounded-2xl p-1.5 shadow-sm">
            {PERIODS.map(p => <button key={p.value} onClick={() => setPeriod(p.value)} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${period === p.value ? 'bg-primary text-white shadow-sm scale-100' : 'text-on-surface-variant hover:text-primary scale-95 hover:scale-100'}`}>
                {p.label}
              </button>)}
          </div>
          <button onClick={fetchData} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-surface border border-outline/20 text-primary hover:border-primary/50 transition-all shadow-sm active:scale-95" title="Refresh">
            <IconRefresh size={20} stroke={2} />
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard icon={IconCoin} label="Total Revenue" value={`$${parseFloat(stats.total_revenue || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`} sub="All time sales" trend={12.5} />
        <StatCard icon={IconBox} label="Active Listings" value={stats.total_products || 0} sub={`${products.filter(p => !p.is_active).length} inactive`} />
        <StatCard icon={IconClock} label="Pending Orders" value={stats.pending_orders || 0} sub="Need fulfillment" variant="primary" trend={null} />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard icon={IconShoppingCart} label="Total Order Items" value={orders.length} sub="Across all orders" />
        <StatCard icon={IconTrendingUp} label="Avg Item Revenue" value={`{GHS(avgOrderRevenue)}`} sub="Per order item" />
        <StatCard icon={IconPackage} label="Total Products" value={products.length} sub="In your catalog" />
      </motion.div>

      {/* Revenue Trend Chart */}
      <motion.div variants={itemVariants} className="bg-surface border border-outline/20 rounded-[2.5rem] shadow-sm p-8 mb-8 relative overflow-hidden">
        <div className="flex items-center justify-between mb-8 relative z-10">
          <h2 className="text-2xl font-black text-primary">Revenue Trend</h2>
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant bg-surface-variant/50 px-4 py-2 rounded-xl border border-outline/20">
            Last {period} days (paid)
          </span>
        </div>
        <div className="h-[350px] relative z-10">
          {chartData.length > 0 ? <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0
          }}>
                <defs>
                  <linearGradient id="colorSellerAnalyticsRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(var(--color-primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="rgb(var(--color-primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--color-outline), 0.3)" />
                <XAxis dataKey="formattedDate" axisLine={false} tickLine={false} tick={{
              fontSize: 12,
              fill: 'rgb(var(--color-on-surface-variant))',
              fontWeight: 600
            }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{
              fontSize: 12,
              fill: 'rgb(var(--color-on-surface-variant))',
              fontWeight: 600
            }} tickFormatter={v => `$${v}`} />
                <Tooltip contentStyle={{
              borderRadius: '20px',
              border: 'none',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
              backgroundColor: 'rgb(var(--color-surface))'
            }} itemStyle={{
              color: 'rgb(var(--color-primary))',
              fontWeight: '900',
              fontSize: '1.25rem'
            }} labelStyle={{
              color: 'rgb(var(--color-on-surface-variant))',
              fontWeight: 'bold',
              marginBottom: '4px'
            }} formatter={value => [`{GHS(value)}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="rgb(var(--color-primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorSellerAnalyticsRev)" activeDot={{
              r: 8,
              fill: 'rgb(var(--color-primary))',
              stroke: 'rgb(var(--color-surface))',
              strokeWidth: 3
            }} />
              </AreaChart>
            </ResponsiveContainer> : <div className="flex flex-col items-center justify-center h-full text-on-surface-variant border-2 border-dashed border-outline/20 rounded-3xl bg-surface-variant/20">
              <IconTrendingUp size={48} stroke={1.5} className="mb-4 opacity-30" />
              <p className="font-bold">No revenue data in the last {period} days.</p>
              <p className="text-sm font-medium opacity-80 mt-1">Complete some orders to see your trend!</p>
            </div>}
        </div>
      </motion.div>

      {/* Orders by Fulfillment Status + Top Products */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Fulfillment Status */}
        <div className="bg-surface border border-outline/20 rounded-[2.5rem] shadow-sm p-8">
          <h2 className="text-2xl font-black text-primary mb-8">Fulfillment Breakdown</h2>
          {statusChartData.length > 0 ? <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData} margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0
            }} barSize={48}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--color-outline), 0.3)" />
                  <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{
                fontSize: 12,
                fill: 'rgb(var(--color-on-surface-variant))',
                fontWeight: 600
              }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{
                fontSize: 12,
                fill: 'rgb(var(--color-on-surface-variant))',
                fontWeight: 600
              }} allowDecimals={false} />
                  <Tooltip contentStyle={{
                borderRadius: '20px',
                border: 'none',
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
                backgroundColor: 'rgb(var(--color-surface))'
              }} itemStyle={{
                color: 'rgb(var(--color-primary))',
                fontWeight: '900'
              }} cursor={{
                fill: 'rgba(var(--color-primary), 0.05)'
              }} formatter={value => [value, 'Orders']} />
                  <Bar dataKey="count" fill="rgb(var(--color-primary))" radius={[12, 12, 0, 0]} name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div> : <div className="flex items-center justify-center h-[280px] text-on-surface-variant font-bold border-2 border-dashed border-outline/20 rounded-3xl bg-surface-variant/20">
              No order data yet.
            </div>}
        </div>

        {/* Top Products */}
        <div className="bg-surface border border-outline/20 rounded-[2.5rem] shadow-sm p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-primary">Top Sellers</h2>
            <Link to="/seller/products" className="text-sm font-bold text-secondary hover:text-secondary-fixed transition-colors flex items-center gap-1 group">
              View All <IconArrowRight size={16} stroke={2.5} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {topProducts.length > 0 ? <div className="flex-1 flex flex-col justify-between gap-4">
              {topProducts.map((product, i) => <div key={i} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-surface-variant/50 border border-transparent hover:border-outline/20 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary font-black text-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-primary text-base truncate">{product.name}</p>
                    <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">{product.units} units sold</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-xl text-primary">{GHS(product.revenue)}</p>
                  </div>
                </div>)}
            </div> : <div className="flex-1 flex flex-col items-center justify-center py-12 text-on-surface-variant border-2 border-dashed border-outline/20 rounded-3xl bg-surface-variant/20">
              <IconPackage size={64} stroke={1.5} className="mb-4 opacity-40" />
              <p className="font-black text-lg text-primary">No sales data yet.</p>
              <p className="text-sm font-medium mt-1 max-w-xs text-center opacity-80">Your top products will appear here once you have sales.</p>
            </div>}
        </div>
      </motion.div>

      {/* Product Health Overview */}
      <motion.div variants={itemVariants} className="bg-surface border border-outline/20 rounded-[2.5rem] shadow-sm p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-black text-primary">Catalog Health</h2>
          <Link to="/seller/products" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm bg-surface-variant/50 border border-outline/20 text-primary hover:border-primary/50 hover:bg-surface transition-all active:scale-95 shadow-sm group">
            Manage Products <IconArrowRight size={16} stroke={2} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-5 p-6 bg-success/5 border border-success/20 rounded-3xl hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-success/10 text-success flex items-center justify-center">
              <IconBox size={28} stroke={2} />
            </div>
            <div>
              <p className="text-3xl font-black text-success leading-tight">{products.filter(p => p.is_active).length}</p>
              <p className="text-[10px] font-black text-success uppercase tracking-widest">Active Listings</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-6 bg-error/5 border border-error/20 rounded-3xl hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-error/10 text-error flex items-center justify-center">
              <IconBox size={28} stroke={2} />
            </div>
            <div>
              <p className="text-3xl font-black text-error leading-tight">{products.filter(p => !p.is_active).length}</p>
              <p className="text-[10px] font-black text-error uppercase tracking-widest">Draft / Inactive</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-6 bg-primary/5 border border-primary/20 rounded-3xl hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <IconPackage size={28} stroke={2} />
            </div>
            <div>
              <p className="text-3xl font-black text-primary leading-tight">{products.length}</p>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Total Products</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>;
}