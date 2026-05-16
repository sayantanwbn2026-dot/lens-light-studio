import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenisInstance: Lenis | null = null

export function initLenis(): Lenis | null {
  if (window.location.pathname.startsWith('/admin')) return null

  lenisInstance = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: window.matchMedia('(pointer: coarse)').matches ? 1.0 : 0.88,
    touchMultiplier: window.matchMedia('(pointer: coarse)').matches ? 2.0 : 1.8,
    infinite: false,
  })

  // Single rAF loop — Lenis + GSAP on same tick
  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  // Keep ScrollTrigger in sync
  lenisInstance.on('scroll', () => ScrollTrigger.update())

  return lenisInstance
}

export function getLenis(): Lenis | null {
  return lenisInstance
}

export function destroyLenis(): void {
  gsap.ticker.remove((time) => lenisInstance?.raf(time * 1000))
  lenisInstance?.destroy()
  lenisInstance = null
}
