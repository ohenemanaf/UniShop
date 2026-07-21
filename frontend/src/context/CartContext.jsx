/**
 * File: CartContext.jsx
 * Description: Auto-generated documentation for CartContext.jsx
 * Date: 2026-07-21
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';
const CartContext = createContext(null);
export /**
 * Function CartProvider
 * @param {any} props
 * @returns {any}
 */
function CartProvider({
  children
}) {
  const {
    isAuthenticated
  } = useAuth();
  const [cart, setCart] = useState(() => {
    try {
      const local = localStorage.getItem('unishop_cart');
      return local ? JSON.parse(local) : {
        items: [],
        total: 0,
        item_count: 0
      };
    } catch {
      return {
        items: [],
        total: 0,
        item_count: 0
      };
    }
  });
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      // Local cart is maintained via useEffect syncing
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/cart');
      setCart(res.data);
    } catch (err) {
      console.error('Cart fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Persist local cart if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('unishop_cart', JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);
  const addToCart = useCallback(async (sku, quantity = 1) => {
    // Optimistically update quantity if item already in cart (we know the price)
    // For new items, skip optimistic add (price unknown) — fetchCart will fill it in
    setCart(prev => {
      const existing = prev.items?.find(i => i.sku === sku);
      if (existing) {
        const items = prev.items.map(i => i.sku === sku ? {
          ...i,
          quantity: i.quantity + quantity
        } : i);
        const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        return {
          ...prev,
          items,
          total,
          item_count: items.reduce((s, i) => s + i.quantity, 0)
        };
      }
      // New item: don't add ghost item with price:0, just bump item_count optimistically
      return {
        ...prev,
        item_count: (prev.item_count || 0) + quantity
      };
    });
    setIsCartOpen(true); // Open mini-cart immediately

    if (isAuthenticated) {
      try {
        await api.post('/cart/items', {
          sku,
          quantity
        });
      } finally {
        await fetchCart(); // Fetch real data (fills in new item with correct price/name/image)
      }
    }
  }, [fetchCart, isAuthenticated]);
  const removeFromCart = useCallback(async sku => {
    setCart(prev => {
      const items = prev.items?.filter(i => i.sku !== sku) || [];
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const item_count = items.reduce((sum, i) => sum + i.quantity, 0);
      return {
        ...prev,
        items,
        total,
        item_count
      };
    });
    if (isAuthenticated) {
      try {
        await api.delete(`/cart/items/${sku}`);
      } finally {
        await fetchCart();
      }
    }
  }, [fetchCart, isAuthenticated]);
  const updateQuantity = useCallback(async (sku, quantity) => {
    if (quantity < 1) return removeFromCart(sku);
    setCart(prev => {
      const items = prev.items?.map(i => i.sku === sku ? {
        ...i,
        quantity
      } : i) || [];
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const item_count = items.reduce((sum, i) => sum + i.quantity, 0);
      return {
        ...prev,
        items,
        total,
        item_count
      };
    });
    if (isAuthenticated) {
      try {
        await api.patch(`/cart/items/${sku}`, {
          quantity
        });
      } finally {
        await fetchCart();
      }
    }
  }, [fetchCart, removeFromCart, isAuthenticated]);
  const clearCart = useCallback(async () => {
    setCart({
      items: [],
      total: 0,
      item_count: 0
    });
    if (isAuthenticated) {
      try {
        await api.delete('/cart');
      } finally {
        await fetchCart();
      }
    }
  }, [fetchCart, isAuthenticated]);
  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  return <CartContext.Provider value={{
    cart,
    loading,
    itemCount,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart
  }}>
      {children}
    </CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export /**
 * Arrow Function useCart
 * @returns {any}
 */
const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};