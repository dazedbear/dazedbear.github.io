import { GetServerSideProps } from 'next'
import Link from 'next/link'
import Error from 'next/error'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import { ExtendedRecordMap } from 'notion-types'
import { idToUuid } from 'notion-utils'
import {
  Code,
  Collection,
  Equation,
  Modal,
  NotionRenderer,
} from 'react-notion-x'

import { logOption } from '../../../types'
import { notion } from '../../../site.config'
import { PAGE_TYPE_ARTICLE_SINGLE_PAGE } from '../../libs/constant'
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
} from '../../libs/server/page'
import {
  transformArticleStream,
  transformSingleArticle,
  transformMenuItems,
  transformStreamActionPayload,
  transformTableOfContent,
} from '../../libs/server/transformer'
import Breadcrumb from '../../components/breadcrumb'
import NavMenu from '../../components/nav-menu'
import TableOfContent from '../../components/toc'
import NotionPageHeader from '../../components/notion-page-header'
import NotionPageFooter from '../../components/notion-page-footer'

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  store => async ({ params: { pageName, pageSlug }, req, res }) => {
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
      const response = await fetchArticleStream({
        req,
        pageName,
        category: PAGE_TYPE_ARTICLE_SINGLE_PAGE,
      })
      articleStream = await transformArticleStream(pageName, response)

      // since getPage for collection view returns all pages with partial blocks, getPage target article then merge to articleStream to add missing blocks
      const singleArticleResponse = await fetchArticleStream({
        req,
        pageId: articleId,
        category: PAGE_TYPE_ARTICLE_SINGLE_PAGE,
      })
      const singleArticle = await transformSingleArticle(singleArticleResponse)
      articleStream = merge(articleStream, singleArticle)

      const menuItems = transformMenuItems(pageName, articleStream)
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
      return {
        props: {
          menuItems,
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
  }
)

const NotionComponentMap: object = {
  code: Code,
  collection: Collection,
  collectionRow: () => null, // we don't render property table for each articles
  equation: Equation,
  modal: Modal,
  pageLink: props => (
    <Link {...props}>
      <a {...props} />
    </Link>
  ),
  tweet: () => null,
}

const ArticleSinglePage = ({
  hasError,
  menuItems = [],
  pageId,
  pageName,
  toc,
}) => {
  const streamState = useAppSelector(state => state.stream)

  // disable links from notion table.
  useRemoveLinks({
    selector: '.notion-table a.notion-page-link',
    condition: () => true,
  })

  if (hasError) {
    return <Error statusCode={500} title="This page is broken" />
  }

  const content: ExtendedRecordMap = get(streamState, [pageName, 'content'])
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
      className="pt-24 lg:pt-12 flex flex-row flex-grow flex-nowrap justify-center max-w-1400 py-0 px-5 my-0 mx-auto"
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
        className="pt-20 lg:pt-10 overflow-y-scroll lg:max-h-full-viewport lg:w-3-cols-center"
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
