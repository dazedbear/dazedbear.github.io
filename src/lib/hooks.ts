import { useEffect } from 'react'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import { useSiteContext, SiteContextAction } from '../lib/context'

/**
 * Custom hook to replace broken image with fallback image
 * @param param.selector DOM selector
 * @param param.fallbackImageUrl url for fallback image
 */
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

/**
 * Custom hook to detect device viewport and device
 */
export const useResizeHandler = () => {
  const DEVICE_BREAK_POINT = 1024
  const DEBOUNCE_MILLIONSECONED = 250
  const { dispatch } = useSiteContext()

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      const height = window.innerHeight
      const width = window.innerWidth
      const device = width < DEVICE_BREAK_POINT ? 'smartphone' : 'desktop'

      dispatch(SiteContextAction('UPDATE_DEVICE', { device }))
      dispatch(SiteContextAction('UPDATE_VIEWPORT', { height, width }))
      dispatch(
        SiteContextAction('TOGGLE_NAV_MENU', width >= DEVICE_BREAK_POINT)
      )
      dispatch(
        SiteContextAction(
          'TOGGLE_TABLE_OF_CONTENT',
          width >= DEVICE_BREAK_POINT
        )
      )
    }, DEBOUNCE_MILLIONSECONED)
    debouncedHandleResize()
    window.addEventListener('resize', debouncedHandleResize)
    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  }, [])
}

/**
 * Custom hook to update active heading of toc when scrolling
 */
export const useTOCScrollHandler = () => {
  const THROTTLE_MILLIONSECOND = 100
  const SECTION_CLASS_NAME = 'notion-h'
  const SECTION_ID_ARRTIBUTE = 'data-id'
  const NOTION_MAIN_CONTENT_CLASS_NAME = '.notion'

  const { activeSectionId, dispatch } = useSiteContext()

  useEffect(() => {
    // this scrollspy logic was originally based on
    // https://github.com/Purii/react-use-scrollspy
    const actionSectionScrollSpy = throttle(() => {
      const sections = document.getElementsByClassName(SECTION_CLASS_NAME)
      let prevBBox: DOMRect = null
      let currentSectionId = activeSectionId

      for (let i = 0; i < sections.length; ++i) {
        const section = sections[i]
        if (!section || !(section instanceof Element)) continue

        if (!currentSectionId) {
          currentSectionId = section.getAttribute(SECTION_ID_ARRTIBUTE)
        }

        const bbox = section.getBoundingClientRect()
        const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0
        const offset = Math.max(150, prevHeight / 4)

        // GetBoundingClientRect returns values relative to viewport
        if (bbox.top - offset < 0) {
          currentSectionId = section.getAttribute(SECTION_ID_ARRTIBUTE)
          prevBBox = bbox
          continue
        }
        // No need to continue loop, if last element has been detected
        break
      }
      dispatch(
        SiteContextAction('UPDATE_TOC_ACTIVE_SECTION_ID', currentSectionId)
      )
    }, THROTTLE_MILLIONSECOND)

    const container = document.querySelector(NOTION_MAIN_CONTENT_CLASS_NAME)
    container.addEventListener('scroll', actionSectionScrollSpy) // for desktop case
    window.addEventListener('scroll', actionSectionScrollSpy) // for smartphone case
    actionSectionScrollSpy()
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
      container.removeEventListener('scroll', actionSectionScrollSpy)
    }
  }, [])
}
