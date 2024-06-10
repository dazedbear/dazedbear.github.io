import { ExtendedRecordMap } from 'notion-types'
import get from 'lodash/get'
import { performance } from 'perf_hooks'
import {
  NotionPageName,
  logOption,
  GetServerSidePropsRequest,
} from '../../../types'
import log from './log'
import { notion } from '../../../site.config'
import { getNotionPage } from '../../libs/server/notion'

/**
 * validate input pageName
 * @param {string} pageName
 * @returns {boolean} pageName validation result
 */
export const isValidPageName = (pageName: NotionPageName): boolean => {
  const pageId: string = get(notion, ['pages', pageName, 'pageId'])
  const pageEnabled: boolean = get(notion, ['pages', pageName, 'enabled'])
  return Boolean(pageId && pageEnabled)
}

/**
 * validate input pageSlug
 * @param {string} pageSlug
 * @returns {boolean} pageSlug validation result
 */
export const isValidPageSlug = (pageSlug: string | string[]): boolean => {
  const regex: RegExp = /.+\-[a-zA-Z0-9]{12}/gi
  return typeof pageSlug === 'string' && regex.test(pageSlug)
}

/**
 * fetch article from upstream API
 * @param {object} req
 * @param {string} pageName
 * @returns {object} raw data from upstream API
 */
export const fetchArticleStream = async ({
  pageName,
  pageId,
  category,
}: {
  pageName?: NotionPageName
  pageId?: string
  category?: string
}): Promise<ExtendedRecordMap> => {
  let isRequiredInfoReady = false
  let message = ''
  let id: string = ''

  if (pageName) {
    id = get(notion, ['pages', pageName, 'pageId'])
    const collectionId: string = get(notion, [
      'pages',
      pageName,
      'collectionId',
    ])
    const collectionViewId: string = get(notion, [
      'pages',
      pageName,
      'collectionViewId',
    ])
    const pageEnabled: boolean = get(notion, ['pages', pageName, 'enabled'])
    if (id && collectionId && collectionViewId && pageEnabled) {
      isRequiredInfoReady = true
    } else {
      message = `required info are invalid | pageId: ${pageId} | collectionId: ${collectionId} | collectionViewId: ${collectionViewId} | pageEnabled: ${pageEnabled}`
    }
  } else if (pageId) {
    id = pageId
    isRequiredInfoReady = true
  }

  if (!isRequiredInfoReady) {
    const options: logOption = {
      category: category || 'fetchArticleStream',
      message,
      level: 'error',
    }
    log(options)
    throw Error('Required info are invalid in fetchArticleStream.')
  }

  const response = await getNotionPage(id)
  return response
}

/**
 * fetch single page content from upstream API
 * @param {string} pageName
 * @returns {object} raw data from upstream API
 */
export const fetchSinglePage = async ({
  pageName,
  pageId,
  category,
}: {
  req?: GetServerSidePropsRequest
  pageName?: NotionPageName
  pageId?: string
  category?: string
}): Promise<ExtendedRecordMap> => {
  let isRequiredInfoReady = false
  let message = ''
  let id: string = ''

  if (pageName) {
    id = get(notion, ['pages', pageName, 'pageId'])
    const pageEnabled: boolean = get(notion, ['pages', pageName, 'enabled'])
    if (id && pageEnabled) {
      isRequiredInfoReady = true
    } else {
      message = `required info are invalid | pageId: ${pageId} | pageEnabled: ${pageEnabled}`
    }
  } else if (pageId) {
    id = pageId
    isRequiredInfoReady = true
  }

  if (!isRequiredInfoReady) {
    const options: logOption = {
      category: category || 'fetchSinglePage',
      message,
      level: 'error',
    }
    log(options)
    throw Error('Required info are invalid in fetchSinglePage.')
  }

  const response = await getNotionPage(id)
  return response
}

/**
 * execute function with timeout. If execFn finishes in timeout, will get the result of execFn. If not, will get the result of fallbackFn.
 * @param {Function | AsyncGeneratorFunction} execFn
 * @param {Function | AsyncGeneratorFunction} fallbackFn
 * @param {number} timeout
 * @param {string} label
 * @returns {Promise<any>} result of execFn or fallbackFn
 */
export const executeFunctionWithTimeout = async (
  execFn: Function | AsyncGeneratorFunction,
  timeout: number = 0,
  fallbackFn?: Function | AsyncGeneratorFunction,
  label?: string
): Promise<any> => {
  const REACH_TIMEOUT = 'function execution exceeds timeout'
  if (!timeout) {
    return await execFn()
  }

  let timerId
  const timer = new Promise((resolve) => {
    timerId = setTimeout(() => {
      timerId = undefined
      resolve(REACH_TIMEOUT)
    }, timeout)
  })
  const execTime = {
    start: 0,
    end: 0,
    duration: 0,
  }
  execTime.start = performance.now()
  let result = await Promise.race([timer, execFn()])
  execTime.end = performance.now()
  execTime.duration = Math.round(execTime.end - execTime.start) // ms
  const options: logOption = {
    category: label || 'executeFunctionWithTimeout',
    message: `function processing is done | duration: ${execTime.duration} ms`,
    level: 'info',
  }
  log(options)
  if (timerId) {
    clearTimeout(timerId)
    timerId = undefined
  }
  if (result === REACH_TIMEOUT) {
    result =
      typeof fallbackFn === 'function'
        ? await fallbackFn(execTime.duration)
        : false
  }
  return result
}
