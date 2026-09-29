import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, Loader2, MessageSquare } from 'lucide-react';
import { AdminService } from '../../services/order.service';
import { formatDate } from '../../utils/formatters';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await AdminService.getReviews();
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleToggleApproval = async (id: string) => {
    try {
      await AdminService.toggleReviewApproval(id);
      await loadReviews();
    } catch (err: any) {
      alert(err.message || 'Error updating review approval');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;
    try {
      await AdminService.deleteReview(id);
      await loadReviews();
    } catch (err: any) {
      alert(err.message || 'Error deleting review');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Review Moderation</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Moderate verified buyer feedback, ratings, and user-submitted testimonials
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">No reviews found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Rating & Headline</th>
                  <th className="py-3 px-4">Review Content</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-[180px] truncate">
                      {rev.product?.title}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {rev.user?.firstName} {rev.user?.lastName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 mb-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="font-bold text-slate-900 block truncate max-w-[150px]">
                        {rev.title}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">{rev.content}</td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(rev.createdAt)}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rev.isApproved
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {rev.isApproved ? 'Approved' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleApproval(rev.id)}
                          className={`px-2 py-1 rounded text-[11px] font-bold ${
                            rev.isApproved
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {rev.isApproved ? 'Hide' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleDelete(rev.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
