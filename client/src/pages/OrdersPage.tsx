import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Loader2, ArrowRight } from 'lucide-react';
import { OrderService } from '../services/order.service';
import { Order } from '../types';
import { formatCurrency, formatDate, getOrderStatusBadge } from '../utils/formatters';
import { useAuthStore } from '../stores/authStore';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login?redirect=/account/orders');
      return;
    }

    if (isAuthenticated) {
      OrderService.getMyOrders()
        .then((res) => setOrders(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen py-32 flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
        <p className="text-xs text-slate-500">Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200/80">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Order History & Tracking
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              View past receipts, courier tracking milestones, and manage returns
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">No Orders Placed Yet</h2>
            <p className="text-xs text-slate-500 mb-6">
              When you purchase items on ApexCart, your order receipts and live status will appear here.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-emerald-600 transition-colors"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusBadge = getOrderStatusBadge(order.status);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-soft transition-all space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">
                          Order Number
                        </span>
                        <span className="text-sm font-extrabold text-slate-900">
                          {order.orderNumber}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadge.bg}`}
                      >
                        {statusBadge.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">
                          Date Placed
                        </span>
                        <span className="text-slate-700 font-semibold">{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">
                          Total Amount
                        </span>
                        <span className="text-sm font-extrabold text-slate-900">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                        <img
                          src={
                            item.product?.images?.[0]?.url ||
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'
                          }
                          alt={item.productName}
                          className="w-12 h-12 rounded-lg object-cover bg-white flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {item.productName}
                          </p>
                          <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Payment: <strong className="text-slate-800">{order.paymentMethod}</strong> (
                      {order.paymentStatus})
                    </span>

                    <Link
                      to={`/account/orders/${order.id}`}
                      className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      <span>Track Order Timeline</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
