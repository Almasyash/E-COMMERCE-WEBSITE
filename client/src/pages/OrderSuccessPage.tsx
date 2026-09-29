import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, Loader2 } from 'lucide-react';
import { OrderService } from '../services/order.service';
import { Order } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    OrderService.getOrderById(id)
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen py-32 flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
        <p className="text-xs text-slate-500">Retrieving order confirmation details...</p>
      </div>
    );
  }

  const estimatedDelivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xs animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Payment & Order Confirmed
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3 mb-2">
          Thank you for your order!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-8">
          We have received your order and sent a confirmation receipt to your email address. Our team is already preparing your package for priority dispatch.
        </p>

        {/* Order Details Card */}
        {order && (
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left space-y-4 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Order Number</span>
                <span className="text-sm font-extrabold text-slate-900">{order.orderNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Order Date</span>
                <span className="text-xs font-semibold text-slate-700">{formatDate(order.createdAt)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Estimated Delivery
                </span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1.5 mt-0.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>{formatDate(estimatedDelivery)}</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Amount</span>
                <span className="text-sm font-extrabold text-slate-900">{formatCurrency(order.total)}</span>
              </div>
            </div>

            {/* Items count */}
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
              <span>Items in package: {order.items.length} item(s)</span>
              <span className="font-semibold text-slate-800">Paid via {order.paymentMethod}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {order && (
            <Link
              to={`/account/orders/${order.id}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>Track Order Timeline</span>
            </Link>
          )}

          <Link
            to="/products"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
