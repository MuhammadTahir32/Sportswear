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
    <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-5 mb-5">
      <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-4">
        {editId ? 'Edit Coupon' : 'New Coupon'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <Input
          label="Code *"
          value={form.code}
          onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
          placeholder="SUMMER20"
        />
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-[#4A4A4A] block mb-1.5">
            Type *
          </label>
          <select
            value={form.discount_type}
            onChange={(e) =>
              setForm((p) => ({ ...p, discount_type: e.target.value as DiscountType }))
            }
            className="w-full h-[38px] px-4 border border-[#EFEFEF] rounded-[8px] text-sm text-[#0D0D0D] bg-white focus:outline-none focus:border-[#C6FF3D]"
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
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={editId ? handleUpdate : handleAdd}
          disabled={createCoupon.isPending || updateCoupon.isPending}
        >
          {createCoupon.isPending || updateCoupon.isPending
            ? 'Saving…'
            : editId
              ? 'Update'
              : 'Create'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
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
        <h2 className="text-[20px] font-bold text-[#0D0D0D]">Coupons</h2>
        {!showAdd && !editId && (
          <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
            <Plus size={16} className="mr-1.5" />
            Add Coupon
          </Button>
        )}
      </div>

      {(showAdd || editId) && formUI}

      {/* Coupon table */}
      <div className="bg-white border border-[#E0E0E0] rounded-[12px] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[#9A9A9A]" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16">
            <Tag size={32} className="mx-auto text-[#9A9A9A] mb-3" />
            <p className="text-[14px] text-[#9A9A9A]">No coupons yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#EFEFEF] bg-[#FAFAFA]">
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
                    Active
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFEF]">
                {coupons.map((coupon) => {
                  const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date()

                  return (
                    <tr key={coupon.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-5 py-3">
                        <span className="text-[13px] font-mono font-bold text-[#0D0D0D] bg-[#F0F0F0] px-2 py-0.5 rounded">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[13px] font-semibold text-[#0D0D0D]">
                        {coupon.discount_type === 'percent'
                          ? `${coupon.discount_value}%`
                          : `$${coupon.discount_value.toFixed(2)}`}
                      </td>
                      <td className="px-5 py-3">
                        {coupon.expires_at ? (
                          <span
                            className={`text-[12px] ${isExpired ? 'text-red-500' : 'text-[#4A4A4A]'}`}
                          >
                            {new Date(coupon.expires_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                            {isExpired && ' (expired)'}
                          </span>
                        ) : (
                          <span className="text-[12px] text-[#9A9A9A]">Never</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => handleToggleActive(coupon)}
                          className="flex items-center"
                        >
                          {coupon.active ? (
                            <ToggleRight size={24} className="text-[#5A8A00]" />
                          ) : (
                            <ToggleLeft size={24} className="text-[#9A9A9A]" />
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(coupon)}
                            className="p-1.5 text-[#9A9A9A] hover:text-[#C6FF3D] rounded-[6px] transition-colors"
                          >
                            <Edit size={14} />
                          </button>
                          {deleteId === coupon.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(coupon.id)}
                                className="text-[11px] text-red-600 font-semibold hover:underline"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteId(null)}
                                className="text-[11px] text-[#9A9A9A] font-semibold hover:underline"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteId(coupon.id)}
                              className="p-1.5 text-[#9A9A9A] hover:text-red-500 rounded-[6px] transition-colors"
                            >
                              <Trash2 size={14} />
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
