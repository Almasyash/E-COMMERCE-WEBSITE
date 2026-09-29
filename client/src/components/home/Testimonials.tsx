import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Aditya Sen',
      role: 'Staff Engineer at Swiggy',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      content:
        'Ordered the Keychron Q1 Pro and Dell 4K hub monitor. Packaging was indestructible, dispatch took under 24 hours to Bengaluru, and both products came with genuine manufacturer seals.',
      product: 'Keychron Q1 Pro & Dell 4K Hub',
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Product Designer',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      content:
        'The Sony WH-1000XM5 active noise canceling is life-changing for focus in open office spaces. The WELCOME10 coupon gave me ₹2,000 off instantly. Seamless checkout experience!',
      product: 'Sony WH-1000XM5 Wireless ANC',
    },
    {
      name: 'Vikram Mehta',
      role: 'Tech Consultant',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      content:
        'ApexCart has become my go-to for all developer workspace equipment. Their order tracking timeline updates with every courier milestone accurately.',
      product: 'Apex Motorized Dual-Motor Desk',
    },
  ];

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-wider uppercase text-emerald-600">
            Real Customer Stories
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Trusted by 50,000+ Creators & Engineers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Read verified reviews from hardware enthusiasts across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{item.content}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>{item.name}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
                    </div>
                    <div className="text-[11px] text-slate-400">{item.role}</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-md max-w-[100px] truncate">
                  {item.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
