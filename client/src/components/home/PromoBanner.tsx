import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const PromoBanner: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-8 sm:p-12 text-white shadow-xl">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-4 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>UPGRADE YOUR DESK SETUP</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Ergonomic Workstations & Motorized Standing Desks
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
              Eliminate fatigue with dual-motor quiet height adjustment, Herman Miller chairs, and ambient eye-care light bars.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                to="/products?category=home-office"
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md"
              >
                <span>Shop Workspace Gear</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs text-slate-300">
                Use code <strong>FESTIVE20</strong> for 20% off
              </span>
            </div>
          </div>

          {/* Background decorative graphic */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 lg:opacity-35 pointer-events-none hidden sm:block">
            <img
              src="https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80"
              alt="Ergonomic Workspace"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
