import { createRootRoute, Outlet } from '@tanstack/react-router'
import { AnnouncementBar } from '@/components/ui/AnnouncementBar'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout(): React.JSX.Element {
  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Navbar cartCount={0} />
      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
