import { GetServerSidePropsResult } from 'next'
import { ExtendedRecordMap } from 'notion-types'
import get from 'lodash/get'
import {
  ErrorPageProps,
  NotionPageName,
  logOption,
  logLevel,
  GetServerSidePropsRequest,
  GetServerSidePropsResponse,
} from '../../../types'
import log from './log'
import { notion } from '../../../site.config'
import { getNotionPage } from '../../libs/server/notion'

/**
 * util to get common page props (404, 500) for getServerSideProps
 * @param req {object} req
 * @param res {object} res
 * @param type {string} type, support 'notFound', 'error' (default)
 * @param path {string} path string or string array
 * @returns pageProps
 */
export const showCommonPage = (
  req: GetServerSidePropsRequest,
  res: GetServerSidePropsResponse,
  type: 'notFound' | 'error',
  path: string | string[]
): GetServerSidePropsResult<ErrorPageProps | {}> => {
  let level: logLevel | null = 'error'
  let statusCode: number | null = null
  let pageProps: any = {}

  if (type === 'notFound') {
    level = 'warn'
    statusCode = 404
    pageProps = {
      notFound: true,
    }
  } else {
    level = 'error'
    statusCode = 500
    pageProps = {
      props: {
        hasError: true,
      },
    }
  }

  const options: logOption = {
    category: 'page',
    message: `render ${type} page | statusCode: ${statusCode} | path: /${
      Array.isArray(path) ? path.join('/') : path
    }`,
    level,
    req,
  }
  log(options)
  res.statusCode = statusCode
  return pageProps
}

/**
 * validate input pageName
 * @param {string} pageName
 * @returns {boolean} pageName validation result
 */
export const isValidPageName = (pageName: NotionPageName): boolean => {
  const pageId: string = get(notion, ['pages', pageName, 'pageId'])
  const pageEnabled: boolean = get(notion, ['pages', pageName, 'enabled'])
  return pageId && pageEnabled
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
  req,
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
      req,
    }
    log(options)
    throw 'Required info are invalid in fetchArticles.'
  }

  const response = await getNotionPage(id)
  return response
}

/**
 * fetch article from upstream API
 * @param {object} req
 * @param {string} pageName
 * @returns {object} raw data from upstream API
 */
export const fetchSingleArticleStream = async (
  req: GetServerSidePropsRequest,
  pageId: string,
  category: string
): Promise<ExtendedRecordMap> => {
  if (!pageId) {
    const options: logOption = {
      category,
      message: `required info are invalid | pageId: ${pageId}`,
      level: 'error',
      req,
    }
    log(options)
    throw 'Required info are invalid in fetchArticles.'
  }

  const response = await getNotionPage(pageId)
  return response
}
