import get from 'lodash/get'
import {
  notion,
  meta as commonMeta,
  pages as staticPages,
  currentWebsite,
} from '../../site.config'
import { PageMeta } from '../../types'

/**
 * get formatted date string
 * @param {any} date timestamp or date string
 * @returns {string} formatted date string like `January 23, 2021`
 */
export const getDateStr = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Taipei',
  })
}

/**
 * detect current next.js page is active or not
 * @param {string} page next.js page pathname
 * @param {string} pathname current next.js pathname
 * @returns {boolean} current next.js page is active or not
 */
export const isActivePage = (page, pathname) => {
  if (!page || !pathname) {
    return false
  }
  const regex = new RegExp(`${page}(\/.+)+`, 'i')
  return page === pathname || regex.test(pathname)
}

/**
 * get title of current page from navigation config
 * @returns {string} title of current page
 */
export const getPageMeta = (
  pageMeta: PageMeta = {},
  pageName: string = 'index'
): PageMeta => {
  if (!pageName) {
    return {}
  }
  const meta = {
    metadataBase: new URL(
      `${currentWebsite.protocol}://${currentWebsite.host}`
    ),
    title: commonMeta.title,
    description: commonMeta.description,
    image: commonMeta.image,
    openGraph: {
      title: commonMeta.title,
      description: commonMeta.description,
      images: [
        {
          url: commonMeta.image,
          alt: commonMeta.title,
        },
      ],
    },
  }

  // pageMeta is for SSR pages override
  // add fallback logic for static pages & SSR pages without meta override
  const pageTitle =
    pageMeta.title ||
    get(staticPages, [pageName, 'title']) ||
    get(notion, ['pages', pageName, 'navMenuTitle'])

  if (pageTitle) {
    const newTitle = `${pageTitle} · ${commonMeta.title}`
    meta.title = newTitle
    meta.openGraph.title = newTitle
    meta.openGraph.images[0].alt = newTitle
  }
  if (pageMeta.description) {
    meta.description = pageMeta.description
    meta.openGraph.description = pageMeta.description
  }
  if (pageMeta.image) {
    meta.image = pageMeta.image
    meta.openGraph.images[0].url = pageMeta.image
  }
  return meta
}
