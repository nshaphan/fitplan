/// <reference types="vite/client" />
import * as React from 'react'
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import appCss from '~/styles/app.css?url'
import { FitPlanProvider } from '~/lib/state'
import { BackgroundBlobs } from '~/components/BackgroundBlobs'
import { BottomNav } from '~/components/BottomNav'
import { ServiceWorkerRegistration } from '~/components/ServiceWorkerRegistration'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: 'FitPlan' },
      { name: 'description', content: '5-day strength & endurance training and diet tracker.' },
      { title: 'Strength & Endurance Plan' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'manifest', href: '/fitplan/manifest.json' },
      { rel: 'apple-touch-icon', href: '/fitplan/icons/icon-180.png' },
      { rel: 'icon', href: '/fitplan/icons/icon-192.png' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Rendered as literal JSX (not via head.meta) because HeadContent dedupes meta tags by
            `name` alone, which would drop one of these two dark/light theme-color variants. */}
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#08090D" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#F2F3F6" />
      </head>
      <body className="relative overflow-x-hidden bg-app text-app pb-[calc(140px+env(safe-area-inset-bottom))]">
        <BackgroundBlobs />
        <FitPlanProvider>
          <div className="relative z-[1] max-w-[520px] mx-auto px-4">
            <header className="pt-[calc(18px+env(safe-area-inset-top))] pb-2.5">
              <span className="text-accent text-xs font-bold tracking-[0.14em] uppercase">5-Day Plan · Beginner</span>
              <h1 className="text-[26px] font-bold leading-[1.15] mt-0.5 tracking-tight">Strength · Endurance · Fat Loss</h1>
            </header>
            <Outlet />
            <footer className="text-sub2 text-xs text-center py-5 pb-2 relative z-[1]">
              Consistency beats perfection · an 80% week beats a perfect 3 days
            </footer>
          </div>
          <BottomNav />
          <ServiceWorkerRegistration />
        </FitPlanProvider>
        <Scripts />
      </body>
    </html>
  )
}
