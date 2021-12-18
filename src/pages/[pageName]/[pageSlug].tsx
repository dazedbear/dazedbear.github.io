import { GetServerSideProps } from 'next'
import Link from 'next/link'
import Error from 'next/error'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import { SearchResults } from 'notion-types'
import { getBlockTitle, idToUuid, getPageTableOfContents } from 'notion-utils'
import {
  Code,
  Collection,
  Equation,
  Modal,
  NotionRenderer,
} from 'react-notion-x'

import {
  NotionPageName,
  ExtendSearchResults,
  logOption,
  ExtendRecordMap,
  MenuItem,
  GetServerSidePropsRequest,
} from '../../../types'
import { notion } from '../../../site.config'
import { PAGE_TYPE_ARTICLE_SINGLE_PAGE } from '../../libs/constant'
import {
  extractSinglePagePath,
  getSinglePagePath,
  getPageProperty,
} from '../../libs/notion'
import {
  getNotionPage,
  getNotionPostsFromTable,
} from '../../libs/server/notion'
import log from '../../libs/server/log'
import { showCommonPage } from '../../libs/server/page'
import { getDateStr } from '../../libs/util'
import { useRemoveLinks } from '../../libs/client/hooks'
import wrapper from '../../libs/client/store'
import { updateStream } from '../../libs/client/slices/stream'

import Breadcrumb from '../../components/breadcrumb'
import NavMenu from '../../components/nav-menu'
import TableOfContent from '../../components/toc'
import NotionPageHeader from '../../components/notion-page-header'
import NotionPageFooter from '../../components/notion-page-footer'

const isValidPageName = (pageName: NotionPageName): boolean => {
  const pageId: string = get(notion, ['pages', pageName, 'pageId'])
  const pageEnabled: boolean = get(notion, ['pages', pageName, 'enabled'])
  return pageId && pageEnabled
}

const isValidPageSlug = (pageSlug: string | string[]): boolean => {
  const regex: RegExp = /[a-zA-Z0-9%-]+\-[a-zA-Z0-9]{12}/gi
  return typeof pageSlug === 'string' && regex.test(pageSlug)
}

/**
 * Single article
 */
const isValidSingleArticleResponse = (response: ExtendRecordMap): boolean => {
  return !isEmpty(response)
}

const fetchSingleArticle = async (
  req: GetServerSidePropsRequest,
  pageName: NotionPageName,
  pageSlug: string | string[],
  articleId: string
) => {
  const listPageId = get(notion, ['pages', pageName, 'pageId'])
  const listCollectionViewId = get(notion, [
    'pages',
    pageName,
    'collectionViewId',
  ])
  const listPageEnabled = get(notion, ['pages', pageName, 'enabled'])

  if (!listPageId || !listCollectionViewId || !articleId || !listPageEnabled) {
    const options: logOption = {
      category: PAGE_TYPE_ARTICLE_SINGLE_PAGE,
      message: `required info are invalid: listPageId = ${listPageId}, listCollectionViewId = ${listCollectionViewId}, listPageEnabled = ${listPageEnabled}, articleId = ${articleId}`,
      level: 'error',
      req,
    }
    log(options)
    throw 'required info are invalid'
  }

  const response = await getNotionPage(idToUuid(articleId))

  if (!isValidSingleArticleResponse(response)) {
    const options: logOption = {
      category: PAGE_TYPE_ARTICLE_SINGLE_PAGE,
      message: `Invalid response in fetchSingleArticle | is recordMap empty: ${isEmpty(
        response
      )} | pageName: ${pageName} | pageSlug: ${pageSlug} | articleId: ${articleId}`,
      level: 'error',
      req,
    }
    log(options)
    throw 'Invalid response in fetchSingleArticle.'
  }
  return response
}

/**
 * All article
 */
const isValidAllArticlesResponse = (
  response: SearchResults | ExtendSearchResults
): boolean => {
  return (
    !isEmpty(response?.recordMap) &&
    get(response, [
      'result',
      'reducerResults',
      'collection_group_results',
      'total',
    ])
  )
}

const fetchAllArticles = async (
  req: GetServerSidePropsRequest,
  pageName: NotionPageName
): Promise<SearchResults | ExtendSearchResults> => {
  const pageId: string = get(notion, ['pages', pageName, 'pageId'])
  const collectionViewId: string = get(notion, [
    'pages',
    pageName,
    'collectionViewId',
  ])
  const pageEnabled: boolean = get(notion, ['pages', pageName, 'enabled'])
  const paginationEnabled: boolean = get(notion, ['pagination', 'enabled'])

  if (!pageId || !collectionViewId || !pageEnabled) {
    const options: logOption = {
      category: PAGE_TYPE_ARTICLE_SINGLE_PAGE,
      message: `required info are invalid: pageId = ${pageId}, collectionViewId = ${collectionViewId}, pageEnabled = ${pageEnabled}`,
      level: 'error',
      req,
    }
    log(options)
    throw 'Required info are invalid in fetchArticles.'
  }

  const response: SearchResults = await getNotionPostsFromTable({
    pageId,
    collectionViewId,
    paginationEnabled,
    fetchAllPosts: true,
  })

  if (!isValidAllArticlesResponse(response)) {
    const isEmptyRecordMap = isEmpty(response?.recordMap)
    const totalCount = get(response, [
      'result',
      'reducerResults',
      'collection_group_results',
      'total',
    ])
    const options: logOption = {
      category: PAGE_TYPE_ARTICLE_SINGLE_PAGE,
      message: `invalid response in fetchArticles: is recordMap empty = ${isEmptyRecordMap}, collection result total = ${totalCount}`,
      level: 'error',
      req,
    }
    log(options)
    throw 'Invalid response in fetchArticles.'
  }
  return response
}

