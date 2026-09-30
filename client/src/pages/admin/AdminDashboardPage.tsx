import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { AdminService } from '../../services/order.service';
import { formatCurrency, formatDate, getOrderStatusBadge } from '../../utils/formatters';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AdminService.getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
        <p className="text-xs text-slate-500">Aggregating store metrics...</p>
      </div>
    );
  }

  const { metrics, lowStockProducts, recentOrders, recentCustomers, salesChart } = stats || {};

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(metrics?.totalRevenue || 0),
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Total Orders',
      value: metrics?.totalOrders || 0,
      icon: <ShoppingCart className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-100',
    },
    {
      label: 'Registered Customers',
      value: metrics?.totalCustomers || 0,
      icon: <Users className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-100',
    },
    {
      label: 'Catalog Products',
      value: metrics?.totalProducts || 0,
      icon: <Package className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50 border-indigo-100',
    },
    {
      label: 'Pending Orders',
      value: metrics?.pendingOrders || 0,
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Executive Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time metrics, low inventory alerts, and order fulfillment tracking
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`p-4 rounded-2xl border ${card.bg} shadow-2xs flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase text-slate-500">{card.label}</span>
              <div className="p-1.5 bg-white rounded-lg shadow-2xs flex-shrink-0">{card.icon}</div>
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900 truncate" title={String(card.value)}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Sales Revenue Chart */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Sales Overview (Recent Months)</h2>
            <p className="text-xs text-slate-400">Total gross revenue from fulfilled and paid orders</p>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        </div>

        {/* Visual Revenue Bars */}
        <div className="overflow-x-auto pb-2">
          <div className="h-44 min-w-[280px] flex items-end gap-3 sm:gap-6 pt-6 px-2 sm:px-4 border-b border-slate-100">
            {salesChart?.map((item: any, idx: number) => {
              const maxRev = Math.max(...salesChart.map((s: any) => s.revenue), 100000);
              const heightPct = Math.max(15, Math.round((item.revenue / maxRev) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatCurrency(item.revenue)}
                  </span>
                  <div
                    className="w-full bg-emerald-500 group-hover:bg-emerald-600 rounded-t-lg transition-all"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-xs font-semibold text-slate-500">{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2 Columns: Low Stock Alerts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Low Stock Products */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <h2 className="text-sm font-bold text-slate-900">Low Stock Alerts</h2>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-purple-600 hover:underline"
            >
              Manage Stock
            </Link>
          </div>

          <div className="space-y-2">
            {lowStockProducts?.length > 0 ? (
              lowStockProducts.map((inv: any) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900 truncate">{inv.product?.title}</div>
                    <div className="text-[11px] text-slate-400">SKU: {inv.product?.sku}</div>
                  </div>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full flex-shrink-0 text-[11px] ${
                      inv.quantity <= 3
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {inv.quantity} left
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">
                All inventory quantities are above safety threshold.
              </p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Recent Customer Orders</h2>
            <Link to="/admin/orders" className="text-xs font-semibold text-purple-600 hover:underline">
              View All Orders &rarr;
            </Link>
          </div>

          {/* Desktop Table View (>= 640px) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-2.5">Order</th>
                  <th className="pb-2.5">Customer</th>
                  <th className="pb-2.5">Total</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders?.map((ord: any) => {
                  const badge = getOrderStatusBadge(ord.status);
                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-bold text-slate-900">{ord.orderNumber}</td>
                      <td className="py-3 text-slate-600">{ord.user?.firstName || 'Guest'}</td>
                      <td className="py-3 font-semibold text-slate-900">{formatCurrency(ord.total)}</td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to="/admin/orders"
                          className="text-purple-600 hover:underline font-bold"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (< 640px) */}
          <div className="sm:hidden space-y-2.5">
            {recentOrders?.map((ord: any) => {
              const badge = getOrderStatusBadge(ord.status);
              return (
                <div
                  key={ord.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900">{ord.orderNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>{ord.user?.firstName || 'Guest'}</span>
                    <span className="font-bold text-slate-900">{formatCurrency(ord.total)}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-200/60 flex justify-end">
                    <Link
                      to="/admin/orders"
                      className="text-xs font-bold text-purple-600 hover:underline"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
