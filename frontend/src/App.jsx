/**
 * File: App.jsx
 * Description: Auto-generated documentation for App.jsx
 * Date: 2026-07-21
 */
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import MiniCart from './components/MiniCart';
import LiveChat from './components/LiveChat';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import SellerRoute from './components/SellerRoute';
import AdminLayout from './components/AdminLayout';
import SellerLayout from './pages/seller/SellerLayout';
import { Suspense, lazy } from 'react';
import GlobalLoader from './components/GlobalLoader';
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const BuyerDashboard = lazy(() => import('./pages/BuyerDashboard'));
const AccountSettings = lazy(() => import('./pages/AccountSettings'));
const NotFound = lazy(() => import('./pages/NotFound'));
const InventoryDashboard = lazy(() => import('./pages/InventoryDashboard'));
const Invoice = lazy(() => import('./pages/Invoice'));
const PackingSlip = lazy(() => import('./pages/admin/PackingSlip'));
const Support = lazy(() => import('./pages/Support'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const FAQ = lazy(() => import('./pages/FAQ'));
const SellerStore = lazy(() => import('./pages/SellerStore'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminLiveChat = lazy(() => import('./pages/admin/AdminLiveChat'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminProductCreate = lazy(() => import('./pages/admin/AdminProductCreate'));
const AdminProductEdit = lazy(() => import('./pages/admin/AdminProductEdit'));
const AdminPromos = lazy(() => import('./pages/admin/AdminPromos'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminSupport = lazy(() => import('./pages/admin/AdminSupport'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminPayouts = lazy(() => import('./pages/admin/AdminPayouts'));
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'));
const AdminEdits = lazy(() => import('./pages/admin/AdminEdits'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const SellerDashboard = lazy(() => import('./pages/seller/SellerDashboard'));
const SellerOrders = lazy(() => import('./pages/seller/SellerOrders'));
const SellerProducts = lazy(() => import('./pages/seller/SellerProducts'));
const SellerPayouts = lazy(() => import('./pages/seller/SellerPayouts'));
const SellerAnalytics = lazy(() => import('./pages/seller/SellerAnalytics'));
/**
 * Function App
 * @returns {any}
 */
function App() {
  return <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <SocketProvider>
              <CartProvider>
                <ToastProvider>
                  <Suspense fallback={<GlobalLoader />}>
                    <Routes>
                      {/* Admin Routes */}
                      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="live-chat" element={<AdminLiveChat />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="products/new" element={<AdminProductCreate />} />
                        <Route path="products/:id/edit" element={<AdminProductEdit />} />
                        <Route path="categories" element={<AdminCategories />} />
                        <Route path="promos" element={<AdminPromos />} />
                        <Route path="inventory" element={<InventoryDashboard />} />
                        <Route path="support" element={<AdminSupport />} />
                        <Route path="reviews" element={<AdminReviews />} />
                        <Route path="payouts" element={<AdminPayouts />} />
                        <Route path="banners" element={<AdminBanners />} />
                        <Route path="edits" element={<AdminEdits />} />
                        <Route path="live-chat" element={<AdminLiveChat />} />
                        <Route path="analytics" element={<AdminAnalytics />} />
                      </Route>

                      {/* Seller Routes */}
                      <Route path="/seller" element={<SellerRoute><SellerLayout /></SellerRoute>}>
                        <Route index element={<SellerDashboard />} />
                        <Route path="analytics" element={<SellerAnalytics />} />
                        <Route path="orders" element={<SellerOrders />} />
                        <Route path="products" element={<SellerProducts />} />
                        <Route path="products/new" element={<AdminProductCreate />} />
                        <Route path="products/:id/edit" element={<AdminProductEdit />} />
                        <Route path="inventory" element={<InventoryDashboard />} />
                        <Route path="payouts" element={<SellerPayouts />} />
                      </Route>

                      {/* Storefront Routes */}
                      <Route path="*" element={<div className="min-h-screen flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-white-container">
                          <Navbar />
                          <MiniCart />
                          <main className="flex-1 w-full flex flex-col relative pb-xl">
                            <Routes>
                              {/* Auth Routes */}
                              <Route path="/login" element={<Login />} />
                              <Route path="/register" element={<Register />} />
                              <Route path="/forgot-password" element={<ForgotPassword />} />
                              <Route path="/reset-password" element={<ResetPassword />} />

                              {/* Public Shopping Routes */}
                              <Route path="/" element={<Home />} />
                              <Route path="/products" element={<Products />} />
                              <Route path="/products/:id" element={<ProductDetail />} />
                              <Route path="/store/:id" element={<SellerStore />} />
                              <Route path="/about" element={<AboutUs />} />
                              <Route path="/contact" element={<ContactUs />} />
                              <Route path="/faq" element={<FAQ />} />

                              {/* Protected routes */}
                              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                              <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                              <Route path="/orders/:id/invoice" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
                              <Route path="/orders/:id/packing-slip" element={<ProtectedRoute><PackingSlip /></ProtectedRoute>} />
                              <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                              <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
                              <Route path="/profile" element={<ProtectedRoute><BuyerDashboard /></ProtectedRoute>} />
                              <Route path="/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />

                              {/* 404 */}
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </main>

                          {/* Footer */}
                          <footer className="bg-surface-container-low border-t border-outline-variant w-full">
                            <div className="flex flex-col md:flex-row justify-between items-center px-gutter py-lg max-w-container-max mx-auto gap-md text-center md:text-left">
                              <div className="font-headline-md text-headline-md font-bold text-on-surface opacity-80 hover:opacity-100 transition-opacity">
                                UniShop
                              </div>
                              <div className="flex flex-wrap justify-center gap-md font-label-sm text-label-sm">
                                <Link to="/about" className="text-secondary-fixed-variant hover:text-primary transition-colors duration-200">About Us</Link>
                                <Link to="/contact" className="text-secondary-fixed-variant hover:text-primary transition-colors duration-200">Contact</Link>
                                <Link to="/faq" className="text-secondary-fixed-variant hover:text-primary transition-colors duration-200">FAQ</Link>
                                <Link to="/support" className="text-secondary-fixed-variant hover:text-primary transition-colors duration-200">Support</Link>
                              </div>
                              <div className="font-label-sm text-label-sm text-secondary-fixed-variant">
                                © {new Date().getFullYear()} UniShop University Marketplace
                              </div>
                            </div>
                          </footer>
                          
                          {/* Floating Live Chat for Customers */}
                          <LiveChat />
                        </div>} />
                    </Routes>
                  </Suspense>
                </ToastProvider>
              </CartProvider>
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>;
}
export default App;