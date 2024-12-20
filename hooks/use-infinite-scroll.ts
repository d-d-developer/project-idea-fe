import { useEffect, useRef } from 'react'

interface UseInfiniteScrollProps {
  onIntersect: () => void
  enabled?: boolean
}

export function useInfiniteScroll({ onIntersect, enabled = true }: UseInfiniteScrollProps) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && enabled) {
        onIntersect()
      }
    },
    { threshold: 0.1 }
  )

  return (element: HTMLElement | null) => {
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }
}
