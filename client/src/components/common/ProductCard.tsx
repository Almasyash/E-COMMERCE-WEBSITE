import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency, calculateDiscountPercentage } from '../../utils/formatters';
import { RatingStars } from './RatingStars';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

  const discount = calculateDiscountPercentage(product.price, product.salePrice);
  const inStock = (product.inventory?.quantity ?? 10) > 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock || isAdding) return;

    try {
      setIsAdding(true);
      const defaultVariantId = product.variants?.[0]?.id || null;
      await addItem(product.id, defaultVariantId, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (err: any) {
      alert(err.message || 'Could not add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleWishlist(product.id);
    } catch (err: any) {
      alert(err.message || 'Please sign in to save items to your wishlist');
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 overflow-hidden shadow-sm hover:shadow-soft transition-all duration-300 flex flex-col justify-between">
      {/* Product Image and Badges */}
      <Link to={`/products/${product.slug}`} className="block relative bg-slate-50 aspect-square overflow-hidden">
        <img
          src={primaryImage}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discount && (
            <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              -{discount}%
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm z-10 ${
            isInWishlist
              ? 'bg-rose-50 text-rose-500 border border-rose-200'
              : 'bg-white/80 hover:bg-white text-slate-500 hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-rose-500' : ''}`} />
        </button>

        {!inStock && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-emerald-600">
              {product.brand}
            </span>
            <span>{product.category?.name}</span>
          </div>

          <Link to={`/products/${product.slug}`} className="block group-hover:text-emerald-600 transition-colors">
            <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
              {product.title}
            </h3>
          </Link>

          <div className="mt-2 mb-3">
            <RatingStars rating={product.rating} count={product.reviewCount} />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base font-bold text-slate-900">
              {formatCurrency(product.salePrice || product.price)}
            </span>
            {product.salePrice && product.salePrice < product.price && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock || isAdding}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-medium text-xs transition-all duration-200 ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : inStock
                ? 'bg-slate-900 hover:bg-emerald-600 text-white shadow-sm hover:shadow'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Cart</span>
              </>
            ) : inStock ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
              </>
            ) : (
              <span>Out of Stock</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
