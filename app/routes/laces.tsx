import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/Button'

export const Route = createFileRoute('/laces')({
  component: LacesPage,
})

function LacesPage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center py-32 px-6 bg-[#F7F7F7]">
      <div className="max-w-2xl text-center">
        <h1 className="font-[Anton,sans-serif] text-[48px] uppercase tracking-tight text-[#0D0D0D] mb-6">
          All Shoe Laces
        </h1>
        <p className="text-[16px] text-[#4A4A4A] leading-relaxed mb-10">
          Browse our entire collection of premium shoelaces. From classic flat to performance no-tie
          laces.
        </p>
        <Button as="a" href="/products" variant="primary" size="lg">
          View Collection
        </Button>
      </div>
    </div>
  )
}
