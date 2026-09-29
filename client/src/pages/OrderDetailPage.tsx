import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  AlertTriangle,
  Loader2,
  MapPin,
  CreditCard,
  Ban,
} from 'lucide-react';
import { OrderService } from '../services/order.service';
import { Order } from '../types';
import { formatCurrency, formatDateTime, getOrderStatusBadge } from '../utils/formatters';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Cancel order modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

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
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
        <p className="text-xs text-slate-500">Loading order tracking timeline...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen py-32 text-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Order Not Found</h2>
        <Link to="/account/orders" className="text-xs font-semibold text-emerald-600 underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const statusBadge = getOrderStatusBadge(order.status);
  const isCancellable = ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status);

  // Timeline milestones calculation
  const timelineStages = [
    { key: 'CONFIRMED', label: 'Order Confirmed', icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: 'PROCESSING', label: 'Processing at Hub', icon: <Clock className="w-4 h-4" /> },
    { key: 'SHIPPED', label: 'Dispatched with Courier', icon: <Package className="w-4 h-4" /> },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: <Truck className="w-4 h-4" /> },
    { key: 'DELIVERED', label: 'Delivered', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
        return 0;
      case 'PROCESSING':
        return 1;
      case 'SHIPPED':
        return 2;
      case 'OUT_FOR_DELIVERY':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return -1;
    }
  };

  const currentStageIndex = getStageIndex(order.status);

  const handleCancelOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelReason.trim()) return;
    setCancelling(true);
    try {
      const updated = await OrderService.cancelOrder(order.id, cancelReason);
      setOrder(updated);
      setCancelModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Could not cancel order');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/account/orders"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Orders</span>
          </Link>

          {isCancellable && (
            <button
              onClick={() => setCancelModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel Order</span>
            </button>
          )}
        </div>

        {/* Order Header Summary */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Order #{order.orderNumber}
                </h1>
                <span
                  className={`text-xs font-bold px-3 py-0.5 rounded-full border ${statusBadge.bg}`}
                >
                  {statusBadge.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Placed on {formatDateTime(order.createdAt)} • Payment via {order.paymentMethod} (
                {order.paymentStatus})
              </p>
            </div>

            {order.trackingNumber && (
              <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 font-medium block">Courier Tracking AWB:</span>
                <span className="font-extrabold text-slate-900">{order.trackingNumber}</span>
              </div>
            )}
          </div>

          {/* Tracking Timeline */}
          {order.status !== 'CANCELLED' ? (
            <div className="py-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                Fulfillment Timeline
              </h3>
              <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-2">
                {timelineStages.map((stage, i) => {
                  const isDone = currentStageIndex >= i;
                  const isCurrent = currentStageIndex === i;

                  return (
                    <div
                      key={stage.key}
                      className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center flex-1 relative z-10"
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}
                      >
                        {stage.icon}
                      </div>
                      <div>
                        <div
                          className={`text-xs font-bold ${
                            isDone ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {stage.label}
                        </div>
                        {isCurrent && (
                          <span className="text-[10px] text-emerald-600 font-semibold block">
                            In Progress
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-6 flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <div>
                <span className="font-bold block">Order Cancelled</span>
                <span>This order was cancelled. Restocked to inventory.</span>
              </div>
            </div>
          )}
        </div>

        {/* 2-Column: Ordered Items & Shipping Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Items */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Ordered Items ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  <img
                    src={
                      item.product?.images?.[0]?.url ||
                      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80'
                    }
                    alt={item.productName}
                    className="w-16 h-16 rounded-xl object-cover bg-white flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.productName}
                    </h4>
                    {item.variantName && (
                      <p className="text-[11px] text-slate-500">{item.variantName}</p>
                    )}
                    <p className="text-xs text-slate-600 mt-1">
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address & Pricing Breakdown */}
          <div className="lg:col-span-4 space-y-6">
            {/* Address */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 pb-2 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Delivery Address</span>
              </div>
              <p className="font-bold text-slate-900 text-sm">{order.shippingAddress.fullName}</p>
              <p className="text-slate-600">{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p className="text-slate-600">{order.shippingAddress.addressLine2}</p>
              )}
              <p className="text-slate-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p className="text-slate-600 font-semibold mt-1">Phone: {order.shippingAddress.phone}</p>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-900 pb-2 border-b border-slate-100">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Payment Summary</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold text-slate-900">
                  {order.shippingFee === 0 ? 'FREE' : formatCurrency(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (18% GST)</span>
                <span className="font-semibold text-slate-900">{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Paid</span>
                <span className="text-emerald-600">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setCancelModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 z-10">
            <h3 className="text-base font-bold text-slate-900 mb-1">Cancel Order #{order.orderNumber}</h3>
            <p className="text-xs text-slate-500 mb-4">
              Please let us know why you wish to cancel this order. Your inventory reservation will be released.
            </p>

            <form onSubmit={handleCancelOrder} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Cancellation Reason *
                </label>
                <textarea
                  required
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Changed my mind / Delivery date does not work"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  disabled={cancelling}
                  className="flex-1 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
