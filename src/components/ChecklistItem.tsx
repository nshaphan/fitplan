import { CheckIcon } from '~/components/icons'

export function ChecklistItem({
  label,
  checked,
  onToggle,
}: {
  label: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div
      className="flex gap-3 items-start py-2.5 border-t border-hairline first:border-t-0 cursor-pointer"
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      aria-label={label}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          onToggle()
        }
      }}
    >
      <div
        aria-hidden="true"
        className={
          'flex-none w-6 h-6 rounded-lg border-[1.5px] flex items-center justify-center mt-px ' +
          (checked ? 'bg-done border-done text-done-contrast' : 'bg-pilloff border-pilloff text-transparent')
        }
      >
        <CheckIcon size={14} />
      </div>
      <div className={'text-[15px] ' + (checked ? 'text-sub line-through' : '')}>{label}</div>
    </div>
  )
}
