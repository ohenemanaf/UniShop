/**
 * File: SellerDashboard.jsx
 * Description: Auto-generated documentation for SellerDashboard.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { useSocket } from '../../context/SocketContext';
import { IconCoin, IconTrendingUp, IconBox, IconClock, IconArrowRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
export default /**
 * Function SellerDashboard
 * @returns {any}
 */
function SellerDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    socket
  } = useSocket();
  /**
 * Arrow Function fetchDashboardData
 * @returns {any}
 */
  const fetchDashboardData = () => {
    Promise.all([api.get('/seller/dashboard-stats'), api.get('/seller/orders?limit=5'), api.get('/seller/products?limit=5')]).then(([statsRes, ordersRes, productsRes]) => {
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data.orders || []);
      setTopItems(productsRes.data.products || []);
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching seller dashboard:', err);
      setLoading(false);
    });
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);
  useEffect(() => {
    if (!socket) return;
    socket.on('new_order', fetchDashboardData);
    return () => socket.off('new_order', fetchDashboardData);
  }, [socket]);
  if (loading) {
    return <div className="flex-grow animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 bg-surface-container rounded-3xl"></div>
          <div className="h-40 bg-surface-container rounded-3xl"></div>
          <div className="h-40 bg-surface-container rounded-3xl"></div>
        </div>
        <div className="h-80 bg-surface-container rounded-3xl"></div>
      </div>;
  }
  if (!stats) {
    return <div className="text-error font-bold p-6 bg-error/10 rounded-2xl">Failed to load dashboard data.</div>;
  }
  const chartData = stats.revenue_chart?.map(item => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  })) || [];
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
  return <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-[1400px] mx-auto">
      {/* Stats Overview Bento Grid */}
      <motion.section variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-primary tracking-tight">Overview</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat Card 1 */}
          <motion.div whileHover={{
          y: -5
        }} className="bg-surface border border-outline/20 rounded-3xl p-6 shadow-sm hover:shadow-level-2 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success group-hover:rotate-12 transition-transform">
                <IconCoin size={24} stroke={2} />
              </div>
              <span className="text-xs font-bold text-success flex items-center gap-1 bg-success/10 px-3 py-1.5 rounded-full border border-success/20">
                <IconTrendingUp size={14} stroke={2} /> Lifetime
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Total Sales</p>
              <p className="text-4xl font-black text-primary">${parseFloat(stats.total_revenue || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</p>
            </div>
          </motion.div>
          
          {/* Stat Card 2 */}
          <motion.div whileHover={{
          y: -5
        }} className="bg-surface border border-outline/20 rounded-3xl p-6 shadow-sm hover:shadow-level-2 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:rotate-12 transition-transform">
                <IconBox size={24} stroke={2} />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Active Listings</p>
              <p className="text-4xl font-black text-primary">{stats.total_products || 0}</p>
            </div>
          </motion.div>
          
          {/* Stat Card 3 */}
          <motion.div whileHover={{
          y: -5
        }} className="bg-gradient-to-br from-primary to-primary-fixed rounded-3xl p-6 shadow-md hover:shadow-level-3 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:-rotate-12 transition-transform border border-white/20">
                <IconClock size={24} stroke={2} />
              </div>
              <span className="text-xs font-bold text-primary flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm">
                Requires Action
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-2">Pending Orders</p>
              <p className="text-4xl font-black text-white">{stats.pending_orders || 0}</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Revenue Chart */}
      <motion.section variants={itemVariants} className="mb-8">
        <div className="bg-surface border border-outline/20 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-primary">Revenue (Last 7 Days)</h3>
          </div>
          {chartData.length > 0 ? <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0
            }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B57D0" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0B57D0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E2EC" />
                  <XAxis dataKey="formattedDate" axisLine={false} tickLine={false} tick={{
                fill: '#44474F',
                fontSize: 12
              }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{
                fill: '#44474F',
                fontSize: 12
              }} tickFormatter={value => `$${value}`} />
                  <Tooltip contentStyle={{
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }} itemStyle={{
                color: '#0B57D0',
                fontWeight: 'bold'
              }} formatter={value => [`$${value}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#0B57D0" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div> : <div className="h-72 flex flex-col items-center justify-center text-on-surface-variant bg-surface-variant/30 rounded-2xl border border-dashed border-outline/40">
              <IconTrendingUp size={48} stroke={1} className="mb-4 opacity-30" />
              <p className="font-semibold">No recent revenue data to display</p>
            </div>}
        </div>
      </motion.section>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Orders */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-primary">Recent Orders</h3>
            <Link to="/seller/orders" className="text-sm font-semibold text-secondary flex items-center gap-1 hover:gap-2 transition-all">
              View All <IconArrowRight size={16} />
            </Link>
          </div>
          <div className="bg-surface border border-outline/20 rounded-3xl shadow-sm overflow-hidden">
            {recentOrders.length > 0 ? <div className="divide-y divide-outline/10">
                {recentOrders.map(order => <div key={order.order_item_id} className="p-5 hover:bg-surface-variant/30 transition-colors flex items-center gap-4">
                    <div className="w-14 h-14 bg-surface-variant/50 rounded-xl overflow-hidden shrink-0 border border-outline/20">
                      {order.image_url ? <img src={order.image_url} alt={order.product_name} className="w-full h-full object-cover mix-blend-multiply" /> : <div className="w-full h-full flex items-center justify-center text-on-surface-variant"><IconBox /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-primary truncate">{order.product_name}</p>
                      <p className="text-xs font-medium text-on-surface-variant truncate">Order: {order.order_id.substring(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-primary">${order.price_at_purchase}</p>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-success">{order.fulfillment_status}</span>
                    </div>
                  </div>)}
              </div> : <div className="p-8 text-center text-on-surface-variant">
                <p className="font-medium">No recent orders yet.</p>
              </div>}
          </div>
        </motion.section>

        {/* Top Products */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-primary">Top Products</h3>
            <Link to="/seller/products" className="text-sm font-semibold text-secondary flex items-center gap-1 hover:gap-2 transition-all">
              Manage <IconArrowRight size={16} />
            </Link>
          </div>
          <div className="bg-surface border border-outline/20 rounded-3xl shadow-sm overflow-hidden">
            {topItems.length > 0 ? <div className="divide-y divide-outline/10">
                {topItems.map(item => <div key={item.id} className="p-5 hover:bg-surface-variant/30 transition-colors flex items-center gap-4">
                    <div className="w-14 h-14 bg-surface-variant/50 rounded-xl overflow-hidden shrink-0 border border-outline/20">
                      {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" /> : <div className="w-full h-full flex items-center justify-center text-on-surface-variant"><IconBox /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-primary truncate">{item.name}</p>
                      <p className="text-xs font-medium text-on-surface-variant truncate">{item.category_name || 'Uncategorized'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-primary">${item.price}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${item.is_active ? 'text-success' : 'text-error'}`}>
                        {item.is_active ? 'Active' : 'Draft'}
                      </span>
                    </div>
                  </div>)}
              </div> : <div className="p-8 text-center text-on-surface-variant">
                <p className="font-medium">No products listed yet.</p>
              </div>}
          </div>
        </motion.section>

      </div>
    </motion.div>;
}