import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { AnnouncementBar } from '@/components/ui/AnnouncementBar'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { CartProvider } from '@/components/CartProvider'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout(): React.JSX.Element {
  const location = useLocation()
  const isAuthPage = [
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/reset-password',
    '/verify',
  ].some((path) => location.pathname.startsWith(path))

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1 w-full flex flex-col">
          <Outlet />
        </main>
        {!isAuthPage && <Footer />}
      </div>
    </CartProvider>
  )
}
