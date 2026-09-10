import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Plus, Edit, Trash2, Loader2, Tag, ToggleLeft, ToggleRight } from 'lucide-react'
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
  const [deleteId, setDeleteId] = useState<string | null>(null)

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

  async function handleDelete(id: string) {
    await deleteCoupon.mutateAsync(id)
    setDeleteId(null)
  }

  async function handleToggleActive(coupon: { id: string; active: boolean }) {
    await updateCoupon.mutateAsync({
      ...coupons.find((c) => c.id === coupon.id)!,
      id: coupon.id,
      active: !coupon.active,
    })
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Coupons</h2>
          <p className="text-[13px] text-[#9A9A9A]">Create and manage discount coupons.</p>
        </div>
        {!showAdd && !editId && (
          <Button
            className="bg-[#C6FF3D] hover:bg-[#b0e633] text-[#0D0D0D] text-[13px] font-bold px-4 py-2 rounded-[8px] h-auto flex items-center"
            onClick={() => setShowAdd(true)}
          >
            <Plus size={16} className="mr-1.5" />
            Create Coupon
          </Button>
        )}
      </div>

      {(showAdd || editId) && formUI}

      {/* Coupon table */}
      <div className="bg-[#0D0D0D] border border-white/5 rounded-[12px] overflow-hidden">
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
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A]">
                    Code
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A]">
                    Discount
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A]">
                    Expires
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A]">
                    Status
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {coupons.map((coupon) => {
                  const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date()

                  return (
                    <tr key={coupon.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-5 py-4">
                        <span className="text-[13px] font-mono font-bold text-[#C6FF3D] bg-[#C6FF3D]/10 px-2.5 py-1 rounded-[6px]">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-white">
                            {coupon.discount_type === 'percent'
                              ? `${coupon.discount_value}%`
                              : `$${coupon.discount_value.toFixed(2)}`}
                          </span>
                          <span className="text-[11px] text-[#9A9A9A] capitalize">
                            {coupon.discount_type} discount
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {coupon.expires_at ? (
                          <div className="flex flex-col">
                            <span
                              className={`text-[12px] font-semibold ${isExpired ? 'text-red-500' : 'text-green-400'}`}
                            >
                              {new Date(coupon.expires_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                            <span className="text-[10px] text-[#9A9A9A]">
                              {isExpired ? 'Expired' : 'Active'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[12px] font-semibold text-green-400">
                            Never Expires
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleActive(coupon)}
                            className="flex items-center hover:opacity-80 transition-opacity"
                            title={coupon.active ? 'Deactivate' : 'Activate'}
                          >
                            {coupon.active ? (
                              <ToggleRight size={28} className="text-[#C6FF3D]" />
                            ) : (
                              <ToggleLeft size={28} className="text-white/20" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(coupon)}
                            className="p-2 text-[#9A9A9A] hover:text-[#C6FF3D] hover:bg-white/10 rounded-[6px] transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          {deleteId === coupon.id ? (
                            <div className="flex items-center gap-2 mr-2">
                              <button
                                onClick={() => handleDelete(coupon.id)}
                                className="text-[11px] text-red-500 font-semibold hover:text-red-400"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteId(null)}
                                className="text-[11px] text-[#9A9A9A] font-semibold hover:text-white"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteId(coupon.id)}
                              className="p-2 text-[#9A9A9A] hover:text-red-500 hover:bg-red-500/10 rounded-[6px] transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
