import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { ProductService } from '../../services/product.service';
import { formatCurrency } from '../../utils/formatters';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setQuery('');
      setSuggestions([]);
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await ProductService.getSuggestions(query);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectProduct = (slug: string) => {
    onClose();
    navigate(`/products/${slug}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative mx-auto max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-slate-200">
        <form onSubmit={handleSubmit} className="relative flex items-center border-b border-slate-100 px-4">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Sony headphones, Apple MacBook, ergonomic desk..."
            className="w-full py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          {loading && <Loader2 className="w-5 h-5 text-emerald-600 animate-spin mr-2" />}
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            ESC
          </button>
        </form>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-4">
          {query.trim().length >= 2 ? (
            suggestions.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-2">
                  Matching Products
                </div>
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectProduct(item.slug)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <img
                      src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80'}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-emerald-600 font-semibold">{item.brand}</div>
                      <div className="text-sm font-medium text-slate-800 truncate group-hover:text-emerald-600">
                        {item.title}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-slate-900">
                        {formatCurrency(item.salePrice || item.price)}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  <span>View all results for "{query}"</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : !loading ? (
              <div className="py-8 text-center text-slate-500 text-sm">
                No matching products found for "{query}". Try checking the spelling or searching for a brand.
              </div>
            ) : null
          ) : (
            <div className="py-6 px-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Trending Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {['Sony Headphones', 'MacBook M3', 'Keychron', 'Mechanical Keyboard', 'Standing Desk', 'Nike Pegasus'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                    }}
                    className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
