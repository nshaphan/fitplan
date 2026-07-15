import { Link } from '@tanstack/react-router'
import { DumbbellIcon, ForkIcon, TargetIcon, HistoryIcon } from '~/components/icons'

const TABS = [
  { to: '/train', label: 'Train', Icon: DumbbellIcon },
  { to: '/diet', label: 'Diet', Icon: ForkIcon },
  { to: '/targets', label: 'Targets', Icon: TargetIcon },
  { to: '/history', label: 'History', Icon: HistoryIcon },
] as const

export function BottomNav() {
  return (
    <nav className="fixed left-4 right-4 bottom-[calc(10px+env(safe-area-inset-bottom))] z-50 mx-auto max-w-[428px] grid grid-cols-4 gap-1 rounded-full p-1.5 glass-strong shadow-l3">
      {TABS.map(({ to, label, Icon }) => (
        <Link
          key={to}
          to={to}
          className="flex flex-col items-center gap-0.5 rounded-full py-2 px-1 text-[11px] font-bold text-pilloff-text"
          activeProps={{ className: 'text-accent bg-nav-active' }}
        >
          <Icon size={20} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  )
}
