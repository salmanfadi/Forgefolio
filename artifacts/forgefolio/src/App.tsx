import { type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from '@/components/error-boundary'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import NotFound from '@/pages/not-found'
import LandingPage from '@/app/(public)/page'
import DashboardPage from '@/app/(app)/dashboard/page'
import ProjectsPage from '@/app/(app)/projects/page'
import VerificationHubPage from '@/app/(app)/verify/page'
import RoadmapIndexPage from '@/app/(app)/roadmap/page'
import RoadmapDetailPage from '@/app/(app)/roadmap/[slug]/page'
import StepDetailPage from '@/app/(app)/roadmap/[slug]/[stepId]/page'
import DirectoryPage from '@/app/(public)/directory/page'
import SkillPassportPage from '@/app/(public)/u/[username]/page'
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter'

const queryClient = new QueryClient();

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/projects" component={ProjectsPage} />
        <Route path="/verify" component={VerificationHubPage} />
        <Route path="/roadmap" component={RoadmapIndexPage} />
        <Route path="/roadmap/:slug/:stepId" component={StepDetailPage} />
        <Route path="/roadmap/:slug" component={RoadmapDetailPage} />
        <Route path="/directory" component={DirectoryPage} />
        <Route path="/u/:username" component={SkillPassportPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
