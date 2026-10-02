'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { ShoppingBag, X, ArrowRight } from 'lucide-react';

interface ToastNotification {
  id: string;
  message: string;
  eventName?: string;
}

interface CartContextType {
  cartItemIds: string[];
  confirmedEventIds: string[];
  addToCart: (eventId: string, eventName?: string) => void;
  removeFromCart: (eventId: string, eventName?: string) => void;
  toggleCartItem: (eventId: string, eventName?: string) => void;
  clearCart: () => void;
  isInCart: (eventId: string) => boolean;
  isConfirmed: (eventId: string) => boolean;
  refreshRegistrations: () => Promise<void>;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'parinaam_registration_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItemIds, setCartItemIds] = useState<string[]>([]);
  const [confirmedEventIds, setConfirmedEventIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Key storage per user or guest
  const storageKey = user?.id ? `${CART_STORAGE_KEY}_${user.id}` : CART_STORAGE_KEY;

  // Fetch student confirmed registrations from RDS
  const refreshRegistrations = useCallback(async () => {
    if (!user || user.role !== 'student') {
      setConfirmedEventIds([]);
      return;
    }
    try {
      const res = await fetch('/api/registrations');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data.registrations)) {
          const confirmed = data.data.registrations
            .filter((r: any) => r.status === 'CONFIRMED')
            .map((r: any) => (r.event_id || r.eventId) as string);
          setConfirmedEventIds(confirmed);
        }
      }
    } catch (e) {
      console.error('Failed to fetch student registrations:', e);
    }
  }, [user]);

  // Load cart and registrations whenever user changes
  useEffect(() => {
    if (user && user.role !== 'student') {
      setCartItemIds([]);
      setConfirmedEventIds([]);
      setIsLoaded(true);
      return;
    }
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setCartItemIds(JSON.parse(stored));
      } else {
        setCartItemIds([]);
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }

    refreshRegistrations();
  }, [storageKey, user, refreshRegistrations]);

  // Auto-dismiss toast notification after 5 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Sync to localStorage
  const saveCart = (newIds: string[]) => {
    setCartItemIds(newIds);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newIds));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  };

  const showToast = (message: string, eventName?: string) => {
    setToast({
      id: Date.now().toString(),
      message,
      eventName,
    });
  };

  const addToCart = (eventId: string, eventName?: string) => {
    if (!eventId || cartItemIds.includes(eventId)) return;
    saveCart([...cartItemIds, eventId]);
    showToast('This event is added to your cart. Check your cart!', eventName);
  };

  const removeFromCart = (eventId: string, eventName?: string) => {
    saveCart(cartItemIds.filter(id => id !== eventId));
  };

  const toggleCartItem = (eventId: string, eventName?: string) => {
    if (cartItemIds.includes(eventId)) {
      removeFromCart(eventId, eventName);
    } else {
      addToCart(eventId, eventName);
    }
  };

  const clearCart = () => {
    saveCart([]);
  };

  const isInCart = (eventId: string): boolean => {
    return cartItemIds.includes(eventId);
  };

  const isConfirmed = (eventId: string): boolean => {
    return confirmedEventIds.includes(eventId);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cartItemIds,
        confirmedEventIds,
        addToCart,
        removeFromCart,
        toggleCartItem,
        clearCart,
        isInCart,
        isConfirmed,
        refreshRegistrations,
        cartCount: cartItemIds.length,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}

      {/* Toast Notification Popup when event added to cart */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] max-w-sm w-full bg-[#130924]/95 border border-fuchsia-500/60 rounded-2xl p-4 shadow-[0_0_40px_rgba(217,70,239,0.35)] backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 flex items-center justify-center shrink-0">
              <ShoppingBag size={20} className="animate-pulse" />
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-fuchsia-400">
                  Added to Cart
                </span>
                <button
                  type="button"
                  onClick={() => setToast(null)}
                  className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
                  aria-label="Dismiss toast"
                >
                  <X size={14} />
                </button>
              </div>
              {toast.eventName && (
                <p className="text-sm font-bold text-white truncate mt-0.5 font-['Pixelify_Sans',_monospace]">
                  {toast.eventName}
                </p>
              )}
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {toast.message}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setToast(null);
                    setIsCartOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(217,70,239,0.4)] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <span>Check Cart</span>
                  <ArrowRight size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setToast(null)}
                  className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
