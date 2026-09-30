import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/common/ProductCard';
import { ProductService } from '../services/product.service';
import { Product, Category, Pagination } from '../types';
import {
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PackageSearch,
  Check,
} from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state from URL query params
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentSort = searchParams.get('sortBy') || 'newest';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentRating = searchParams.get('rating') || '';
  const currentInStock = searchParams.get('inStock') === 'true';
  const currentPage = Number(searchParams.get('page')) || 1;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available brands list
  const brands = [
    'Sony',
    'Apple',
    'Bose',
    'Herman Miller',
    'Dell',
    'Samsung',
    'Keychron',
    'Logitech',
    'Nike',
    'Peak Design',
    'BenQ',
    'DJI',
    'Anker',
    'Marshall',
    'Garmin',
    'ApexCraft',
  ];

  // Load categories
  useEffect(() => {
    ProductService.getCategories().then(setCategories).catch(console.error);
  }, []);

  // Fetch products whenever search params change
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const query: any = {
          page: currentPage,
          limit: 12,
          sortBy: currentSort,
        };

        if (currentSearch) query.search = currentSearch;
        if (currentCategory) query.category = currentCategory;
        if (currentBrand) query.brand = currentBrand;
        if (currentMinPrice) query.minPrice = Number(currentMinPrice);
        if (currentMaxPrice) query.maxPrice = Number(currentMaxPrice);
        if (currentRating) query.rating = Number(currentRating);
        if (currentInStock) query.inStock = true;

        const res = await ProductService.getProducts(query);
        setProducts(res.data);
        setPagination(res.pagination);
      } catch (err) {
        console.error('Catalog fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [
    currentCategory,
    currentSearch,
    currentBrand,
    currentSort,
    currentMinPrice,
    currentMaxPrice,
    currentRating,
    currentInStock,
    currentPage,
  ]);

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === '') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.set('page', '1'); // reset page on filter change
    setSearchParams(next);
  };

  // Body scroll lock and ESC listener when mobile filters open
  useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileFilterOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileFilterOpen]);

  const getVisiblePages = (current: number, total: number) => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', total);
    } else if (current >= total - 2) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total);
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total);
    }
    return pages;
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    currentCategory ||
      currentSearch ||
      currentBrand ||
      currentMinPrice ||
      currentMaxPrice ||
      currentRating ||
      currentInStock
  );

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentSearch
                ? `Search results for "${currentSearch}"`
                : currentCategory
                ? categories.find((c) => c.slug === currentCategory)?.name || 'Products'
                : 'All Products'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Showing {products.length} of {pagination.total} premium products
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>Filters {hasActiveFilters && '•'}</span>
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-medium text-slate-500">Sort by:</span>
              <select
                value={currentSort}
                onChange={(e) => updateParam('sortBy', e.target.value)}
                className="bg-white border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 shadow-2xs"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="best_selling">Best Selling</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="relevance">Relevance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 py-4 border-b border-slate-200/80">
            <span className="text-xs font-semibold text-slate-500 mr-1">Active filters:</span>
            {currentSearch && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-medium">
                Keyword: {currentSearch}
                <button onClick={() => updateParam('search', null)}>
                  <X className="w-3 h-3 text-slate-600 hover:text-black" />
                </button>
              </span>
            )}
            {currentCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium">
                Category: {categories.find((c) => c.slug === currentCategory)?.name || currentCategory}
                <button onClick={() => updateParam('category', null)}>
                  <X className="w-3 h-3 text-emerald-700 hover:text-black" />
                </button>
              </span>
            )}
            {currentBrand && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                Brand: {currentBrand}
                <button onClick={() => updateParam('brand', null)}>
                  <X className="w-3 h-3 text-blue-700 hover:text-black" />
                </button>
              </span>
            )}
            {currentRating && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                {currentRating}★ & above
                <button onClick={() => updateParam('rating', null)}>
                  <X className="w-3 h-3 text-amber-700 hover:text-black" />
                </button>
              </span>
            )}
            {currentInStock && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-medium">
                In Stock Only
                <button onClick={() => updateParam('inStock', null)}>
                  <X className="w-3 h-3 text-teal-700 hover:text-black" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-600 hover:underline font-bold ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Categories
                </h3>
                <div className="space-y-1.5">
                  <button
                    onClick={() => updateParam('category', null)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      !currentCategory
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateParam('category', cat.slug)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        currentCategory === cat.slug
                          ? 'bg-emerald-50 text-emerald-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {cat._count?.products !== undefined && (
                        <span className="text-[10px] text-slate-400">{cat._count.products}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Price Range (₹)
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={currentMinPrice}
                    onChange={(e) => updateParam('minPrice', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={currentMaxPrice}
                    onChange={(e) => updateParam('maxPrice', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Brand Filter */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Brands
                </h3>
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  {brands.map((brand) => {
                    const isSelected = currentBrand === brand;
                    return (
                      <button
                        key={brand}
                        onClick={() => updateParam('brand', isSelected ? null : brand)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-700 font-bold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{brand}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Minimum Rating
                </h3>
                <div className="space-y-1">
                  {[4, 3, 2].map((stars) => (
                    <button
                      key={stars}
                      onClick={() =>
                        updateParam('rating', currentRating === String(stars) ? null : String(stars))
                      }
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        currentRating === String(stars)
                          ? 'bg-amber-50 text-amber-800 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {stars}★ and above
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={currentInStock}
                    onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : null)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span>Exclude Out of Stock</span>
                </label>
              </div>
            </div>
          </div>

          {/* Product Grid & Pagination */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
                <p className="text-xs text-slate-500">Loading catalog items...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <PackageSearch className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">No products found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  We couldn't find any products matching your active filters. Try resetting the filters or searching with different terms.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-emerald-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-12 pb-6 flex-wrap">
                    <button
                      onClick={() => updateParam('page', String(currentPage - 1))}
                      disabled={!pagination.hasPrev}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {getVisiblePages(currentPage, pagination.totalPages).map((pageNum, idx) => {
                      if (pageNum === '...') {
                        return (
                          <span
                            key={`ellipsis-${idx}`}
                            className="w-8 h-8 flex items-center justify-center text-xs text-slate-400 select-none"
                          >
                            ...
                          </span>
                        );
                      }
                      const isCurrent = pageNum === currentPage;
                      return (
                        <button
                          key={`page-${pageNum}`}
                          onClick={() => updateParam('page', String(pageNum))}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-bold transition-colors ${
                            isCurrent
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => updateParam('page', String(currentPage + 1))}
                      disabled={!pagination.hasNext}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
            <div className="w-screen max-w-sm bg-white p-5 sm:p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">Filters</h2>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-6">
                {/* Mobile Categories */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Category</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          updateParam('category', currentCategory === c.slug ? null : c.slug);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium ${
                          currentCategory === c.slug
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'border-slate-200 text-slate-700'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Brands */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Brand</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {brands.slice(0, 8).map((b) => (
                      <button
                        key={b}
                        onClick={() => {
                          updateParam('brand', currentBrand === b ? null : b);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium ${
                          currentBrand === b
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-slate-200 text-slate-700'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => {
                    clearAllFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="flex-1 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl text-slate-700"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2.5 text-xs font-semibold bg-emerald-600 text-white rounded-xl"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
