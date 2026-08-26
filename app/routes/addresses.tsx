import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  type AddressFormData,
} from '@/hooks/useAddresses'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Address } from '@/lib/types'
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  Phone,
  User,
  Home,
  Building2,
  Globe,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/cn'

export const Route = createFileRoute('/addresses')({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      throw redirect({ to: '/sign-in', search: { redirect: '/addresses' } })
    }
  },
  component: AddressesPage,
})

// ─── Page ─────────────────────────────────────────────────────────────────────

function AddressesPage(): React.JSX.Element {
  const { user } = useAuth()
  const userId = user?.id ?? ''

  const { data: addresses = [], isLoading, isError } = useAddresses(userId)
  const createAddress = useCreateAddress(userId)
  const updateAddress = useUpdateAddress(userId)
  const deleteAddress = useDeleteAddress(userId)
  const setDefault = useSetDefaultAddress(userId)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const openCreateModal = () => {
    setEditingAddress(null)
    setModalOpen(true)
  }

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await deleteAddress.mutateAsync(id)
    setDeleteConfirmId(null)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="text-3xl font-black text-[#0D0D0D] uppercase tracking-tight"
            style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
          >
            My Addresses
          </h1>
          <p className="text-[#9A9A9A] text-sm mt-1">Manage your saved shipping addresses.</p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreateModal} icon={<Plus size={16} />}>
          Add Address
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 text-[#9A9A9A]">
          <Loader2 size={24} className="animate-spin mr-2" />
          <span className="text-sm">Loading addresses…</span>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="py-10 text-center">
          <p className="text-red-500 text-sm font-medium">
            Failed to load addresses. Please try again.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && addresses.length === 0 && (
        <div className="text-center py-16 bg-[#F7F7F7] rounded-[16px] border-2 border-dashed border-[#EFEFEF]">
          <div className="w-14 h-14 rounded-full bg-[#C6FF3D]/15 flex items-center justify-center mx-auto mb-4">
            <MapPin size={28} className="text-[#0D0D0D]" strokeWidth={1.5} />
          </div>
          <h2
            className="text-lg font-black text-[#0D0D0D] uppercase mb-1"
            style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
          >
            No Addresses Yet
          </h2>
          <p className="text-[#9A9A9A] text-sm mb-5">
            Add a shipping address to speed up checkout.
          </p>
          <Button variant="primary" size="sm" onClick={openCreateModal} icon={<Plus size={16} />}>
            Add Your First Address
          </Button>
        </div>
      )}

      {/* Address list */}
      {!isLoading && addresses.length > 0 && (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={() => openEditModal(addr)}
              onDelete={() => setDeleteConfirmId(addr.id)}
              onSetDefault={() => setDefault.mutate(addr.id)}
              isSettingDefault={setDefault.isPending}
              isDeleting={deleteAddress.isPending && deleteConfirmId === addr.id}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
      >
        <AddressForm
          initial={editingAddress}
          onSubmit={async (data) => {
            if (editingAddress) {
              await updateAddress.mutateAsync({ id: editingAddress.id, ...data })
            } else {
              await createAddress.mutateAsync(data)
            }
            setModalOpen(false)
          }}
          loading={createAddress.isPending || updateAddress.isPending}
          error={
            (createAddress.error as Error)?.message ||
            (updateAddress.error as Error)?.message ||
            null
          }
        />
      </Modal>

      {/* Delete confirm Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Address"
      >
        <div className="space-y-5">
          <p className="text-[#4A4A4A] text-sm">
            Are you sure you want to delete this address? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" size="sm" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={deleteAddress.isPending}
              className="!bg-red-500 hover:!bg-red-600 !text-white"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ─── Address Card ─────────────────────────────────────────────────────────────

interface AddressCardProps {
  address: Address
  onEdit: () => void
  onDelete: () => void
  onSetDefault: () => void
  isSettingDefault: boolean
  isDeleting: boolean
}

function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isSettingDefault,
  isDeleting,
}: AddressCardProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'relative p-5 rounded-[12px] border transition-all duration-200',
        address.is_default
          ? 'border-[#C6FF3D] bg-white shadow-sm'
          : 'border-[#EFEFEF] bg-white hover:border-[#0D0D0D]/20'
      )}
    >
      {/* Default badge */}
      {address.is_default && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#C6FF3D] text-[#0D0D0D] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
          <CheckCircle2 size={10} />
          Default
        </div>
      )}

      {/* Label */}
      {address.label && (
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#9A9A9A] mb-2">
          {address.label}
        </p>
      )}

      {/* Address details */}
      <p className="font-semibold text-[#0D0D0D] text-sm mb-1">{address.full_name}</p>
      <p className="text-[#4A4A4A] text-xs leading-relaxed">
        {address.line1}
        {address.line2 ? `, ${address.line2}` : ''}
        <br />
        {address.city}, {address.state} {address.postal_code}
        <br />
        {address.country}
      </p>
      {address.phone && <p className="text-[#9A9A9A] text-xs mt-1">{address.phone}</p>}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#EFEFEF]">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#4A4A4A] hover:text-[#0D0D0D] transition-colors"
        >
          <Pencil size={13} />
          Edit
        </button>
        <span className="text-[#EFEFEF]">|</span>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#9A9A9A] hover:text-red-500 transition-colors disabled:opacity-50"
        >
          <Trash2 size={13} />
          {isDeleting ? 'Deleting…' : 'Delete'}
        </button>
        {!address.is_default && (
          <>
            <span className="text-[#EFEFEF]">|</span>
            <button
              onClick={onSetDefault}
              disabled={isSettingDefault}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#9A9A9A] hover:text-[#0D0D0D] transition-colors disabled:opacity-50"
            >
              <Star size={13} />
              Set as Default
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Address Form ─────────────────────────────────────────────────────────────

const EMPTY_FORM: AddressFormData = {
  label: '',
  full_name: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'US',
  phone: '',
  is_default: false,
}

interface AddressFormProps {
  initial: Address | null
  onSubmit: (data: AddressFormData) => Promise<void>
  loading: boolean
  error: string | null
}

function AddressForm({ initial, onSubmit, loading, error }: AddressFormProps): React.JSX.Element {
  const [form, setForm] = useState<AddressFormData>(
    initial
      ? {
          label: initial.label ?? '',
          full_name: initial.full_name,
          line1: initial.line1,
          line2: initial.line2 ?? '',
          city: initial.city,
          state: initial.state,
          postal_code: initial.postal_code,
          country: initial.country,
          phone: initial.phone ?? '',
          is_default: initial.is_default,
        }
      : EMPTY_FORM
  )
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({})

  const set = (field: keyof AddressFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const next: typeof formErrors = {}
    if (!form.full_name.trim()) next.full_name = 'Full name is required'
    if (!form.line1.trim()) next.line1 = 'Address line 1 is required'
    if (!form.city.trim()) next.city = 'City is required'
    if (!form.state.trim()) next.state = 'State / province is required'
    if (!form.postal_code.trim()) next.postal_code = 'Postal code is required'
    if (!form.country.trim()) next.country = 'Country is required'
    setFormErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    await onSubmit({
      ...form,
      label: form.label?.trim() || null,
      line2: form.line2?.trim() || null,
      phone: form.phone?.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-[8px]">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Label (optional) */}
      <Input
        id="addr-label"
        label="Label (optional)"
        type="text"
        placeholder='e.g. "Home", "Office"'
        value={form.label ?? ''}
        onChange={set('label')}
        icon={<Home size={15} />}
      />

      <Input
        id="addr-full-name"
        label="Full Name"
        type="text"
        placeholder="Recipient's full name"
        value={form.full_name}
        onChange={set('full_name')}
        error={formErrors.full_name}
        icon={<User size={15} />}
      />

      <Input
        id="addr-line1"
        label="Address Line 1"
        type="text"
        placeholder="Street address, P.O. box"
        value={form.line1}
        onChange={set('line1')}
        error={formErrors.line1}
        icon={<MapPin size={15} />}
      />

      <Input
        id="addr-line2"
        label="Address Line 2 (optional)"
        type="text"
        placeholder="Apt, suite, unit, building"
        value={form.line2 ?? ''}
        onChange={set('line2')}
        icon={<Building2 size={15} />}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="addr-city"
          label="City"
          type="text"
          placeholder="New York"
          value={form.city}
          onChange={set('city')}
          error={formErrors.city}
        />
        <Input
          id="addr-state"
          label="State / Province"
          type="text"
          placeholder="NY"
          value={form.state}
          onChange={set('state')}
          error={formErrors.state}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="addr-postal"
          label="Postal Code"
          type="text"
          placeholder="10001"
          value={form.postal_code}
          onChange={set('postal_code')}
          error={formErrors.postal_code}
        />
        <Input
          id="addr-country"
          label="Country"
          type="text"
          placeholder="US"
          value={form.country}
          onChange={set('country')}
          error={formErrors.country}
          icon={<Globe size={15} />}
        />
      </div>

      <Input
        id="addr-phone"
        label="Phone (optional)"
        type="tel"
        placeholder="+1 (555) 000-0000"
        value={form.phone ?? ''}
        onChange={set('phone')}
        icon={<Phone size={15} />}
      />

      {/* Default checkbox */}
      <label className="flex items-center gap-3 cursor-pointer select-none group">
        <div className="relative flex items-center">
          <input
            id="addr-default"
            type="checkbox"
            checked={form.is_default}
            onChange={set('is_default')}
            className="sr-only"
          />
          <div
            className={cn(
              'w-5 h-5 rounded-[4px] border-2 transition-all duration-150 flex items-center justify-center',
              form.is_default
                ? 'bg-[#C6FF3D] border-[#C6FF3D]'
                : 'bg-white border-[#EFEFEF] group-hover:border-[#0D0D0D]'
            )}
          >
            {form.is_default && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path
                  d="M1 4L3.5 6.5L9 1"
                  stroke="#0D0D0D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>
        <span className="text-sm font-medium text-[#4A4A4A] group-hover:text-[#0D0D0D] transition-colors">
          Set as default shipping address
        </span>
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" variant="primary" size="md" loading={loading}>
          {initial ? 'Save Changes' : 'Add Address'}
        </Button>
      </div>
    </form>
  )
}
