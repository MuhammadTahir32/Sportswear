import { createFileRoute } from '@tanstack/react-router'
import { LayoutDashboard } from 'lucide-react'

export const Route = createFileRoute('/_admin/dashboard')({
  component: AdminDashboardPage,
})

function AdminDashboardPage(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#C6FF3D]/10 border-2 border-[#C6FF3D]/30 flex items-center justify-center mb-4">
        <LayoutDashboard size={32} className="text-[#0D0D0D]" strokeWidth={1.5} />
      </div>
      <h1
        className="text-2xl font-black text-[#0D0D0D] uppercase tracking-tight mb-2"
        style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
      >
        Admin Dashboard
      </h1>
      <p className="text-[#9A9A9A] text-sm">Dashboard metrics and analytics coming in Phase 3.</p>
    </div>
  )
}
