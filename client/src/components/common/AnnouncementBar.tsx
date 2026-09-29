import React from 'react';
import { Truck, ShieldCheck, Tag } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <Tag className="w-3.5 h-3.5" />
            <span>FESTIVE SALE: Use code <strong>WELCOME10</strong> for 10% off your first order!</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-slate-400">
          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Free Express Shipping above ₹2,000</span>
          </span>
          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>100% Genuine Certified Products</span>
          </span>
        </div>
      </div>
    </div>
  );
};
