import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

export const CustomerBenefits: React.FC = () => {
  const benefits = [
    {
      icon: <Truck className="w-6 h-6 text-emerald-600" />,
      title: 'Free Express Shipping',
      description: 'Zero shipping fee on all orders over ₹2,000 across India with real-time tracking.',
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-blue-600" />,
      title: '7-Day Hassle-Free Returns',
      description: 'Not fully satisfied? Schedule a free doorstep pickup within 7 days of delivery.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-600" />,
      title: 'Official Brand Warranty',
      description: 'All hardware is 100% factory original with manufacturer service warranty included.',
    },
    {
      icon: <Headphones className="w-6 h-6 text-purple-600" />,
      title: 'Tech Expert Assistance',
      description: 'Our knowledgeable hardware engineers are available 7 days a week to assist your setup.',
    },
  ];

  return (
    <section className="py-12 bg-slate-50/60 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4 hover:shadow-soft transition-all"
            >
              <div className="p-3 bg-slate-50 rounded-xl flex-shrink-0">{benefit.icon}</div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{benefit.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
