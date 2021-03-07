import { useEffect } from 'react'

export const useBrokenImageHandler = ({ selector, fallbackImageUrl }) => {
  if (!selector) {
    return
  }
  useEffect(() => {
    const images = document.querySelectorAll(selector)
    const loadFallbackImageHandler = e => {
      e.target.setAttribute('src', fallbackImageUrl)
    }
    const hideBrokenImageHandler = e => {
      e.target.className = 'hidden'
    }
    images.forEach(img => {
      const handler = fallbackImageUrl
        ? loadFallbackImageHandler
        : hideBrokenImageHandler
      img.addEventListener('error', handler)
    })
    return () => {
      images.forEach(img => {
        img.removeEventListener('error', hideBrokenImageHandler)
        img.removeEventListener('error', loadFallbackImageHandler)
      })
    }
  })
}
