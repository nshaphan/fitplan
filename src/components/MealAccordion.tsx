import * as React from 'react'
import type { Meal } from '~/data/plan'

export function MealAccordion({ meals }: { meals: Meal[] }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  return (
    <div>
      {meals.map((m, i) => {
        const open = openIndex === i
        return (
          <div key={i} className="border-t border-hairline first:border-t-0 py-3">
            <div
              role="button"
              tabIndex={0}
              aria-expanded={open}
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setOpenIndex(open ? null : i)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault()
                  setOpenIndex(open ? null : i)
                }
              }}
            >
              <h3 className="text-[15.5px] font-semibold">{m.h}</h3>
              <span className="text-xs text-accent font-bold">{m.k}</span>
            </div>
            {open && (
              <ul className="mt-2 ml-4.5 text-sub text-sm list-disc">
                {m.li.map((x, j) => (
                  <li key={j} className="my-1">{x}</li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
