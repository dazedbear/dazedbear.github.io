import merge from 'lodash/merge'
import { ReadonlyURLSearchParams, notFound } from 'next/navigation'
import { idToUuid } from 'notion-utils'
import { pageProcessTimeout, cache } from '../../../site.config'
import {
  FAILSAFE_PAGE_GENERATION_QUERY,
  FORCE_CACHE_REFRESH_QUERY,
  PAGE_TYPE_NOTION_SINGLE_PAGE,
  PAGE_TYPE_NOTION_ARTICLE_LIST_PAGE,
  PAGE_TYPE_NOTION_ARTICLE_DETAIL_PAGE,
} from '../../libs/constant'
import log from '../../libs/server/log'
import {
  fetchSinglePage,
  fetchArticleStream,
  isValidPageName,
  isValidPageSlug,
  executeFunctionWithTimeout,
} from '../../libs/server/page'
import {
  transformArticleStream,
  transformArticleStreamPreviewImages,
  transformMenuItems,
  transformSinglePage,
  transformSingleArticle,
  transformTableOfContent,
} from '../../libs/server/transformer'
import { extractSinglePagePath } from '../../libs/notion'

export const getNotionContent = async ({
  pageName,
  searchParams,
  pageType,
  pageSlug = '',
}: {
  pageName: string
  pageType: string
  pageSlug?: string | string[]
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
        switch (pageType) {
          case PAGE_TYPE_NOTION_SINGLE_PAGE: {
            if (!isValidPageName(pageName)) {
              log({
                category: pageType,
                message: `invalid page | pageName: ${pageName}`,
                level: 'warn',
              })
              return notFound()
            }
            const response = await fetchSinglePage({
              pageName,
              category: pageType,
            })
            const pageContent = await transformSinglePage(response)

            return { pageContent }
          }

          case PAGE_TYPE_NOTION_ARTICLE_LIST_PAGE: {
            if (!isValidPageName(pageName)) {
              log({
                category: pageType,
                message: `invalid page | pageName: ${pageName}`,
                level: 'warn',
              })
              return notFound()
            }
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

          case PAGE_TYPE_NOTION_ARTICLE_DETAIL_PAGE: {
            if (!isValidPageName(pageName) || !isValidPageSlug(pageSlug)) {
              log({
                category: pageType,
                message: `invalid page | pageName: ${pageName} | pageSlug: ${pageSlug}`,
                level: 'warn',
              })
              return notFound()
            }

            const { pageId: articleId } = extractSinglePagePath(pageSlug)

            // fetch all article stream to build menu
            const response = await fetchArticleStream({
              pageName,
              category: pageType,
            })
            let articleStream = await transformArticleStream(pageName, response)
            articleStream = await transformArticleStreamPreviewImages(
              articleStream
            )

            // validate if article uuid exist in the article stream to prevent being an SSRF proxy host for external uuids.
            const articleIds = articleStream?.ids || []
            if (!articleIds.includes(idToUuid(articleId))) {
              log({
                category: pageType,
                message: `[malformed] detect external abusive article uuid | pageName: ${pageName} | pageSlug: ${pageSlug}`,
                level: 'warn',
              })
              return notFound()
            }

            // since getPage for collection view returns all pages with partial blocks, get target article then merge to articleStream to add missing blocks
            const singleArticleResponse = await fetchArticleStream({
              pageId: articleId,
              category: PAGE_TYPE_NOTION_ARTICLE_DETAIL_PAGE,
            })
            let singleArticle = await transformSingleArticle(
              singleArticleResponse
            )
            singleArticle = await transformArticleStreamPreviewImages(
              singleArticle
            )
            articleStream = merge(articleStream, singleArticle)

            const pageId = idToUuid(articleId)
            const pageContent = articleStream?.content
            const menuItems = transformMenuItems(pageName, articleStream)
            const toc = transformTableOfContent(articleStream, articleId)

            return { menuItems, pageContent, pageId, toc }
          }

          default: {
            const message = pageSlug
              ? `invalid pageType | pageType: ${pageType} | pageSlug: ${pageSlug}`
              : `invalid pageType | pageType: ${pageType}`

            throw Error(message)
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
