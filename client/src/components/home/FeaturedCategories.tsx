import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';
import { Headphones, Laptop, Smartphone, Armchair, Shirt, Camera } from 'lucide-react';

interface FeaturedCategoriesProps {
  categories: Category[];
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ categories }) => {
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'electronics':
        return <Headphones className="w-6 h-6 text-emerald-600" />;
      case 'computers':
        return <Laptop className="w-6 h-6 text-blue-600" />;
      case 'smartphones':
        return <Smartphone className="w-6 h-6 text-purple-600" />;
      case 'home-office':
        return <Armchair className="w-6 h-6 text-amber-600" />;
      case 'fashion':
        return <Shirt className="w-6 h-6 text-rose-600" />;
      case 'photography':
        return <Camera className="w-6 h-6 text-indigo-600" />;
      default:
        return <Headphones className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-600">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Browse by Category
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            Explore all categories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group relative bg-slate-50 hover:bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-soft transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-white group-hover:bg-emerald-50 border border-slate-100 group-hover:border-emerald-200 flex items-center justify-center mb-3 shadow-2xs group-hover:scale-110 transition-all duration-300">
                {getCategoryIcon(cat.slug)}
              </div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                {cat._count?.products !== undefined ? `${cat._count.products} Products` : 'Shop Now'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
