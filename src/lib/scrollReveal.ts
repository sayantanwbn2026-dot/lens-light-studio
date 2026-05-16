import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initScrollReveal(): void {
  
  // TEXT REVEALS — elements with class .reveal-text
  // Wrap each in overflow:hidden, animate inner from Y+100% to 0
  document.querySelectorAll('.reveal-text').forEach((el) => {
    const inner = el.querySelector('.reveal-inner') || el
    gsap.fromTo(inner,
      { y: '100%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 0.85,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        }
      }
    )
  })

  // FADE UP — elements with class .reveal-fade
  gsap.utils.toArray('.reveal-fade').forEach((el: unknown) => {
    const element = el as Element;
    gsap.fromTo(element,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 90%',
          once: true,
        }
      }
    )
  })

  // STAGGER GROUPS — parent with class .reveal-stagger
  // Children animate in sequence
  document.querySelectorAll('.reveal-stagger').forEach((group) => {
    const children = group.querySelectorAll('.stagger-item')
    gsap.fromTo(children,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.09,
        scrollTrigger: {
          trigger: group,
          start: 'top 86%',
          once: true,
        }
      }
    )
  })

  // SECTION LABELS — elements with class .reveal-label
  // Orange dot scales in first, then text reveals
  document.querySelectorAll('.reveal-label').forEach((el) => {
    const dot = el.querySelector('.label-dot')
    const text = el.querySelector('.label-text')
    if (!dot || !text) return
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    })
    tl.fromTo(dot,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' }
    )
    .fromTo(text,
      { x: -8, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.1'
    )
  })

  // IMAGE REVEALS — elements with class .reveal-image
  gsap.utils.toArray('.reveal-image').forEach((el: unknown) => {
    const element = el as Element;
    gsap.fromTo(element,
      { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
      {
        clipPath: 'inset(0 0 0% 0)',
        opacity: 1,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          once: true,
        }
      }
    )
  })

  // LINES — horizontal divider lines that draw in
  gsap.utils.toArray('.reveal-line').forEach((el: unknown) => {
    const element = el as Element;
    gsap.fromTo(element,
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 92%',
          once: true,
        }
      }
    )
  })
}
