import { GetServerSidePropsResult } from 'next'
import {
  ErrorPageProps,
  logOption,
  logLevel,
  GetServerSidePropsRequest,
  GetServerSidePropsResponse,
} from '../../../types'
import log from './log'

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
