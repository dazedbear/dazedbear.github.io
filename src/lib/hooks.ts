import { useEffect } from 'react'

// FIXME: this approach has race condition during build time since some images are already borken before this effect executed.
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

    if (fallbackImageUrl) {
      const testFallbackImage = new Image()
      testFallbackImage.src = fallbackImageUrl
      testFallbackImage.onload = () => {
        images.forEach(img => {
          img.addEventListener('error', loadFallbackImageHandler)
        })
      }
      testFallbackImage.onerror = () => {
        console.error('invalid fallbackImageUrl provided.', fallbackImageUrl)
        images.forEach(img => {
          img.addEventListener('error', hideBrokenImageHandler)
        })
      }
    } else {
      images.forEach(img => {
        img.addEventListener('error', hideBrokenImageHandler)
      })
    }
    return () => {
      images.forEach(img => {
        img.removeEventListener('error', hideBrokenImageHandler)
        img.removeEventListener('error', loadFallbackImageHandler)
      })
    }
  })
}
