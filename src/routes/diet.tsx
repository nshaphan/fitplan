import { createFileRoute } from '@tanstack/react-router'
import { MEALS, RULES } from '~/data/plan'
import { MealAccordion } from '~/components/MealAccordion'
import { ChecklistItem } from '~/components/ChecklistItem'
import { RestTimerBar } from '~/components/RestTimerBar'
import { useFitPlan } from '~/lib/state'

export const Route = createFileRoute('/diet')({
  component: DietPage,
})

function DietPage() {
  const { state, setDiet, toggleRule } = useFitPlan()

  return (
    <section>
      <div className="glass rounded-[28px] p-5 my-3.5">
        <span className="inline-block bg-badge text-badge text-[11px] font-bold tracking-widest uppercase py-1.5 px-3 rounded-full mb-2.5">Daily Template</span>
        <h2 className="text-xl font-bold">What to eat</h2>
        <p className="text-sub text-[13.5px] mt-0.5">
          Tap a meal to expand. Portions follow the hand rule: palm = protein, fist = carbs, two fists = vegetables, thumb = fats.
        </p>
        <div className="flex gap-2 my-2.5 mb-0.5">
          <button
            onClick={() => setDiet('train')}
            className={'flex-1 rounded-[12px] py-2.5 text-sm font-semibold border-[1.5px] ' + (state.diet === 'train' ? 'border-accent text-accent bg-badge' : 'border-pilloff text-pilloff bg-pilloff')}
          >
            Training day
          </button>
          <button
            onClick={() => setDiet('rest')}
            className={'flex-1 rounded-[12px] py-2.5 text-sm font-semibold border-[1.5px] ' + (state.diet === 'rest' ? 'border-accent text-accent bg-badge' : 'border-pilloff text-pilloff bg-pilloff')}
          >
            Rest day
          </button>
        </div>
        <MealAccordion meals={MEALS[state.diet]} />
      </div>

      <div className="glass rounded-[28px] p-5 my-3.5">
        <span className="inline-block bg-badge text-badge text-[11px] font-bold tracking-widest uppercase py-1.5 px-3 rounded-full mb-2.5">Non-negotiables</span>
        <h2 className="text-xl font-bold">The 10 rules</h2>
        <p className="text-sub text-[13.5px] mt-0.5">These do 90% of the work. Tap to check off as habits lock in.</p>
        {RULES.map((r, i) => (
          <ChecklistItem key={i} label={`${i + 1}. ${r}`} checked={!!state.rules['r' + i]} onToggle={() => toggleRule(i)} />
        ))}
      </div>

      <div className="glass rounded-[28px] p-5 my-3.5">
        <span className="inline-block bg-badge text-badge text-[11px] font-bold tracking-widest uppercase py-1.5 px-3 rounded-full mb-2.5">Hydration</span>
        <h2 className="text-xl font-bold">Drink</h2>
        <p className="text-sub text-[13.5px] mt-1.5">
          2.5–3.5 L water daily, more on training days. Water, black coffee and tea are free. Soda, juice and beer silently erase the deficit — occasional, not daily.
        </p>
      </div>
      <RestTimerBar />
    </section>
  )
}
