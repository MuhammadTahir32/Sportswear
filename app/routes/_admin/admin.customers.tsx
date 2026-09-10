import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Search, Eye, Edit2, Trash2, Plus } from 'lucide-react'

export const Route = createFileRoute('/_admin/admin/customers')({
  component: AdminCustomersPage,
})

const MOCK_CUSTOMERS = [
  {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+1 (555) 000-0000',
    orders: 5,
    joined: 'Sep 1, 2025',
    color: 'bg-orange-500/20 text-orange-500',
  },
  {
    id: 2,
    name: 'Ahmed Raza',
    email: 'ahmed@example.com',
    phone: '+1 (555) 111-2222',
    orders: 3,
    joined: 'Aug 28, 2025',
    color: 'bg-amber-700/20 text-amber-600',
  },
  {
    id: 3,
    name: 'Sara Khan',
    email: 'sara@gmail.com',
    phone: '+1 (555) 333-4444',
    orders: 8,
    joined: 'Aug 25, 2025',
    color: 'bg-teal-500/20 text-teal-500',
  },
  {
    id: 4,
    name: 'Usman Ali',
    email: 'usman@example.com',
    phone: '+1 (555) 555-6666',
    orders: 2,
    joined: 'Aug 20, 2025',
    color: 'bg-blue-500/20 text-blue-500',
  },
  {
    id: 5,
    name: 'Ali Hassan',
    email: 'ali@example.com',
    phone: '+1 (555) 777-8888',
    orders: 6,
    joined: 'Aug 18, 2025',
    color: 'bg-green-500/20 text-[#C6FF3D]',
  },
]

function AdminCustomersPage() {
  const [searchInput, setSearchInput] = useState('')

  return (
    <div>
      <div className="pt-2 pb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Customers</h2>
          <p className="text-[14px] text-[#9A9A9A] mt-1">
            Manage your customer base and view details.
          </p>
        </div>
        <button className="bg-[#C6FF3D] hover:bg-[#b0e633] text-[#0D0D0D] text-[13px] font-bold px-4 py-2 rounded-[8px] h-auto flex items-center shadow-[0_0_15px_rgba(198,255,61,0.2)]">
          <Plus size={16} className="mr-1.5 stroke-[3px]" />
          Add Customer
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-[16px] overflow-hidden flex flex-col min-h-[500px]">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-[320px]">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search customers..."
                className="w-full h-[40px] pl-10 pr-4 bg-[#111] rounded-full text-[13px] text-white placeholder:text-[#9A9A9A] focus:outline-none border border-transparent focus:border-[#C6FF3D]/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <select className="h-[40px] px-4 bg-transparent border-none text-[13px] font-bold text-white focus:outline-none focus:ring-0 appearance-none cursor-pointer">
              <option value="" className="bg-[#111]">
                All Customers
              </option>
              <option value="active" className="bg-[#111]">
                Active Customers
              </option>
            </select>

            <select className="h-[40px] px-4 bg-transparent border-none text-[13px] font-bold text-white focus:outline-none focus:ring-0 appearance-none cursor-pointer">
              <option value="" className="bg-[#111]">
                Sort by: Newest
              </option>
              <option value="oldest" className="bg-[#111]">
                Sort by: Oldest
              </option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4 flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-[#9A9A9A]">
                <th className="px-6 py-4 w-12">
                  <div className="w-4 h-4 border border-[#9A9A9A]/40 rounded-[4px] hover:border-[#C6FF3D] cursor-pointer transition-colors"></div>
                </th>
                <th className="px-6 py-4 font-semibold">Customer*</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold">Total Orders</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_CUSTOMERS.map((customer) => (
                <tr key={customer.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-4 h-4 border border-[#9A9A9A]/40 rounded-[4px] hover:border-[#C6FF3D] cursor-pointer transition-colors"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 ${customer.color}`}
                      >
                        {customer.name.charAt(0)}
                      </div>
                      <span className="text-[13px] font-semibold text-white">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] text-[#9A9A9A] font-medium">{customer.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] text-[#9A9A9A] font-medium">{customer.phone}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-semibold text-white">{customer.orders}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[12px] text-[#9A9A9A] font-medium">
                      {customer.joined}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-[#9A9A9A] hover:text-[#C6FF3D] transition-colors">
                        <Eye size={15} />
                      </button>
                      <button className="p-1.5 text-[#9A9A9A] hover:text-[#C6FF3D] transition-colors">
                        <Edit2 size={15} />
                      </button>
                      <button className="p-1.5 text-[#9A9A9A] hover:text-red-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-white/5 text-[12px] font-medium text-[#9A9A9A]">
          Showing 1-5 of 1,204 customers
        </div>
      </div>
    </div>
  )
}
