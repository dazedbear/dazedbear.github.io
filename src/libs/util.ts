import { useRouter } from 'next/router'
import { navigation as navItems } from '../../site.config'

/**
 * get formatted date string
 * @param {any} date timestamp or date string
 * @returns {string} formatted date string like `January 23, 2021`
 */
export const getDateStr = date => {
  return new Date(date).toLocaleString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })
}

/**
 * detect current next.js page is active or not
 * @param {string} page next.js page pathname
 * @returns {boolean} current next.js page is active or not
 */
export const isActivePage = page => {
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
export const getCurrentPageTitle = () => {
  const { pathname } = useRouter()
  return navItems.find(({ page }) => page !== '/' && pathname.includes(page))
    ?.label
}
