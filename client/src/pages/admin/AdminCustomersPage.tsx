import React, { useState, useEffect } from 'react';
import { Search, Users, Loader2 } from 'lucide-react';
import { AdminService } from '../../services/order.service';
import { formatDate } from '../../utils/formatters';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await AdminService.getCustomers({ search: search || undefined });
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const handleToggleStatus = async (id: string) => {
    try {
      await AdminService.toggleCustomerStatus(id);
      await loadCustomers();
    } catch (err: any) {
      alert(err.message || 'Error updating customer status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer Accounts</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View registered customer accounts, total orders placed, and manage account statuses
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name or email..."
          className="w-full text-xs text-slate-900 focus:outline-none bg-transparent"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-slate-400 hover:text-black">
            Clear
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">No customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Orders Placed</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {c.firstName[0]}
                      </div>
                      <span>
                        {c.firstName} {c.lastName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{c.email}</td>
                    <td className="py-3.5 px-4 text-slate-500">{c.phone || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full text-[10px]">
                        {c._count?.orders || 0} orders
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(c.createdAt)}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(c.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                          c.isActive
                            ? 'bg-slate-100 hover:bg-rose-50 text-rose-600'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {c.isActive ? 'Deactivate' : 'Activate'}
                      </button>
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
