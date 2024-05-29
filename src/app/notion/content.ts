import { ReadonlyURLSearchParams } from 'next/navigation'
import { pageProcessTimeout, cache } from '../../../site.config'
import {
  FAILSAFE_PAGE_GENERATION_QUERY,
  FORCE_CACHE_REFRESH_QUERY,
  PAGE_TYPE_NOTION_SINGLE_PAGE,
  PAGE_TYPE_NOTION_ARTICLE_LIST_PAGE,
} from '../../libs/constant'
import log from '../../libs/server/log'
import {
  fetchSinglePage,
  fetchArticleStream,
  isValidPageName,
  executeFunctionWithTimeout,
} from '../../libs/server/page'
import {
  transformArticleStream,
  transformArticleStreamPreviewImages,
  transformMenuItems,
  transformSinglePage,
} from '../../libs/server/transformer'

export const getNotionContent = async ({
  pageName,
  searchParams,
  pageType,
}: {
  pageName: string
  pageType: string
  searchParams: ReadonlyURLSearchParams | null
}) => {
  let timeout = pageProcessTimeout

  if (searchParams) {
    timeout = searchParams[FAILSAFE_PAGE_GENERATION_QUERY] === '1' ? 0 : timeout
    cache.forceRefresh = searchParams[FORCE_CACHE_REFRESH_QUERY] === '1'
  }

  const content = await executeFunctionWithTimeout(
    async () => {
      try {
        if (!isValidPageName(pageName)) {
          throw Error(`invalid page | pageName: ${pageName}`)
        }

        switch (pageType) {
          case PAGE_TYPE_NOTION_SINGLE_PAGE: {
            const response = await fetchSinglePage({
              pageName,
              category: pageType,
            })
            const pageContent = await transformSinglePage(response)
            log({
              category: pageType,
              message: `dumpaccess to /${pageName}`,
              level: 'info',
            })
            return { pageContent }
          }

          case PAGE_TYPE_NOTION_ARTICLE_LIST_PAGE: {
            const response = await fetchArticleStream({
              pageName,
              category: pageType,
            })
            let articleStream = await transformArticleStream(pageName, response)
            articleStream = await transformArticleStreamPreviewImages(
              articleStream
            )
            const menuItems = transformMenuItems(pageName, articleStream)

            return {
              menuItems,
              articleStream,
            }
          }

          default: {
            throw Error(`invalid pageType | pageType: ${pageType}`)
          }
        }
      } catch (err) {
        log({
          category: pageType,
          message: err,
          level: 'error',
        })
        throw err
      }
    },
    timeout,
    (duration) => {
      log({
        category: pageType,
        message: `page processing timeout | duration: ${duration} ms`,
        level: 'warn',
      })
    },
    pageType
  )

  return content
}
