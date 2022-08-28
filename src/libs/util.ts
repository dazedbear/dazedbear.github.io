import { useRouter } from 'next/router'
import get from 'lodash/get'
import {
  notion,
  meta as commonMeta,
  pages as staticPages,
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
 * @returns {boolean} current next.js page is active or not
 */
export const isActivePage = (page) => {
  const { asPath } = useRouter()
  if (!page) {
    return false
  }
  const regex = new RegExp(`${page}(\/.+)+`, 'i')
  return page === asPath || regex.test(asPath)
}

/**
 * get title of current page from navigation config
 * @returns {string} title of current page
 */
export const getPageMeta = (pageMeta: PageMeta = {}): PageMeta => {
  const { asPath } = useRouter()
  const meta = {
    title: commonMeta.title,
    description: commonMeta.description,
    image: commonMeta.image,
  }

  // pageMeta is for SSR pages override
  // add fallback logic for static pages & SSR pages without meta override
  const page = asPath === '/' ? 'index' : asPath.split('/').filter(Boolean)[0]
  const pageTitle =
    pageMeta.title ||
    get(staticPages, [page, 'title']) ||
    get(notion, ['pages', page, 'navMenuTitle'])
  if (pageTitle) {
    meta.title = `${pageTitle} · ${commonMeta.title}`
  }
  if (pageMeta.description) {
    meta.description = pageMeta.description
  }
  if (pageMeta.image) {
    meta.image = pageMeta.image
  }
  return meta
}
