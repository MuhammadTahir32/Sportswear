import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/Button'

export const Route = createFileRoute('/accessories')({
  component: AccessoriesPage,
})

function AccessoriesPage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center py-32 px-6 bg-[#F7F7F7]">
      <div className="max-w-2xl text-center">
        <h1 className="font-[Anton,sans-serif] text-[48px] uppercase tracking-tight text-[#0D0D0D] mb-6">
          Shoelace Accessories
        </h1>
        <p className="text-[16px] text-[#4A4A4A] leading-relaxed mb-10">
          Upgrade your look with custom lace locks, premium aglets, and cleaning kits. Our
          accessories collection is dropping soon.
        </p>
        <Link to="/products">
          <Button variant="primary" size="lg">
            Back to Shop
          </Button>
        </Link>
      </div>
    </div>
  )
}
