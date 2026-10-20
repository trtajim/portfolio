/**
 * Progressive reveal-on-scroll animation matching reference/new_ref.html
 */
export function initScrollReveal() {
  if (typeof window === 'undefined') return () => {}

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion || !('IntersectionObserver' in window)) {
    return () => {}
  }

  document.documentElement.classList.add('js')

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          el.classList.add('in')
          observer.unobserve(el)
          setTimeout(() => {
            el.classList.remove('rv', 'in')
            el.style.transitionDelay = ''
          }, 900)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  )

  const rvElements = Array.from(document.querySelectorAll<HTMLElement>('.rv'))
  rvElements.forEach((el) => {
    const parent = el.parentNode
    if (parent) {
      const siblings = Array.from(parent.children).filter((child) => child.classList.contains('rv'))
      const idx = siblings.indexOf(el)
      el.style.transitionDelay = `${idx * 90}ms`
    }
    observer.observe(el)
  })

  return () => {
    observer.disconnect()
  }
}
