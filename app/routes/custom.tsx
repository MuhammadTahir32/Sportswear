import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/Button'

export const Route = createFileRoute('/custom')({
  component: CustomPage,
})

function CustomPage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center py-32 px-6 bg-[#F7F7F7]">
      <div className="max-w-2xl text-center">
        <h1 className="font-[Anton,sans-serif] text-[48px] uppercase tracking-tight text-[#0D0D0D] mb-6">
          Custom Shoelaces
        </h1>
        <p className="text-[16px] text-[#4A4A4A] leading-relaxed mb-10">
          Design your own unique shoelaces. Choose your exact length, color, material, and aglet
          style. The customizer tool is currently in beta and will be available to everyone shortly.
        </p>
        <Link to="/products">
          <Button variant="primary" size="lg">
            Contact for Custom Order
          </Button>
        </Link>
      </div>
    </div>
  )
}
