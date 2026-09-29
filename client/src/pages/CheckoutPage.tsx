import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle,
  Truck,
  ArrowRight,
  ArrowLeft,
  Lock,
  Loader2,
} from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { OrderService } from '../services/order.service';
import { formatCurrency } from '../utils/formatters';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, shippingFee, tax, estimatedTotal, appliedCoupon } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    email: user ? user.email : '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560103',
    country: 'India',
    paymentMethod: 'RAZORPAY', // RAZORPAY, UPI, CARD, COD
    notes: '',
  });

  // Pre-fill user address if available
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setFormData((prev) => ({
        ...prev,
        fullName: defaultAddr.fullName || prev.fullName,
        phone: defaultAddr.phone || prev.phone,
        addressLine1: defaultAddr.addressLine1 || '',
        addressLine2: defaultAddr.addressLine2 || '',
        city: defaultAddr.city || prev.city,
        state: defaultAddr.state || prev.state,
        postalCode: defaultAddr.postalCode || prev.postalCode,
        country: defaultAddr.country || prev.country,
      }));
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-24 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">No items to checkout</h2>
          <p className="text-xs text-slate-500 mb-6">Please add items to your cart before proceeding.</p>
          <Link
            to="/products"
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setErrorMessage(null);

    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }

    try {
      const order = await OrderService.checkout({
        shippingAddress: {
          fullName: formData.fullName,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
        couponCode: appliedCoupon?.code,
        notes: formData.notes,
      });

      // Clear local cart and redirect to order success
      useCartStore.getState().fetchCart();
      navigate(`/order-success/${order.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Order placement failed. Please review your details.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Contact & Account' },
    { num: 2, label: 'Shipping Address' },
    { num: 3, label: 'Payment Method' },
    { num: 4, label: 'Review & Confirm' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <Link to="/cart" className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Multi-Step Checkout
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Secure 256-bit encrypted checkout session</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5" />
            <span>Bank-Grade Encryption</span>
          </div>
        </div>

        {/* Step Progress Indicator */}
        <div className="mb-10 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="grid grid-cols-4 gap-2 text-center">
            {steps.map((s) => (
              <div
                key={s.num}
                onClick={() => {
                  if (s.num < currentStep) setCurrentStep(s.num);
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2 px-1 rounded-xl cursor-pointer transition-all ${
                  currentStep === s.num
                    ? 'bg-slate-900 text-white font-bold'
                    : currentStep > s.num
                    ? 'text-emerald-700 font-semibold'
                    : 'text-slate-400 font-medium'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    currentStep === s.num
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : currentStep > s.num
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {currentStep > s.num ? '✓' : s.num}
                </div>
                <span className="text-xs hidden md:inline">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Checkout Steps Form (Left 8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            {/* Step 1: Customer Contact Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-bold text-slate-900">Step 1: Contact Details</h2>
                  <p className="text-xs text-slate-500">We will send invoice and tracking updates here.</p>
                </div>

                {!isAuthenticated && (
                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
                    <span>Already have an ApexCart account?</span>
                    <Link
                      to="/login?redirect=/checkout"
                      className="font-bold underline hover:text-blue-950"
                    >
                      Sign In Now
                    </Link>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 9811223344"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@company.com"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.fullName || !formData.phone || !formData.email) {
                        alert('Please fill out all contact fields');
                        return;
                      }
                      setCurrentStep(2);
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    <span>Continue to Shipping</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Address */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-bold text-slate-900">Step 2: Shipping Address</h2>
                  <p className="text-xs text-slate-500">Enter the physical delivery address for courier delivery.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Address Line 1 (Flat, House No., Building) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                      placeholder="Flat 402, Skyline Residency, Outer Ring Road"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Address Line 2 (Area, Landmark)
                    </label>
                    <input
                      type="text"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                      placeholder="Bellandur, Near EcoSpace Tech Park"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.addressLine1 || !formData.city || !formData.state || !formData.postalCode) {
                        alert('Please fill out all address fields');
                        return;
                      }
                      setCurrentStep(3);
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-bold text-slate-900">Step 3: Select Payment Method</h2>
                  <p className="text-xs text-slate-500">Choose your preferred gateway or pay on delivery.</p>
                </div>

                <div className="space-y-3">
                  {/* Razorpay Gateway */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'RAZORPAY'
                        ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="RAZORPAY"
                        checked={formData.paymentMethod === 'RAZORPAY'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Razorpay (Cards, NetBanking, Wallets)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Instant online processing with zero extra transaction fees.
                        </div>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                  </label>

                  {/* UPI */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'UPI'
                        ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="UPI"
                        checked={formData.paymentMethod === 'UPI'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Instant UPI (GPay, PhonePe, Paytm)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Pay directly from your mobile UPI banking app.
                        </div>
                      </div>
                    </div>
                    <Smartphone className="w-5 h-5 text-blue-600" />
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'COD'
                        ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === 'COD'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</div>
                        <div className="text-[11px] text-slate-500">
                          Pay with cash or UPI QR upon courier delivery.
                        </div>
                      </div>
                    </div>
                    <Banknote className="w-5 h-5 text-amber-600" />
                  </label>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Confirm */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-bold text-slate-900">Step 4: Final Review & Confirmation</h2>
                  <p className="text-xs text-slate-500">Please verify your shipping and item details before confirming.</p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-700">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Shipping Destination
                    </span>
                    <p className="font-bold text-slate-900">{formData.fullName}</p>
                    <p className="text-slate-600">{formData.addressLine1}</p>
                    {formData.addressLine2 && <p className="text-slate-600">{formData.addressLine2}</p>}
                    <p className="text-slate-600">
                      {formData.city}, {formData.state} - {formData.postalCode}
                    </p>
                    <p className="text-slate-600">Phone: {formData.phone}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Payment Gateway
                    </span>
                    <p className="font-bold text-slate-900">{formData.paymentMethod}</p>
                    <p className="text-slate-600">Currency: INR (₹)</p>
                    <p className="text-slate-600">Verification: Instant SSL</p>
                  </div>
                </div>

                {/* Delivery Notes */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Delivery Instructions / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Leave with building security guard"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handlePlaceOrder}
                    className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Confirming Order...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Place Order ({formatCurrency(estimatedTotal)})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                Cart Items ({items.length})
              </h3>

              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80'}
                      alt={item.productName}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-50 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">
                        {item.productName}
                      </div>
                      <div className="text-[11px] text-slate-400">Qty: {item.quantity}</div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-{formatCurrency(appliedCoupon.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900">
                    {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (18% GST)</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="text-emerald-600">{formatCurrency(estimatedTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
