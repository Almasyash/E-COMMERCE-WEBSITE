import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Star } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white py-16 sm:py-24 lg:py-28">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-emerald-400 text-xs font-semibold backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              <span>THE 2026 FLAGSHIP COLLECTION IS LIVE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Hardware Crafted For{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Peak Performance.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Explore authentic noise-canceling headphones, Apple M3 workstations, hot-swappable custom keyboards, and ergonomic studio desks designed for creators and professionals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/products"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg hover:shadow-emerald-500/25"
              >
                <span>Shop All Hardware</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products?featured=true"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm transition-all"
              >
                <span>Featured Picks</span>
              </Link>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">100%</div>
                <div className="text-xs text-slate-400 mt-0.5">Authentic Certified</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">24h</div>
                <div className="text-xs text-slate-400 mt-0.5">Priority Dispatch</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white flex items-center gap-1">
                  <span>4.9</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Customer Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Hero Card Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl p-2 bg-gradient-to-b from-slate-700/50 to-slate-800/30 border border-slate-700/60 shadow-2xl backdrop-blur-xl">
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 sm:aspect-square bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                  alt="Sony WH-1000XM5 Headphones"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      BEST SELLER
                    </span>
                    <span className="text-xs text-slate-300 font-medium">Sony Precision Audio</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Sony WH-1000XM5 Wireless ANC
                  </h3>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                    <div className="text-white font-bold">₹26,990 <span className="text-xs text-slate-400 line-through">₹29,990</span></div>
                    <Link
                      to="/products/sony-wh-1000xm5-wireless-headphones"
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      View Specs &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
