'use client'

import { cn } from '@/lib/utils'

interface StepItem {
  step: number
  label: string
}

interface GenerateStepperProps {
  currentStep: number
  steps: StepItem[]
}

export function GenerateStepper({ currentStep, steps }: GenerateStepperProps) {
  return (
    <div className='flex items-center gap-0 overflow-x-auto pb-1'>
      {steps.map(({ step, label }, index) => (
        <div key={step} className='flex flex-shrink-0 items-center'>
          <div className='flex flex-col items-center gap-1'>
            <div
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold sm:h-8 sm:w-8 sm:text-sm',
                currentStep === step
                  ? 'bg-foreground text-background'
                  : currentStep > step
                    ? 'bg-foreground/30 text-foreground'
                    : 'border-2 border-muted text-muted-foreground'
              )}
            >
              {currentStep > step ? '✓' : step}
            </div>
            <span
              className={cn(
                'hidden text-xs sm:block',
                currentStep >= step ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'mb-0 h-px w-6 flex-shrink-0 transition-colors sm:mb-5 sm:w-12',
                currentStep > step ? 'bg-foreground/30' : 'bg-muted'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
