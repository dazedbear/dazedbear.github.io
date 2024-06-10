import { useEffect, useState } from 'react'
import prism from 'prismjs'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import LogRocket from 'logrocket'
import { AppState, AppDispatch } from './store'
import {
  updateDevice,
  updateNavMenuViewability,
  updateTableOfContentViewability,
  updateViewport,
} from './slices/layout'
import { currentEnv, trackingSettings } from '../../../site.config'

/**
 * Pre-typed useSelector & useAppDispatch for react-redux.
 * Please use them throughout the app instead of plain `useAppDispatch` and `useSelector`
 */
export const useAppDispatch = () => useDispatch()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

/**
 * Custom hook to replace broken image with fallback image
 * @param param.selector DOM selector
 * @param param.fallbackImageUrl url for fallback image
 */
export const useBrokenImageHandler = ({ selector, fallbackImageUrl }) => {
  useEffect(() => {
    if (!selector) {
      return
    }
    const images = document.querySelectorAll(selector)
    const loadFallbackImageHandler = (e) => {
      e.target.setAttribute('src', fallbackImageUrl)
    }
    const hideBrokenImageHandler = (e) => {
      e.target.className = 'hidden'
    }
    images.forEach((img) => {
      const handler = fallbackImageUrl
        ? loadFallbackImageHandler
        : hideBrokenImageHandler
      img.addEventListener('error', handler)
    })
    return () => {
      images.forEach((img) => {
        img.removeEventListener('error', hideBrokenImageHandler)
        img.removeEventListener('error', loadFallbackImageHandler)
      })
    }
  })
}

/**
 * Disable links when specific condition fulfills. We use this hook to remove links from notion table in single notion page.
 */
export const useRemoveLinks = ({ selector, condition }) => {
  useEffect(() => {
    if (!selector) {
      return
    }

    let isEnabled = true
    if (typeof condition === 'function') {
      isEnabled = condition()
    }

    if (!isEnabled) {
      return
    }

    const links = document.querySelectorAll(selector)
    links.forEach((node) => {
      if (node.hasAttribute('href')) {
        node.removeAttribute('href')
      }
      if (node.hasAttribute('src')) {
        node.removeAttribute('src')
      }
      node.addEventListener('click', (e) => e.preventDefault()) // disable a redirection
    })
  })
}

/**
 * Custom hook to detect device viewport and device
 */
export const useResizeHandler = () => {
  const DEVICE_BREAK_POINT = 1024
  const DEBOUNCE_MILLIONSECONED = 250
  const dispatch = useAppDispatch()

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      const height = window.innerHeight
      const width = window.innerWidth
      const device = width < DEVICE_BREAK_POINT ? 'smartphone' : 'desktop'

      dispatch(updateDevice(device))
      dispatch(updateViewport({ height, width }))
      dispatch(updateNavMenuViewability(width >= DEVICE_BREAK_POINT))
      dispatch(updateTableOfContentViewability(width >= DEVICE_BREAK_POINT))
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

  const [activeSectionId, updateTocActiveSectionId] = useState('')

  useEffect(() => {
    // this scrollspy logic was originally based on
    // https://github.com/Purii/react-use-scrollspy
    const actionSectionScrollSpy = throttle(() => {
      const sections = document.getElementsByClassName(SECTION_CLASS_NAME)
      let prevBBox: DOMRect | null = null
      let currentSectionId: any = activeSectionId

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
      updateTocActiveSectionId(currentSectionId)
    }, THROTTLE_MILLIONSECOND)

    const container = document.querySelector(NOTION_MAIN_CONTENT_CLASS_NAME)
    container?.addEventListener('scroll', actionSectionScrollSpy) // for desktop case
    window.addEventListener('scroll', actionSectionScrollSpy) // for smartphone case
    actionSectionScrollSpy()
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
      container?.removeEventListener('scroll', actionSectionScrollSpy)
    }
  }, [])
  return {
    activeSectionId,
    updateTocActiveSectionId,
  }
}

/**
 * Custom hook to initialize LogRocket tracking
 */
export const useInitLogRocket = () => {
  const [isInitialized, setInitialized] = useState(false)

  useEffect(() => {
    const isLocal = currentEnv === 'development'
    if (!isLocal && !isInitialized && trackingSettings?.logRocket?.enable) {
      LogRocket.init(trackingSettings?.logRocket?.id)
      setInitialized(true)
    }
  })
}

/**
 * Custom hook to trigger prism.js code syntax highlight
 * @see https://mxd.codes/articles/syntax-highlighting-with-prism-and-next-js
 */
export const useCodeSyntaxHighlight = () => {
  useEffect(() => {
    prism.highlightAll()
  })
}
