import {createContext,useContext,useState,useEffect,useCallback,useRef} from 'react';
import api from '../api';
import {useAuth} from './AuthContext';
const CartContext=createContext(null);
const emptyCart=()=>({items:[],total:0,item_count:0});
export function CartProvider({children}) {
  const {user}=useAuth();
  const owner=user?.id || null;
  const ownerRef=useRef(owner); ownerRef.current=owner;
  const [cart,setCart]=useState(emptyCart);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [isCartOpen,setIsCartOpen]=useState(false);
  const queue=useRef(Promise.resolve());
  const fetchCart=useCallback(async()=>{
    if(!owner) return;
    setLoading(true);
    try {const res=await api.get('/cart'); if(ownerRef.current===owner) {setCart(res.data);setError('');}}
    catch(err) {if(ownerRef.current===owner) setError(err.response?.data?.error || 'Could not load your cart. Please try again.');}
    finally {if(ownerRef.current===owner) setLoading(false);}
  },[owner]);
  useEffect(()=>{setCart(emptyCart());setError('');setIsCartOpen(false);setLoading(false);fetchCart();},[fetchCart]);
  const mutate=useCallback((method,url,data,open=false)=>{
    if(!owner) return Promise.reject(new Error('Please sign in to update your cart.'));
    const task=queue.current.catch(()=>{}).then(async()=>{
      if(ownerRef.current!==owner) throw new Error('Your session changed. Please try again.');
      setLoading(true);
      try {await api.request({method,url,data}); await fetchCart(); if(open && ownerRef.current===owner) setIsCartOpen(true);}
      catch(err) {if(ownerRef.current===owner) {setError(err.response?.data?.error || err.message || 'Could not update your cart.');setLoading(false);} throw err;}
    });
    queue.current=task;return task;
  },[owner,fetchCart]);
  const addToCart=useCallback((sku,quantity=1)=>mutate('post','/cart/items',{sku,quantity},true),[mutate]);
  const removeFromCart=useCallback(sku=>mutate('delete','/cart/items/'+encodeURIComponent(sku)),[mutate]);
  const updateQuantity=useCallback((sku,quantity)=>quantity<1?removeFromCart(sku):mutate('patch','/cart/items/'+encodeURIComponent(sku),{quantity}),[mutate,removeFromCart]);
  const clearCart=useCallback(()=>mutate('delete','/cart'),[mutate]);
  const itemCount=cart.items?.reduce((sum,item)=>sum+Number(item.quantity),0)||0;
  return <CartContext.Provider value={{cart,loading,error,itemCount,isCartOpen,setIsCartOpen,addToCart,removeFromCart,updateQuantity,clearCart,fetchCart}}>{children}</CartContext.Provider>;
}
export const useCart=()=>{const value=useContext(CartContext);if(!value) throw new Error('useCart must be inside CartProvider');return value;};
