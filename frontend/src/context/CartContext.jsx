import {createContext,useContext,useState,useEffect,useCallback,useRef} from 'react';
import api from '../api';
import {useAuth} from './AuthContext';
import {useToast} from './ToastContext';

// Signed-in buyers use the server cart. Guests keep { sku, quantity } pairs in this browser;
// prices and stock always come from the server (/cart/preview). At login the guest cart is
// merged into the account cart (/cart/merge), so nobody has to sign up just to start shopping.
const CartContext=createContext(null);
const GUEST_KEY='UniShop_guest_cart';
const emptyCart=()=>({items:[],total:0,item_count:0});
const readGuest=()=>{
  try {
    const items=JSON.parse(localStorage.getItem(GUEST_KEY)||'[]');
    return Array.isArray(items)?items.filter(i=>i && typeof i.sku==='string' && Number.isSafeInteger(i.quantity) && i.quantity>0):[];
  } catch {return [];}
};
const writeGuest=items=>{
  try {items.length?localStorage.setItem(GUEST_KEY,JSON.stringify(items)):localStorage.removeItem(GUEST_KEY);} catch {/* storage blocked: cart lasts for this page only */}
};
const plural=(n,word)=>`${n} ${word}${n===1?'':'s'}`;

export function CartProvider({children}) {
  const {user}=useAuth();
  const {showToast}=useToast();
  const owner=user?.id || null;
  const ownerRef=useRef(owner); ownerRef.current=owner;
  const [cart,setCart]=useState(emptyCart);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [isCartOpen,setIsCartOpen]=useState(false);
  const queue=useRef(Promise.resolve());
  const guestMemory=useRef(readGuest());
  const getGuest=()=>{const stored=readGuest();return stored.length?stored:guestMemory.current;};
  const setGuest=items=>{guestMemory.current=items;writeGuest(items);};

  const fetchCart=useCallback(async()=>{
    setLoading(true);
    try {
      if(owner) {
        const res=await api.get('/cart');
        if(ownerRef.current===owner) {setCart(res.data);setError('');}
        return;
      }
      const items=getGuest();
      if(!items.length) {setCart(emptyCart());setError('');return;}
      const res=await api.post('/cart/preview',{items});
      if(ownerRef.current!==null) return;
      if(res.data.unavailable?.length) setGuest(items.filter(i=>!res.data.unavailable.includes(i.sku)));
      setCart(res.data);setError('');
    }
    catch(err) {if(ownerRef.current===owner) setError(err.response?.data?.error || 'Could not load your cart. Please try again.');}
    finally {if(ownerRef.current===owner) setLoading(false);}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[owner]);

  const enqueue=useCallback(work=>{
    const task=queue.current.catch(()=>{}).then(work);
    queue.current=task;return task;
  },[]);

  // On sign-in: merge any guest cart first, then load the account cart.
  useEffect(()=>{
    // Stay in a loading state until the cart (and any merge) has arrived, so pages never flash "empty".
    setCart(emptyCart());setError('');setIsCartOpen(false);setLoading(Boolean(owner) || getGuest().length>0);
    enqueue(async()=>{
      const guest=getGuest();
      if(owner && guest.length) {
        try {
          const {data}=await api.post('/cart/merge',{items:guest});
          setGuest([]);
          const notes=[];
          if(data.adjusted?.length) notes.push(`${plural(data.adjusted.length,'quantity')} reduced to what is in stock`.replace('quantitys','quantities'));
          if(data.skipped?.length) notes.push(`${plural(data.skipped.length,'item')} no longer available`);
          if(data.merged) showToast(notes.length?`Your cart was saved to your account (${notes.join('; ')}).`:'Your cart was saved to your account.',notes.length?'warning':'success',5000);
          else if(notes.length) showToast(`Items from your cart are no longer available.`,'warning',5000);
        } catch {
          showToast('We could not move your cart to your account yet. Your items are kept and will be added next time.','warning',5000);
        }
      }
      await fetchCart();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[owner,fetchCart,enqueue]);

  // Guest stock check: ask the server what is available before changing the stored quantity.
  const guestSetQuantity=useCallback(async(sku,quantity)=>{
    const {data}=await api.post('/cart/preview',{items:[{sku,quantity}]});
    const item=data.items?.[0];
    if(!item) throw new Error('This item is no longer available.');
    if(quantity>Number(item.available_stock)) throw new Error(Number(item.available_stock)>0?`Only ${item.available_stock} units available.`:'This item is sold out.');
    const items=getGuest().filter(i=>i.sku!==sku);
    setGuest([...items,{sku,quantity}]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const run=useCallback((serverCall,guestCall,open=false)=>enqueue(async()=>{
    const startedAs=ownerRef.current;
    setLoading(true);
    try {
      if(startedAs) await serverCall(); else await guestCall();
      if(ownerRef.current!==startedAs) throw new Error('Your session changed. Please try again.');
      await fetchCart();
      if(open && ownerRef.current===startedAs) setIsCartOpen(true);
    } catch(err) {
      if(ownerRef.current===startedAs) {setError(err.response?.data?.error || err.message || 'Could not update your cart.');setLoading(false);}
      throw err;
    }
  }),[enqueue,fetchCart]);

  const addToCart=useCallback((sku,quantity=1)=>run(
    ()=>api.post('/cart/items',{sku,quantity}),
    ()=>guestSetQuantity(sku,(getGuest().find(i=>i.sku===sku)?.quantity||0)+quantity),
    true),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [run,guestSetQuantity]);
  const removeFromCart=useCallback(sku=>run(
    ()=>api.delete('/cart/items/'+encodeURIComponent(sku)),
    async()=>setGuest(getGuest().filter(i=>i.sku!==sku))),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [run]);
  const updateQuantity=useCallback((sku,quantity)=>quantity<1?removeFromCart(sku):run(
    ()=>api.patch('/cart/items/'+encodeURIComponent(sku),{quantity}),
    ()=>guestSetQuantity(sku,quantity)),
  [run,removeFromCart,guestSetQuantity]);
  const clearCart=useCallback(()=>run(()=>api.delete('/cart'),async()=>setGuest([])),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [run]);

  const itemCount=cart.items?.reduce((sum,item)=>sum+Number(item.quantity),0)||0;
  return <CartContext.Provider value={{cart,loading,error,itemCount,isGuestCart:!owner,isCartOpen,setIsCartOpen,addToCart,removeFromCart,updateQuantity,clearCart,fetchCart}}>{children}</CartContext.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export const useCart=()=>{const value=useContext(CartContext);if(!value) throw new Error('useCart must be inside CartProvider');return value;};
