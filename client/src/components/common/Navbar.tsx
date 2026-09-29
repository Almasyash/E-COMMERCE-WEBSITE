import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  LogOut,
  Package,
  Shield,
  Layers,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const { itemCount, openCart } = useCartStore();
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);

  const navLinks = [
    { label: 'Shop All', href: '/products' },
    { label: 'Electronics', href: '/products?category=electronics' },
    { label: 'Computers', href: '/products?category=computers' },
    { label: 'Smartphones', href: '/products?category=smartphones' },
    { label: 'Home & Office', href: '/products?category=home-office' },
    { label: 'Fashion', href: '/products?category=fashion' },
  ];

  const handleLogout = () => {
    logout();
    setAccountMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-emerald-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-none">
                  Apex<span className="text-emerald-600">Cart</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                  Premium Store
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Actions (Search, Wishlist, Account, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-slate-500 bg-slate-100/80 hover:bg-slate-100 rounded-xl border border-transparent hover:border-slate-200 transition-colors"
              title="Search products (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline-block">Search catalog...</span>
              <kbd className="hidden md:inline-block text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 shadow-2xs">
                /
              </kbd>
            </button>

            {/* Wishlist */}
            <Link
              to="/account/wishlist"
              className="relative p-2.5 text-slate-700 hover:text-rose-500 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative p-2.5 text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account / Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                aria-label="Account Menu"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.firstName}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                    {isAuthenticated ? user?.firstName?.[0] : <UserIcon className="w-4 h-4" />}
                  </div>
                )}
                <span className="hidden sm:inline-block text-xs font-semibold max-w-[100px] truncate">
                  {isAuthenticated ? user?.firstName : 'Account'}
                </span>
              </button>

              {/* Account Dropdown */}
              {accountMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setAccountMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2.5 border-b border-slate-100">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                          {isAdmin && (
                            <span className="inline-block mt-1 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Administrator
                            </span>
                          )}
                        </div>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50 transition-colors"
                          >
                            <Shield className="w-4 h-4 text-purple-600" />
                            <span>Admin Portal</span>
                          </Link>
                        )}

                        <Link
                          to="/account"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          <span>My Profile & Addresses</span>
                        </Link>

                        <Link
                          to="/account/orders"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Package className="w-4 h-4 text-slate-400" />
                          <span>Order History & Tracking</span>
                        </Link>

                        <Link
                          to="/account/wishlist"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Heart className="w-4 h-4 text-slate-400" />
                          <span>My Wishlist ({wishlistItems.length})</span>
                        </Link>

                        <div className="border-t border-slate-100 my-1" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <div className="p-3 space-y-2">
                        <Link
                          to="/login"
                          onClick={() => setAccountMenuOpen(false)}
                          className="block w-full py-2 bg-slate-900 text-white text-center rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setAccountMenuOpen(false)}
                          className="block w-full py-2 border border-slate-200 text-slate-700 text-center rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
                        >
                          Create Account
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {!isAuthenticated && (
            <div className="pt-2 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center text-xs font-semibold bg-slate-900 text-white rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center text-xs font-semibold border border-slate-200 text-slate-700 rounded-xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
