import { GetServerSideProps } from 'next'
import Link from 'next/link'
import Error from 'next/error'
import get from 'lodash/get'
import set from 'lodash/set'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import VisibilitySensor from 'react-visibility-sensor'
import { SearchResults } from 'notion-types'
import { getBlockTitle } from 'notion-utils'
import {
  Code,
  Collection,
  CollectionRow,
  Equation,
  Modal,
  NotionRenderer,
} from 'react-notion-x'

import Breadcrumb from '../../components/breadcrumb'
import NavMenu from '../../components/nav-menu'
import Placeholder from '../../components/placeholder'
import { notion } from '../../../site.config'
import { PAGE_TYPE_ARTICLE_LIST_PAGE } from '../../libs/constant'
import log from '../../libs/server/log'
import {
  getNotionPostsFromTable,
  getNotionPreviewImages,
} from '../../libs/server/notion'
import wrapper from '../../libs/client/store'
import { updateStream, fetchStreamPosts } from '../../libs/client/slices/stream'
import { useAppSelector, useAppDispatch } from '../../libs/client/hooks'
import { getSinglePagePath } from '../../libs/notion'
import { showCommonPage } from '../../libs/server/page'
import {
  NotionPageName,
  ExtendSearchResults,
  logOption,
  PreviewImagesMap,
  ExtendRecordMap,
  MenuItem,
  GetServerSidePropsRequest,
} from '../../../types'

const isValidPageName = (pageName: NotionPageName): boolean => {
  const pageId: string = get(notion, ['pages', pageName, 'pageId'])
  const pageEnabled: boolean = get(notion, ['pages', pageName, 'enabled'])
  return pageId && pageEnabled
}

