import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/admin/settings')({
  component: AdminSettingsPage,
})

function AdminSettingsPage() {
  return (
    <div>
      <div className="pt-2 pb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-[14px] text-[#9A9A9A] mt-1">
            Manage your store preferences and configurations.
          </p>
        </div>
        <button className="bg-[#C6FF3D] hover:bg-[#b0e633] text-[#0D0D0D] text-[13px] font-bold px-5 py-2.5 rounded-[8px] h-auto flex items-center shadow-[0_0_15px_rgba(198,255,61,0.2)]">
          Save Changes
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-[16px] overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Left Sidebar Tabs */}
        <div className="w-full md:w-[240px] border-b md:border-b-0 md:border-r border-white/5 p-4">
          <nav className="flex flex-col space-y-1">
            <button className="text-left px-4 py-2.5 rounded-[8px] bg-white/5 text-[13px] font-bold text-white relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[20px] bg-[#C6FF3D] rounded-r-[3px]"></div>
              General
            </button>
            <button className="text-left px-4 py-2.5 rounded-[8px] text-[13px] font-medium text-[#9A9A9A] hover:text-white hover:bg-white/5 transition-colors">
              Store Details
            </button>
            <button className="text-left px-4 py-2.5 rounded-[8px] text-[13px] font-medium text-[#9A9A9A] hover:text-white hover:bg-white/5 transition-colors">
              Payment Methods
            </button>
            <button className="text-left px-4 py-2.5 rounded-[8px] text-[13px] font-medium text-[#9A9A9A] hover:text-white hover:bg-white/5 transition-colors">
              Notifications
            </button>
            <button className="text-left px-4 py-2.5 rounded-[8px] text-[13px] font-medium text-[#9A9A9A] hover:text-white hover:bg-white/5 transition-colors">
              Security
            </button>
            <button className="text-left px-4 py-2.5 rounded-[8px] text-[13px] font-medium text-[#9A9A9A] hover:text-white hover:bg-white/5 transition-colors">
              Billing
            </button>
          </nav>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-8">
          <div className="max-w-3xl">
            <h3 className="text-[16px] font-bold text-white">Store Information</h3>
            <p className="text-[13px] text-[#9A9A9A] mt-1 mb-6">
              Update your store's basic information.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[12px] font-semibold text-white block mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  defaultValue="StrideWear"
                  className="w-full h-[40px] px-4 bg-[#111] border border-white/5 rounded-[8px] text-[13px] text-white focus:outline-none focus:border-[#C6FF3D]/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-white block mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  defaultValue="support@stridewear.com"
                  className="w-full h-[40px] px-4 bg-[#111] border border-white/5 rounded-[8px] text-[13px] text-white focus:outline-none focus:border-[#C6FF3D]/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-white block mb-2">
                  Store Currency
                </label>
                <select className="w-full h-[40px] px-4 bg-[#111] border border-white/5 rounded-[8px] text-[13px] text-white focus:outline-none focus:border-[#C6FF3D]/50 transition-colors appearance-none cursor-pointer">
                  <option value="usd">USD ($)</option>
                  <option value="eur">EUR (€)</option>
                  <option value="gbp">GBP (£)</option>
                </select>
              </div>

              <div>
                <label className="text-[12px] font-semibold text-white block mb-2">Timezone</label>
                <select className="w-full h-[40px] px-4 bg-[#111] border border-white/5 rounded-[8px] text-[13px] text-white focus:outline-none focus:border-[#C6FF3D]/50 transition-colors appearance-none cursor-pointer">
                  <option value="pst">UTC -08:00 Pacific Time</option>
                  <option value="est">UTC -05:00 Eastern Time</option>
                  <option value="gmt">UTC +00:00 GMT</option>
                </select>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
              <button className="bg-[#C6FF3D] hover:bg-[#b0e633] text-[#0D0D0D] text-[13px] font-bold px-6 py-2.5 rounded-[8px] shadow-[0_0_15px_rgba(198,255,61,0.2)] transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
