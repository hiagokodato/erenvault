import { AnimatePresence, motion } from 'framer-motion'
import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { AppBottomNav } from '@/components/navigation/AppBottomNav'
import { AppMobileHeader } from '@/components/navigation/AppMobileHeader'
import { AppSidebar } from '@/components/navigation/AppSidebar'
import { useThemeMode } from '@/hooks/useThemeMode'

export function RootLayout() {
  useThemeMode()
  const location = useLocation()

  return (
    <div className="eren-app-shell min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:ring-1 focus:ring-primary"
      >
        Pular para o conteúdo
      </a>

      <div className="eren-app-grid relative flex min-h-dvh">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppMobileHeader />
          <AnimatePresence mode="wait">
            <motion.main
              id="main"
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex-1 pb-20 lg:pb-0"
            >
              <Suspense
                fallback={
                  <div className="flex min-h-[50vh] items-center justify-center">
                    <p className="animate-pulse font-display text-lg text-muted">
                      Um momentinho…
                    </p>
                  </div>
                }
              >
                <Outlet />
              </Suspense>
            </motion.main>
          </AnimatePresence>
        </div>
      </div>

      <AppBottomNav />
    </div>
  )
}