const isValidResponse = (
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

const isValidArticles = (articles: ExtendSearchResults): boolean => {
  // we pass the raw object from API to renderer for now.
  return isValidResponse(articles)
}

const fetchArticles = async (
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
      category: PAGE_TYPE_ARTICLE_LIST_PAGE,
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

  if (!isValidResponse(response)) {
    const isEmptyRecordMap = isEmpty(response?.recordMap)
    const totalCount = get(response, [
      'result',
      'reducerResults',
      'collection_group_results',
      'total',
    ])
    const options: logOption = {
      category: PAGE_TYPE_ARTICLE_LIST_PAGE,
      message: `invalid response in fetchArticles: is recordMap empty = ${isEmptyRecordMap}, collection result total = ${totalCount}`,
      level: 'error',
      req,
    }
    log(options)
    throw 'Invalid response in fetchArticles.'
  }
  return response
}

const transformArticles = async (
  data: SearchResults
): Promise<ExtendSearchResults> => {
  const isPreviewImageGenerationEnabled: boolean = get(notion, [
    'previeImages',
    'enable',
  ])

  if (!isEmpty(data?.recordMap) && isPreviewImageGenerationEnabled) {
    // we only parse the cover preview images from the recordMap of collection data to prevent duplicated parsing from blog/[slug]
    const previewImageMap: PreviewImagesMap = await getNotionPreviewImages(
      data?.recordMap
    )
    set(data, ['recordMap', 'preview_images'], previewImageMap)
  }
  return data
}

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

const transformStreamActionPayload = (
  pageName: NotionPageName,
  articles: ExtendSearchResults
) => {
  const paginationEnabled: boolean = get(notion, ['pagination', 'enabled'])
  const articleIds: string[] = get(articles, [
    'result',
    'reducerResults',
    'collection_group_results',
    'blockIds',
  ])
  const total: number = get(articles, [
    'result',
    'reducerResults',
    'collection_group_results',
    'total',
  ])
  const hasNext: boolean = paginationEnabled && articleIds.length < total

  return {
    name: pageName as string,
    data: {
      content: cloneDeep(articles?.recordMap),
      hasNext,
      ids: articleIds,
      index: articleIds.length - 1,
      total,
    },
  }
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  store => async ({ params: { pageName }, req, res }) => {
    if (!isValidPageName(pageName)) {
      const options = {
        category: PAGE_TYPE_ARTICLE_LIST_PAGE,
        message: `invalid page | pageName: ${pageName}`,
        level: 'error',
        req,
      }
      log(options)
      return showCommonPage(req, res, 'notFound', pageName)
    }

    try {
      const response = await fetchArticles(req, pageName)
      const articles = await transformArticles(response)

      if (!isValidArticles(articles)) {
        const options: logOption = {
          category: PAGE_TYPE_ARTICLE_LIST_PAGE,
          message: `empty page data for pageName" ${pageName}`,
          level: 'error',
          req,
        }
        log(options)
        return showCommonPage(req, res, 'error', pageName)
      }

      const menuItems = transformMenuItems(pageName, articles)

      // save SSR fetch stream article contents to redux store
      const payload = transformStreamActionPayload(pageName, articles)
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
          pageName,
        },
      }
    } catch (err) {
      const options: logOption = {
        category: PAGE_TYPE_ARTICLE_LIST_PAGE,
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
  collectionRow: CollectionRow,
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

const ArticleListPage = ({ hasError, menuItems, pageName }) => {
  const streamState = useAppSelector(state => state.stream)
  const dispatch = useAppDispatch()

  if (hasError) {
    return <Error statusCode={500} title="This page is broken" />
  }

  const count: number = get(notion, ['pagination', 'batchLoadCount'])
  const content: ExtendRecordMap = get(streamState, [pageName, 'content'])
  const error: boolean = get(streamState, [pageName, 'error'])
  const hasNext: boolean = get(streamState, [pageName, 'hasNext'])
  const index: number = get(streamState, [pageName, 'index'], 0)
  const isLoading: boolean = get(streamState, [pageName, 'isLoading'])
  const paginationEnabled: boolean = get(notion, ['pagination', 'enabled'])
  const previewImagesEnabled: boolean = get(notion, ['previeImages', 'enable'])

  // hack to temporarily fix "cannot assign type to read-only object" issue in react-notion-x
  const recordMap = cloneDeep(content)
  const NotionPageFooter = () => {
    if (!paginationEnabled) {
      return null
    }

    if (isLoading) {
      return (
        <div className="text-center w-full block m-0 py-4 rounded-md bg-gray-200">
          <p className="text-gray-700 text-sm text-center inline-block">
            文章讀取中...
            <span className="w-4 ml-2 text-center inline-block animate-spin">
              <i className="fas fa-circle-notch"></i>
            </span>
          </p>
        </div>
      )
    }

    if (error) {
      return (
        <button
          className="text-center w-full block m-0 py-4 rounded-md bg-gray-200"
          onClick={() => dispatch(fetchStreamPosts({ index, count, pageName }))}
        >
          <p className="text-gray-700 text-sm text-center inline-block">
            文章讀取發生了問題. 請點此再試一次.
            <span className="w-4 ml-2 text-center inline-block">
              <i className="fas fa-redo"></i>
            </span>
          </p>
        </button>
      )
    }

    if (hasNext) {
      const handlePaginationFetch = isVisible => {
        if (isVisible && !isLoading) {
          dispatch(fetchStreamPosts({ index, count, pageName }))
        }
      }
      return (
        <VisibilitySensor
          key={`placeholder-${index}`}
          onChange={handlePaginationFetch}
          partialVisibility={true}
          minTopValue={250}
        >
          <Placeholder
            itemCount={count}
            wrapperClassNames="border-t border-gray-300"
          />
        </VisibilitySensor>
      )
    }
    return null
  }

  return (
    <div
      id="notion-list-page"
      data-namespace={pageName}
      className="pt-24 lg:pt-12 flex flex-row flex-grow flex-nowrap max-w-1100 py-0 px-5 my-0 mx-auto"
    >
      <Breadcrumb title={get(notion, ['pages', pageName, 'navMenuTitle'])} />
      <NavMenu
        title={get(notion, ['pages', pageName, 'navMenuTitle'])}
        menuItems={menuItems}
      />
      <NotionRenderer
        fullPage={false}
        recordMap={recordMap}
        components={NotionComponentMap}
        mapPageUrl={NotionMapPageUrl.bind(this, pageName, recordMap)}
        previewImages={previewImagesEnabled}
        pageFooter={NotionPageFooter()}
        showCollectionViewDropdown={false}
      />
    </div>
  )
}

export default ArticleListPage
