import { ReadonlyURLSearchParams } from 'next/navigation'
import { pageProcessTimeout, cache } from '../../../site.config'
import {
  FAILSAFE_PAGE_GENERATION_QUERY,
  FORCE_CACHE_REFRESH_QUERY,
  PAGE_TYPE_NOTION_SINGLE_PAGE,
} from '../../libs/constant'
import log from '../../libs/server/log'
import {
  fetchSinglePage,
  isValidPageName,
  executeFunctionWithTimeout,
} from '../../libs/server/page'
import { transformSinglePage } from '../../libs/server/transformer'

export const getNotionSinglePageContent = async ({
  category = PAGE_TYPE_NOTION_SINGLE_PAGE,
  pageName,
  searchParams,
}: {
  category?: string
  pageName: string
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
        const response = await fetchSinglePage({
          pageName,
          category,
        })
        const pageContent = await transformSinglePage(response)

        log({
          category: 'page',
          message: `dumpaccess to /${pageName}`,
          level: 'info',
        })
        return pageContent
      } catch (err) {
        log({
          category,
          message: err,
          level: 'error',
        })
        throw err
      }
    },
    timeout,
    (duration) => {
      log({
        category,
        message: `page processing timeout | duration: ${duration} ms`,
        level: 'warn',
      })
    },
    category
  )

  return content
}
