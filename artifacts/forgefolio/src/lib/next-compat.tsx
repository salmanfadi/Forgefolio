import React from 'react'
import { Link as WouterLink, useLocation } from 'wouter'

export function Link({
  href,
  children,
  ...props
}: React.ComponentProps<'a'> & { href: string }) {
  return (
    <WouterLink href={href} {...props}>
      {children}
    </WouterLink>
  )
}

export function usePathname() {
  const [location] = useLocation()
  return location
}

export function useParams() {
  const [location] = useLocation()
  const pathname = location.split('?')[0]
  const segments = pathname.split('/').filter(Boolean)

  if (segments[0] === 'roadmap') {
    return {
      slug: segments[1],
      stepId: segments[2],
    }
  }

  if (segments[0] === 'u') {
    return { username: segments[1] }
  }

  return {}
}

export function useRouter() {
  return {
    back: () => window.history.back(),
    push: (href: string) => {
      window.history.pushState({}, '', href)
      window.dispatchEvent(new PopStateEvent('popstate'))
    },
  }
}