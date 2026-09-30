import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '../stores/wishlistStore';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { formatCurrency } from '../utils/formatters';

export const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { wishlistItems, toggleWishlist, fetchWishlist, isLoading } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login?redirect=/account/wishlist');
      return;
    }
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, authLoading, navigate, fetchWishlist]);

  const handleAddToCart = async (productId: string) => {
    try {
      await addItem(productId);
    } catch (err: any) {
      alert(err.message || 'Could not add to cart');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 mb-8 border-b border-slate-200/80">
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Wishlist ({wishlistItems.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">Saved items you are watching for price drops or future orders</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Your Wishlist is Empty</h2>
            <p className="text-xs text-slate-500 mb-6">
              Tap the heart icon on any product to save it here for later.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-emerald-600 transition-colors"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-soft transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-square bg-slate-50">
                  <img
                    src={
                      item.image ||
                      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => toggleWishlist(item.productId)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-500 hover:bg-white shadow-sm"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-600">
                      {item.brand}
                    </span>
                    <Link
                      to={`/products/${item.slug}`}
                      className="block text-xs sm:text-sm font-semibold text-slate-900 hover:text-emerald-600 truncate mt-0.5"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-sm font-bold text-slate-900">
                        {formatCurrency(item.salePrice || item.price)}
                      </span>
                      {item.salePrice && item.salePrice < item.price && (
                        <span className="text-[11px] text-slate-400 line-through">
                          {formatCurrency(item.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => handleAddToCart(item.productId)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
