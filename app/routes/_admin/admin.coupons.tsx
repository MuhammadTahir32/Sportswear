import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Plus, Edit, Trash2, Loader2, Tag, Search } from 'lucide-react'
import {
  useAdminCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
  type CouponFormData,
} from '@/hooks/useAdminProducts'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { DiscountType } from '@/lib/types'

export const Route = createFileRoute('/_admin/admin/coupons')({
  component: AdminCouponsPage,
})

const EMPTY_FORM: CouponFormData = {
  code: '',
  discount_type: 'percent',
  discount_value: 0,
  expires_at: null,
  active: true,
}

function AdminCouponsPage(): React.JSX.Element {
  const { data: coupons = [], isLoading } = useAdminCoupons()
  const createCoupon = useCreateCoupon()
  const updateCoupon = useUpdateCoupon()
  const deleteCoupon = useDeleteCoupon()

  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState<CouponFormData>({ ...EMPTY_FORM })
  const [editId, setEditId] = useState<string | null>(null)

  async function handleAdd() {
    if (!form.code || !form.discount_value) return
    await createCoupon.mutateAsync({ ...form, code: form.code.toUpperCase() })
    setForm({ ...EMPTY_FORM })
    setShowAdd(false)
  }

  async function handleUpdate() {
    if (!editId) return
    await updateCoupon.mutateAsync({ ...form, id: editId, code: form.code.toUpperCase() })
    setEditId(null)
    setForm({ ...EMPTY_FORM })
  }

  function startEdit(coupon: CouponFormData & { id: string }) {
    setEditId(coupon.id)
    setForm({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      expires_at: coupon.expires_at,
      active: coupon.active,
    })
  }

  // Form UI (shared between add and edit)
  const formUI = (
    <div className="bg-[#0D0D0D] border border-white/5 rounded-[12px] p-5 md:p-6 mb-6">
      <h3 className="text-[14px] font-semibold text-white mb-5">
        {editId ? 'Edit Coupon' : 'New Coupon'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <Input
          label="Code *"
          value={form.code}
          onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
          placeholder="SUMMER20"
          className="bg-[#1A1A1A] border-white/5 text-white focus:border-[#C6FF3D]/50"
        />
        <div>
          <label className="text-[12px] font-semibold text-white block mb-2">Type *</label>
          <select
            value={form.discount_type}
            onChange={(e) =>
              setForm((p) => ({ ...p, discount_type: e.target.value as DiscountType }))
            }
            className="w-full h-[40px] px-4 border border-white/5 rounded-[8px] text-[13px] text-white bg-[#1A1A1A] focus:outline-none focus:border-[#C6FF3D]/50"
          >
            <option value="percent">Percentage (%)</option>
            <option value="fixed">Fixed Amount ($)</option>
          </select>
        </div>
        <Input
          label={form.discount_type === 'percent' ? 'Discount (%)' : 'Discount ($)'}
          type="number"
          step="0.01"
          min="0"
          value={form.discount_value.toString()}
          onChange={(e) =>
            setForm((p) => ({ ...p, discount_value: parseFloat(e.target.value) || 0 }))
          }
          placeholder="20"
          className="bg-[#1A1A1A] border-white/5 text-white focus:border-[#C6FF3D]/50"
        />
        <Input
          label="Expires At"
          type="date"
          value={form.expires_at?.split('T')[0] ?? ''}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              expires_at: e.target.value ? `${e.target.value}T23:59:59.000Z` : null,
            }))
          }
          className="bg-[#1A1A1A] border-white/5 text-white focus:border-[#C6FF3D]/50 [color-scheme:dark]"
        />
      </div>
      <div className="flex gap-3">
        <Button
          className="bg-[#C6FF3D] hover:bg-[#b0e633] text-[#0D0D0D] text-[13px] font-bold px-5 h-[40px] rounded-[8px]"
          onClick={editId ? handleUpdate : handleAdd}
          disabled={createCoupon.isPending || updateCoupon.isPending}
        >
          {createCoupon.isPending || updateCoupon.isPending
            ? 'Saving…'
            : editId
              ? 'Update Coupon'
              : 'Create Coupon'}
        </Button>
        <Button
          className="bg-transparent border border-white/10 text-white hover:bg-white/5 text-[13px] font-bold px-5 h-[40px] rounded-[8px]"
          onClick={() => {
            setShowAdd(false)
            setEditId(null)
            setForm({ ...EMPTY_FORM })
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  )

  return (
    <div>
      <div className="pt-2 pb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Coupons</h2>
          <p className="text-[14px] text-[#9A9A9A] mt-1">Create and manage discount coupons.</p>
        </div>
        {!showAdd && !editId && (
          <Button
            className="bg-[#C6FF3D] hover:bg-[#b0e633] text-[#0D0D0D] text-[13px] font-bold px-4 py-2 rounded-[8px] h-auto flex items-center shadow-[0_0_15px_rgba(198,255,61,0.2)]"
            onClick={() => setShowAdd(true)}
          >
            <Plus size={16} className="mr-1.5 stroke-[3px]" />
            Create Coupon
          </Button>
        )}
      </div>

      {(showAdd || editId) && formUI}

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
                placeholder="Search coupons..."
                className="w-full h-[40px] pl-10 pr-4 bg-[#111] rounded-full text-[13px] text-white placeholder:text-[#9A9A9A] focus:outline-none border border-transparent focus:border-[#C6FF3D]/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <select className="h-[40px] px-4 bg-transparent border-none text-[13px] font-bold text-white focus:outline-none focus:ring-0 appearance-none cursor-pointer">
              <option value="" className="bg-[#111]">
                All Statuses
              </option>
              <option value="active" className="bg-[#111]">
                Active
              </option>
              <option value="scheduled" className="bg-[#111]">
                Scheduled
              </option>
              <option value="expired" className="bg-[#111]">
                Expired
              </option>
            </select>

            <select className="h-[40px] px-4 bg-transparent border-none text-[13px] font-bold text-white focus:outline-none focus:ring-0 appearance-none cursor-pointer">
              <option value="" className="bg-[#111]">
                Sort by: Newest
              </option>
            </select>
          </div>
        </div>

        {/* Coupon table */}
        <div className="overflow-x-auto mt-4 flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-[#9A9A9A]" />
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-24 flex flex-col items-center">
              <Tag size={48} className="text-white/10 mb-4" />
              <h3 className="text-[16px] font-bold text-white mb-1">No coupons found</h3>
              <p className="text-[13px] text-[#9A9A9A]">You don't have any active coupons.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-[#9A9A9A]">
                  <th className="px-6 py-4 w-12">
                    <div className="w-4 h-4 border border-[#9A9A9A]/40 rounded-[4px] hover:border-[#C6FF3D] cursor-pointer transition-colors"></div>
                  </th>
                  <th className="px-6 py-4 font-semibold">Code</th>
                  <th className="px-6 py-4 font-semibold">%Discount</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Usage</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {coupons.map((coupon, idx) => {
                  const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date()
                  const status = isExpired ? 'Expired' : coupon.active ? 'Active' : 'Scheduled'

                  const statusColors: Record<string, string> = {
                    Active: 'bg-green-500/10 text-green-500',
                    Scheduled: 'bg-orange-500/10 text-orange-500',
                    Expired: 'bg-red-500/10 text-red-500',
                  }

                  const usageVal = (idx + 1) * 23

                  return (
                    <tr key={coupon.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="w-4 h-4 border border-[#9A9A9A]/40 rounded-[4px] hover:border-[#C6FF3D] cursor-pointer transition-colors"></div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] font-semibold text-white">{coupon.code}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-[#9A9A9A] font-medium">
                          {coupon.discount_type === 'percent'
                            ? `${coupon.discount_value}% OFF`
                            : `$${coupon.discount_value.toFixed(2)} OFF`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-[#9A9A9A] font-medium capitalize">
                          {coupon.discount_type === 'percent' ? 'Percentage' : 'Fixed Amount'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] font-semibold text-white">
                          {usageVal} / {(idx + 1) * 100}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-[6px] ${statusColors[status]}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              startEdit({
                                id: coupon.id,
                                code: coupon.code,
                                discount_type: coupon.discount_type,
                                discount_value: coupon.discount_value,
                                expires_at: coupon.expires_at,
                                active: coupon.active,
                              })
                            }
                            className="p-1.5 text-[#9A9A9A] hover:text-[#C6FF3D] transition-colors"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this coupon?')) {
                                await deleteCoupon.mutateAsync(coupon.id)
                              }
                            }}
                            className="p-1.5 text-[#9A9A9A] hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
