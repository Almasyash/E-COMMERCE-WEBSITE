import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  Plus,
  Minus,
  Check,
  Loader2,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { ProductService } from '../services/product.service';
import { ReviewService } from '../services/order.service';
import { Product, ProductVariant } from '../types';
import { formatCurrency, calculateDiscountPercentage, formatDate } from '../utils/formatters';
import { RatingStars } from '../components/common/RatingStars';
import { ProductCard } from '../components/common/ProductCard';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useAuthStore } from '../stores/authStore';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'shipping' | 'reviews'>('specs');

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => product ? state.isInWishlist(product.id) : false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!slug) return;
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await ProductService.getProductBySlug(slug);
        setProduct(data);
        setSelectedImage(
          data.images?.find((img) => img.isPrimary)?.url ||
            data.images?.[0]?.url ||
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
        );
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }

        // Fetch related products
        if (data.categoryId) {
          const related = await ProductService.getRelatedProducts(data.id, data.categoryId);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-32 flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading hardware specs & imagery...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-32 text-center bg-slate-50 px-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">
          The requested product may have been unlisted or moved.
        </p>
        <Link
          to="/products"
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-emerald-600 transition-colors"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant
    ? selectedVariant.salePrice || selectedVariant.price
    : product.salePrice || product.price;

  const originalPrice = selectedVariant ? selectedVariant.price : product.price;
  const discount = calculateDiscountPercentage(originalPrice, currentPrice);

  const availableStock = selectedVariant
    ? selectedVariant.stock
    : product.inventory?.quantity ?? 10;

  const inStock = availableStock > 0;

  let specsObj: Record<string, string> = {};
  if (product.specifications) {
    try {
      specsObj = JSON.parse(product.specifications);
    } catch {
      specsObj = {};
    }
  }

  const handleAddToCart = async () => {
    if (!inStock || addingToCart) return;
    setAddingToCart(true);
    try {
      await addItem(product.id, selectedVariant?.id || null, quantity);
    } catch (err: any) {
      alert(err.message || 'Error adding to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!inStock) return;
    try {
      await addItem(product.id, selectedVariant?.id || null, quantity);
      navigate('/checkout');
    } catch (err: any) {
      alert(err.message || 'Error initiating checkout');
    }
  };

  const handleToggleWishlist = async () => {
    try {
      await toggleWishlist(product.id);
    } catch (err: any) {
      alert(err.message || 'Please log in to save to your wishlist');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(location.pathname));
      return;
    }
    setSubmittingReview(true);
    setReviewMessage(null);
    try {
      await ReviewService.createReview({
        productId: product.id,
        rating: reviewRating,
        title: reviewTitle,
        content: reviewContent,
      });
      setReviewMessage('Your review has been submitted successfully!');
      setTimeout(() => {
        setReviewModalOpen(false);
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setReviewMessage(`Error: ${err.message}`);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-emerald-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link to="/products" className="hover:text-emerald-600 transition-colors">
            Catalog
          </Link>
          {product.category && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <Link
                to={`/products?category=${product.category.slug}`}
                className="hover:text-emerald-600 transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Hero Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Gallery (Left Col) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />

                {discount && (
                  <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    -{discount}% OFF
                  </span>
                )}

                <button
                  onClick={handleToggleWishlist}
                  className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-md transition-colors ${
                    isInWishlist
                      ? 'bg-rose-50 text-rose-500 border border-rose-200'
                      : 'bg-white/90 hover:bg-white text-slate-500 hover:text-rose-500'
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(img.url)}
                      className={`w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        selectedImage === img.url
                          ? 'border-emerald-600 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details & Actions (Right Col) */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                    {product.brand}
                  </span>
                  <span className="text-xs text-slate-400">SKU: {selectedVariant?.sku || product.sku}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {product.title}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 my-3">
                  <RatingStars rating={product.rating} count={product.reviewCount} size="md" />
                  <span className="text-xs text-slate-300">•</span>
                  <a
                    href="#reviews"
                    onClick={() => setActiveTab('reviews')}
                    className="text-xs font-semibold text-emerald-600 hover:underline"
                  >
                    {product.reviewCount} Verified Reviews
                  </a>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 my-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {formatCurrency(currentPrice)}
                  </span>
                  {originalPrice > currentPrice && (
                    <span className="text-base text-slate-400 line-through">
                      {formatCurrency(originalPrice)}
                    </span>
                  )}
                  {discount && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Save {formatCurrency(originalPrice - currentPrice)}
                    </span>
                  )}
                </div>

                {/* Description Excerpt */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Variant Selector */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-6 space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Choose Edition / Variant:
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {product.variants.map((v) => {
                        const isSelected = selectedVariant?.id === v.id;
                        return (
                          <button
                            key={v.id}
                            onClick={() => setSelectedVariant(v)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                              isSelected
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <span>{v.name}</span>
                            {v.price && (
                              <span className="ml-2 opacity-75 font-normal">
                                ({formatCurrency(v.salePrice || v.price)})
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Stock Status */}
                <div className="flex items-center gap-2 mb-6">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      inStock ? (availableStock <= 5 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-rose-500'
                    }`}
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    {inStock
                      ? availableStock <= 5
                        ? `Only ${availableStock} units left in stock — order soon!`
                        : `In Stock (${availableStock} units available)`
                      : 'Currently Out of Stock'}
                  </span>
                </div>

                {/* Quantity & CTA Buttons */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1 || !inStock}
                        className="p-2.5 hover:bg-white text-slate-600 disabled:opacity-40 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 text-xs font-bold text-slate-900">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                        disabled={quantity >= availableStock || !inStock}
                        className="p-2.5 hover:bg-white text-slate-600 disabled:opacity-40 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={!inStock || addingToCart}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-200"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
                    </button>
                  </div>

                  <button
                    onClick={handleBuyNow}
                    disabled={!inStock}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-200"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Buy Now with 1-Click Checkout</span>
                  </button>
                </div>
              </div>

              {/* Guarantee perks */}
              <div className="pt-6 mt-6 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-slate-500 text-[11px]">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Free Express Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-blue-600" />
                  <span>7-Day Return Policy</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>1-Yr Official Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info: Specs, Shipping, Reviews */}
        <div id="reviews" className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 mb-12">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 gap-8 mb-6">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-xs sm:text-sm font-bold transition-colors border-b-2 ${
                activeTab === 'specs'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 text-xs sm:text-sm font-bold transition-colors border-b-2 ${
                activeTab === 'shipping'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Shipping & Return Policy
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-xs sm:text-sm font-bold transition-colors border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Customer Reviews ({product.reviews?.length || 0})
            </button>
          </div>

          {/* Tab 1: Specifications */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Hardware & Build Details</h3>
              {Object.keys(specsObj).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(specsObj).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-500">{key}</span>
                      <span className="font-bold text-slate-900 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Standard manufacturer specifications apply for {product.title}. All components comply with ISO quality standards.
                </p>
              )}
            </div>
          )}

          {/* Tab 2: Shipping */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <h3 className="text-sm font-bold text-slate-900">Delivery Information</h3>
              <p>
                All orders are dispatched from our automated temperature-controlled fulfillment hubs within 24 hours. Free express shipping applies on all orders exceeding ₹2,000.
              </p>
              <h3 className="text-sm font-bold text-slate-900 pt-2">7-Day Doorstep Returns</h3>
              <p>
                If your item arrives damaged, defective, or different from described, initiate a return within 7 calendar days of delivery for a 100% full refund or free replacement.
              </p>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                <div>
                  <div className="text-3xl font-extrabold text-slate-900">
                    {product.rating.toFixed(1)} <span className="text-base text-slate-400 font-normal">/ 5.0</span>
                  </div>
                  <RatingStars rating={product.rating} count={product.reviewCount} size="md" />
                </div>
                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Write a Customer Review</span>
                </button>
              </div>

              {/* Review List */}
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                            {rev.user.firstName[0]}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900">
                              {rev.user.firstName} {rev.user.lastName}
                            </span>
                            <span className="ml-2 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                              ✓ Verified Buyer
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400">{formatDate(rev.createdAt)}</span>
                      </div>
                      <RatingStars rating={rev.rating} showCount={false} />
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{rev.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No customer reviews yet. Be the first verified buyer to leave feedback!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="py-8">
            <h3 className="text-xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Related Hardware Recommendations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setReviewModalOpen(false)} />
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 z-10">
            <h3 className="text-base font-bold text-slate-900 mb-1">Review {product.title}</h3>
            <p className="text-xs text-slate-500 mb-4">
              Share your feedback with the community. Verified purchase is required to submit reviews.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Your Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200 fill-slate-100'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exceptional noise cancellation and comfort"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Comments</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your user experience, build quality, and battery performance..."
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {reviewMessage && (
                <p className="text-xs font-medium p-2.5 rounded-lg bg-slate-100 text-slate-800">
                  {reviewMessage}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="flex-1 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
