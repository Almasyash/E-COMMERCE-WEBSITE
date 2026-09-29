import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, Check, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      {/* Top Banner / Guarantee */}
      <div className="border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Secure Checkout</h4>
              <p className="text-slate-400 text-xs mt-0.5">Encrypted transactions & trusted Indian gateways</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-blue-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Genuine Brand Products</h4>
              <p className="text-slate-400 text-xs mt-0.5">Direct from authorized distributors & manufacturers</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-amber-400">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">24/7 Dedicated Support</h4>
              <p className="text-slate-400 text-xs mt-0.5">Reach our product specialists anytime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Apex<span className="text-emerald-400">Cart</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              ApexCart is a premier curated destination for cutting-edge electronics, developer gear, ergonomic furniture, and modern lifestyle essentials. Engineered for speed, authenticity, and peace of mind.
            </p>
            <div className="flex items-center gap-2 pt-2 text-slate-300">
              <span className="font-semibold text-white">Accepted Payments:</span>
              <span className="text-xs bg-slate-800 px-2 py-1 rounded">Razorpay</span>
              <span className="text-xs bg-slate-800 px-2 py-1 rounded">UPI</span>
              <span className="text-xs bg-slate-800 px-2 py-1 rounded">Cards</span>
              <span className="text-xs bg-slate-800 px-2 py-1 rounded">COD</span>
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Explore Catalog</h5>
            <ul className="space-y-2.5">
              <li>
                <Link to="/products?category=electronics" className="hover:text-white transition-colors">
                  Audio & Noise Canceling
                </Link>
              </li>
              <li>
                <Link to="/products?category=computers" className="hover:text-white transition-colors">
                  Laptops & Workstations
                </Link>
              </li>
              <li>
                <Link to="/products?category=smartphones" className="hover:text-white transition-colors">
                  Smartphones & Wearables
                </Link>
              </li>
              <li>
                <Link to="/products?category=home-office" className="hover:text-white transition-colors">
                  Ergonomic Standing Desks
                </Link>
              </li>
              <li>
                <Link to="/products?category=photography" className="hover:text-white transition-colors">
                  Cameras & Cinema Lenses
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Customer Care</h5>
            <ul className="space-y-2.5">
              <li>
                <Link to="/account/orders" className="hover:text-white transition-colors">
                  Track Order Status
                </Link>
              </li>
              <li>
                <Link to="/account/wishlist" className="hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Shipping & Return Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Warranty & Guarantees
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Support & Help Center
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Stay Informed</h5>
            <p className="text-xs text-slate-400 mb-3">
              Get secret promotional codes and early access to hardware drops.
            </p>
            {subscribed ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-colors"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <div>
            © {new Date().getFullYear()} ApexCart Inc. All rights reserved. Built with React, Node, Express, & PostgreSQL.
          </div>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Safeguards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
