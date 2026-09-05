import { useState } from 'react'
import { MapPin, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { useAddresses, useCreateAddress } from '@/hooks/useAddresses'
import type { Address } from '@/lib/types'

type AddressSelectorProps = {
  selectedId: string | null
  onSelect: (address: Address) => void
}

export function AddressSelector({ selectedId, onSelect }: AddressSelectorProps): React.JSX.Element {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const { data: addresses = [], isLoading } = useAddresses(userId)
  const createAddress = useCreateAddress(userId)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Pakistan',
    phone: '',
    label: '',
  })

  async function handleSaveNew() {
    if (
      !formData.full_name ||
      !formData.line1 ||
      !formData.city ||
      !formData.state ||
      !formData.postal_code
    )
      return

    try {
      const newAddr = await createAddress.mutateAsync({
        ...formData,
        line2: formData.line2 || null,
        phone: formData.phone || null,
        label: formData.label || null,
        is_default: addresses.length === 0,
      })
      setShowForm(false)
      setFormData({
        full_name: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'Pakistan',
        phone: '',
        label: '',
      })
      onSelect(newAddr)
    } catch (err) {
      console.error('[AddressSelector] create error:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse h-[100px] bg-[#F7F7F7] rounded-[10px]" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[16px] font-bold text-[#0D0D0D]">Select a shipping address</h3>

      {/* Saved addresses */}
      {addresses.length > 0 && (
        <div className="flex flex-col gap-3">
          {addresses.map((addr) => {
            const isSelected = selectedId === addr.id
            return (
              <button
                key={addr.id}
                onClick={() => onSelect(addr)}
                className={`w-full text-left p-4 rounded-[10px] border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-[#C6FF3D] bg-[#FAFFF0]'
                    : 'border-[#E0E0E0] hover:border-[#9A9A9A] bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={18}
                      className={isSelected ? 'text-[#5A8A00] mt-0.5' : 'text-[#9A9A9A] mt-0.5'}
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[14px] font-semibold text-[#0D0D0D]">
                          {addr.full_name}
                        </span>
                        {addr.label && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F0F0F0] text-[#666] px-2 py-0.5 rounded-full">
                            {addr.label}
                          </span>
                        )}
                        {addr.is_default && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#C6FF3D] text-[#0D0D0D] px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-[#4A4A4A]">
                        {addr.line1}
                        {addr.line2 ? `, ${addr.line2}` : ''}
                      </p>
                      <p className="text-[13px] text-[#4A4A4A]">
                        {addr.city}, {addr.state} {addr.postal_code}
                      </p>
                      {addr.phone && (
                        <p className="text-[12px] text-[#9A9A9A] mt-1">{addr.phone}</p>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#C6FF3D] flex items-center justify-center flex-shrink-0">
                      <Check size={14} strokeWidth={3} className="text-[#0D0D0D]" />
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Add new address */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 w-full p-4 border-2 border-dashed border-[#E0E0E0] rounded-[10px] text-[13px] font-semibold text-[#4A4A4A] hover:border-[#C6FF3D] hover:text-[#0D0D0D] transition-colors"
        >
          <Plus size={18} />
          Add New Address
        </button>
      ) : (
        <div className="p-5 border border-[#E0E0E0] rounded-[10px] bg-[#FAFAFA]">
          <h4 className="text-[14px] font-bold text-[#0D0D0D] mb-4">New Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Full Name *"
              value={formData.full_name}
              onChange={(e) => setFormData((p) => ({ ...p, full_name: e.target.value }))}
              placeholder="John Doe"
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+92 300 1234567"
            />
            <div className="md:col-span-2">
              <Input
                label="Address Line 1 *"
                value={formData.line1}
                onChange={(e) => setFormData((p) => ({ ...p, line1: e.target.value }))}
                placeholder="Street address"
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Address Line 2"
                value={formData.line2}
                onChange={(e) => setFormData((p) => ({ ...p, line2: e.target.value }))}
                placeholder="Apt, suite, unit (optional)"
              />
            </div>
            <Input
              label="City *"
              value={formData.city}
              onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
              placeholder="Lahore"
            />
            <Input
              label="State / Province *"
              value={formData.state}
              onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))}
              placeholder="Punjab"
            />
            <Input
              label="Postal Code *"
              value={formData.postal_code}
              onChange={(e) => setFormData((p) => ({ ...p, postal_code: e.target.value }))}
              placeholder="54000"
            />
            <Input
              label="Label"
              value={formData.label}
              onChange={(e) => setFormData((p) => ({ ...p, label: e.target.value }))}
              placeholder="Home, Office, etc."
            />
          </div>
          <div className="flex items-center gap-3 mt-4">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveNew}
              disabled={createAddress.isPending}
            >
              {createAddress.isPending ? 'Saving…' : 'Save Address'}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