/**
 * Transformer
 */
const transformMenuItems = (
  pageName: NotionPageName,
  articles: ExtendSearchResults
): MenuItem[] => {
  const articleIds: string[] = get(
    articles,
    [
      'allPosts',
      'result',
      'reducerResults',
      'collection_group_results',
      'blockIds',
    ],
    []
  )
  const recordMap: ExtendRecordMap = get(articles, ['allPosts', 'recordMap'])
  const menuItems: MenuItem[] = articleIds.map(pageId => {
    const pagePath = getSinglePagePath({
      pageName,
      pageId,
      recordMap,
    })
    const url = `/${pageName}/${pagePath}`
    const block = get(recordMap, ['block', pageId, 'value'])
    const label = getBlockTitle(block, recordMap as any)
    return {
      label,
      url,
    }
  })
  return menuItems
}

const transformTableOfContent = (data: ExtendRecordMap, articleId: string) => {
  const currentPostId = idToUuid(articleId)
  return getPageTableOfContents(
    get(data, ['block', currentPostId, 'value']),
    data as any
  )
}

const transformSingleArticle = (data: ExtendRecordMap): ExtendRecordMap => {
  // we use the recordMap directly.
  return data
}

const transformStreamActionPayload = (
  pageName: NotionPageName,
  allArticles: ExtendSearchResults
) => {
  const paginationEnabled: boolean = get(notion, ['pagination', 'enabled'])
  const articleIds: string[] = get(allArticles, [
    'result',
    'reducerResults',
    'collection_group_results',
    'blockIds',
  ])
  const total: number = get(allArticles, [
    'result',
    'reducerResults',
    'collection_group_results',
    'total',
  ])
  const hasNext: boolean = paginationEnabled && articleIds.length < total

  return {
    name: pageName as string,
    data: {
      content: cloneDeep(allArticles?.recordMap),
      hasNext,
      ids: articleIds,
      index: articleIds.length - 1,
      total,
    },
  }
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  store => async ({ params: { pageName, pageSlug }, req, res }) => {
    if (!isValidPageName(pageName) || !isValidPageSlug(pageSlug)) {
      const options = {
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
      const singleArticleResponse = await fetchSingleArticle(
        req,
        pageName,
        pageSlug,
        articleId
      )
      const singleArticle = transformSingleArticle(singleArticleResponse)
      const toc = transformTableOfContent(singleArticle, articleId)

      const allArticlesResponse = await fetchAllArticles(req, pageName)
      const menuItems = transformMenuItems(pageName, allArticlesResponse)

      // save SSR fetch stream article contents to redux store
      const payload = transformStreamActionPayload(
        pageName,
        allArticlesResponse
      )
      const action = updateStream(payload)
      store.dispatch(action)

      const options: logOption = {
        category: 'page',
        message: `dumpaccess to /${pageName}`,
        level: 'info',
        req,
      }
      log(options)
      return {
        props: {
          menuItems,
          pageId: idToUuid(articleId),
          pageName,
          singleArticle,
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

// function to update the page link urls
const NotionMapPageUrl = (
  pageName: NotionPageName = '',
  recordMap: ExtendRecordMap,
  pageId: string = ''
): string => {
  const pagePath = getSinglePagePath({ pageName, pageId, recordMap })
  return `/${pageName}/${pagePath}`
}

const ArticleSinglePage = ({
  hasError,
  menuItems = [],
  pageId,
  pageName,
  singleArticle,
  toc,
}) => {
  // TODO: read single article from redux state
  // disable links from notion table.
  useRemoveLinks({
    selector: '.notion-table a.notion-page-link',
    condition: () => true,
  })

  if (hasError) {
    return <Error statusCode={500} title="This page is broken" />
  }

  const property: any = getPageProperty({ pageId, recordMap: singleArticle })
  const enableToc = toc && toc.length > 0

  const pageHeader = (
    <NotionPageHeader
      title={property.PageTitle}
      publishDate={getDateStr(get(property, ['Publish Date', 'start_date']))}
      lastEditedDate={getDateStr(property.LastEditedTime)}
      cover={property.PageCover}
      recordMap={singleArticle}
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
        components={NotionComponentMap}
        className="pt-20 lg:pt-10 overflow-y-scroll lg:max-h-full-viewport lg:w-3-cols-center"
        recordMap={singleArticle}
        fullPage={false}
        darkMode={false}
        mapPageUrl={NotionMapPageUrl.bind(this, pageName, singleArticle)}
        pageHeader={pageHeader}
        pageFooter={pageFooter}
        previewImages={get(notion, ['previeImages', 'enable'])}
        showTableOfContents={false}
        showCollectionViewDropdown={false}
      />
      <TableOfContent toc={toc} />
    </div>
  )
}

export default ArticleSinglePage
