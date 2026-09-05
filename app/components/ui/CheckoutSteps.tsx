import { Check } from 'lucide-react'

type Step = {
  id: number
  label: string
}

const STEPS: Step[] = [
  { id: 1, label: 'Shipping Address' },
  { id: 2, label: 'Shipping Method' },
  { id: 3, label: 'Review & Pay' },
]

type CheckoutStepsProps = {
  currentStep: number
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps): React.JSX.Element {
  return (
    <nav aria-label="Checkout progress" className="w-full mb-10">
      <ol className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id
          const isCurrent = currentStep === step.id
          const isLast = index === STEPS.length - 1

          return (
            <li key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step circle + label */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#C6FF3D] border-[#C6FF3D] text-[#0D0D0D]'
                      : isCurrent
                        ? 'bg-[#0D0D0D] border-[#0D0D0D] text-white'
                        : 'bg-white border-[#E0E0E0] text-[#9A9A9A]'
                  }`}
                >
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : step.id}
                </div>
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap ${
                    isCurrent || isCompleted ? 'text-[#0D0D0D]' : 'text-[#9A9A9A]'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 h-[2px] mx-4 mt-[-20px]">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isCompleted ? 'bg-[#C6FF3D]' : 'bg-[#E0E0E0]'
                    }`}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
