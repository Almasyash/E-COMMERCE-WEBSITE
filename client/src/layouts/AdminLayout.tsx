import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Tag,
  MessageSquare,
  Users,
  Store,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      navigate('/login?redirect=/admin');
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl text-center space-y-4 border border-slate-700">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-xs text-slate-400">
            You do not have administrative privileges to view this portal.
          </p>
          <Link
            to="/"
            className="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: 'Overview', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Products', href: '/admin/products', icon: <Package className="w-4 h-4" /> },
    { label: 'Categories', href: '/admin/categories', icon: <FolderTree className="w-4 h-4" /> },
    { label: 'Orders', href: '/admin/orders', icon: <ShoppingCart className="w-4 h-4" /> },
    { label: 'Coupons', href: '/admin/coupons', icon: <Tag className="w-4 h-4" /> },
    { label: 'Reviews', href: '/admin/reviews', icon: <MessageSquare className="w-4 h-4" /> },
    { label: 'Customers', href: '/admin/customers', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between flex-shrink-0 border-r border-slate-800">
        <div>
          {/* Logo & Portal Header */}
          <div className="p-5 border-b border-slate-800">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <span className="font-extrabold text-base text-white tracking-tight">
                  Apex<span className="text-purple-400">Admin</span>
                </span>
                <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                  Store Management
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const active =
                item.href === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User and Back to Store */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Back to Storefront</span>
          </Link>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-purple-900 text-purple-200 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {user?.firstName?.[0] || 'A'}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">{user?.firstName}</div>
                <div className="text-[10px] text-slate-500 truncate">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200/80 h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Management Portal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Preview Live Site ↗
            </Link>
          </div>
        </header>

        <main className="p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
