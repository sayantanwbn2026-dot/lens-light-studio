import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenisInstance: Lenis | null = null
let rafId: number | null = null

export function initLenis(): Lenis | null {
  if (window.location.pathname.startsWith('/admin')) return null

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
    infinite: false,
  })

  // Synchronize ScrollTrigger with Lenis
  lenisInstance.on('scroll', () => ScrollTrigger.update())

  // Native high-resolution tick loop for buttery-smooth fluid scrolling
  function raf(time: number) {
    lenisInstance?.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)

  return lenisInstance
}

export function getLenis(): Lenis | null {
  return lenisInstance
}

export function destroyLenis(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  lenisInstance?.destroy()
  lenisInstance = null
}

