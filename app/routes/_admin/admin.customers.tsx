import { createFileRoute } from '@tanstack/react-router'
import { Users } from 'lucide-react'

export const Route = createFileRoute('/_admin/admin/customers')({
  component: AdminCustomersPage,
})

function AdminCustomersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Customers</h2>
          <p className="text-[13px] text-[#9A9A9A]">View and manage your customers.</p>
        </div>
      </div>
      <div className="bg-[#0D0D0D] border border-white/5 rounded-[12px] p-24 text-center flex flex-col items-center">
        <Users size={48} className="text-white/10 mb-4" />
        <h3 className="text-[16px] font-bold text-white mb-2">Customers Module</h3>
        <p className="text-[13px] text-[#9A9A9A] max-w-sm">
          This feature is coming soon. You'll be able to view customer profiles, order history, and
          manage accounts here.
        </p>
      </div>
    </div>
  )
}
