// for Prism.js language highlight
import 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-markup-templating'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-css-extras'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
// prism-php has a dependency: prism-markup-templating.
// see: https://github.com/PrismJS/prism/issues/1400#issuecomment-485847919
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-php-extras'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-shell-session'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-vim'
import 'prismjs/components/prism-graphql'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-log'

import { GetServerSideProps } from 'next'
import Error from 'next/error'
import pAll from 'p-all'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import { ExtendedRecordMap } from 'notion-types'
import { idToUuid } from 'notion-utils'
import { NotionRenderer } from 'react-notion-x'

import { logOption } from '../../../types'
import { notion, pageProcessTimeout } from '../../../site.config'
import {
  FAILSAFE_PAGE_GENERATION_QUERY,
  PAGE_TYPE_ARTICLE_SINGLE_PAGE,
} from '../../libs/constant'
import {
  extractSinglePagePath,
  getPageProperty,
  mapNotionPageLinkUrl,
} from '../../libs/notion'
import { getDateStr } from '../../libs/util'
import { useAppSelector, useRemoveLinks } from '../../libs/client/hooks'
import wrapper from '../../libs/client/store'
import { updateStream } from '../../libs/client/slices/stream'
import log from '../../libs/server/log'
import {
  showCommonPage,
  fetchArticleStream,
  isValidPageSlug,
  isValidPageName,
  executeFunctionWithTimeout,
  setSSRCacheHeaders,
} from '../../libs/server/page'
import {
  transformArticleStream,
  transformArticleStreamPreviewImages,
  transformSingleArticle,
  transformArticleSinglePageMeta,
  transformMenuItems,
  transformStreamActionPayload,
  transformTableOfContent,
} from '../../libs/server/transformer'
import Breadcrumb from '../../components/breadcrumb'
import NavMenu from '../../components/nav-menu'
import TableOfContent from '../../components/toc'
import NotionPageHeader from '../../components/notion-page-header'
import NotionPageFooter from '../../components/notion-page-footer'
import NotionComponentMap from '../../components/notion-components'

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async ({ params, req, res, query }) => {
    const pageName = params.pageName as string
    const pageSlug = params.pageSlug
    // disable page timeout when failsafe generation mode (?fsg=1)
    const timeout =
      query[FAILSAFE_PAGE_GENERATION_QUERY] === '1' ? 0 : pageProcessTimeout
    const props = await executeFunctionWithTimeout(
      async () => {
        if (!isValidPageName(pageName) || !isValidPageSlug(pageSlug)) {
          const options: logOption = {
            category: PAGE_TYPE_ARTICLE_SINGLE_PAGE,
            message: `invalid page | pageName: ${pageName} | pageSlug: ${pageSlug}`,
            level: 'error',
            req,
          }
          log(options)
          return showCommonPage(req, res, 'notFound', pageName)
        }

        const { pageId: articleId } = extractSinglePagePath(pageSlug)

        try {
          let articleStream = {}
          let singleArticle = {}
          await pAll([
            async () => {
              const response = await fetchArticleStream({
                req,
                pageName,
                category: PAGE_TYPE_ARTICLE_SINGLE_PAGE,
              })
              articleStream = await transformArticleStream(pageName, response)
              articleStream = await transformArticleStreamPreviewImages(
                articleStream
              )
            },
            async () => {
              // since getPage for collection view returns all pages with partial blocks, getPage target article then merge to articleStream to add missing blocks
              const singleArticleResponse = await fetchArticleStream({
                req,
                pageId: articleId,
                category: PAGE_TYPE_ARTICLE_SINGLE_PAGE,
              })
              singleArticle = await transformSingleArticle(
                singleArticleResponse
              )
              singleArticle = await transformArticleStreamPreviewImages(
                singleArticle
              )
            },
          ])
          articleStream = merge(articleStream, singleArticle)

          const menuItems = transformMenuItems(pageName, articleStream)
          const meta = transformArticleSinglePageMeta(articleStream, articleId)
          const toc = transformTableOfContent(articleStream, articleId)

          // save SSR fetch stream article contents to redux store
          const payload = transformStreamActionPayload(pageName, articleStream)
          const action = updateStream(payload)
          store.dispatch(action)

          const options: logOption = {
            category: 'page',
            message: `dumpaccess to /${pageName}/${pageSlug}`,
            level: 'info',
            req,
          }
          log(options)
          setSSRCacheHeaders(res)
          return {
            props: {
              menuItems,
              meta,
              pageId: idToUuid(articleId),
              pageName,
              toc,
            },
          }
        } catch (err) {
          const options: logOption = {
            category: PAGE_TYPE_ARTICLE_SINGLE_PAGE,
            message: err,
            level: 'error',
            req,
          }
          log(options)
          return showCommonPage(req, res, 'error', pageName)
        }
      },
      timeout,
      (duration) => {
        const options: logOption = {
          category: PAGE_TYPE_ARTICLE_SINGLE_PAGE,
          message: `page processing timeout | duration: ${duration} ms`,
          level: 'warn',
          req,
        }
        log(options)
        return showCommonPage(req, res, 'error', pageName)
      },
      PAGE_TYPE_ARTICLE_SINGLE_PAGE
    )
    return props
  })

const ArticleSinglePage = ({
  hasError,
  menuItems = [],
  pageId,
  pageName,
  toc,
}) => {
  const streamState = useAppSelector((state) => state.stream)

  // disable links from notion table.
  useRemoveLinks({
    selector: '.notion-table a.notion-page-link',
    condition: () => true,
  })

  if (hasError) {
    return <Error statusCode={500} title="This page is broken" />
  }

  const content: any = get(streamState, [pageName, 'content'])
  // hack to temporarily fix "cannot assign type to read-only object" issue in react-notion-x
  const recordMap = cloneDeep(content)
  const previewImagesEnabled: boolean = get(notion, ['previeImages', 'enable'])
  const property: any = getPageProperty({ pageId, recordMap })
  const enableToc: boolean = toc && toc.length > 0

  const pageHeader = (
    <NotionPageHeader
      title={property.PageTitle}
      publishDate={getDateStr(get(property, ['Publish Date', 'start_date']))}
      lastEditedDate={getDateStr(property.LastEditedTime)}
      cover={property.PageCover}
      recordMap={recordMap}
    />
  )
  const pageFooter = <NotionPageFooter />

  return (
    <div
      id="notion-single-page"
      data-namespace={pageName}
      className="my-0 mx-auto flex max-w-1400 flex-grow flex-row flex-nowrap justify-center py-0 px-5 pt-24 lg:pt-12"
    >
      <Breadcrumb
        title={get(notion, ['pages', pageName, 'navMenuTitle'])}
        enableToc={enableToc}
      />
      <NavMenu
        title={get(notion, ['pages', pageName, 'navMenuTitle'])}
        menuItems={menuItems}
      />
      <NotionRenderer
        blockId={pageId}
        components={NotionComponentMap}
        className="overflow-y-scroll pt-20 lg:max-h-full-viewport lg:w-3-cols-center lg:pt-10"
        recordMap={recordMap}
        fullPage={false}
        darkMode={false}
        mapPageUrl={mapNotionPageLinkUrl.bind(this, pageName, recordMap)}
        pageHeader={pageHeader}
        pageFooter={pageFooter}
        previewImages={previewImagesEnabled}
        showTableOfContents={false}
        showCollectionViewDropdown={false}
      />
      <TableOfContent toc={toc} />
    </div>
  )
}

export default ArticleSinglePage
