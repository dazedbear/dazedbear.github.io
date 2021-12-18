import { GetServerSideProps } from 'next'
import Link from 'next/link'
import Error from 'next/error'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import VisibilitySensor from 'react-visibility-sensor'
import { ExtendedRecordMap } from 'notion-types'
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
import { mapNotionPageLinkUrl } from '../../libs/notion'
import log from '../../libs/server/log'
import { getNotionPage } from '../../libs/server/notion'
import wrapper from '../../libs/client/store'
import { updateStream, fetchStreamPosts } from '../../libs/client/slices/stream'
import { useAppSelector, useAppDispatch } from '../../libs/client/hooks'
import { showCommonPage } from '../../libs/server/page'
import {
  transformArticleStream,
  transformMenuItems,
  transformStreamActionPayload,
} from '../../libs/server/transformer'
import {
  NotionPageName,
  logOption,
  GetServerSidePropsRequest,
} from '../../../types'

/**
 * validate input pageName
 * @param {string} pageName
 * @returns {boolean} pageName validation result
 */
const isValidPageName = (pageName: NotionPageName): boolean => {
  const pageId: string = get(notion, ['pages', pageName, 'pageId'])
  const pageEnabled: boolean = get(notion, ['pages', pageName, 'enabled'])
  return pageId && pageEnabled
}

/**
 * fetch article from upstream API
 * @param {object} req
 * @param {string} pageName
 * @returns {object} raw data from upstream API
 */
const fetchArticleStream = async (
  req: GetServerSidePropsRequest,
  pageName: NotionPageName
): Promise<ExtendedRecordMap> => {
  const pageId: string = get(notion, ['pages', pageName, 'pageId'])
  const collectionId: string = get(notion, ['pages', pageName, 'collectionId'])
  const collectionViewId: string = get(notion, [
    'pages',
    pageName,
    'collectionViewId',
  ])
  const pageEnabled: boolean = get(notion, ['pages', pageName, 'enabled'])

  if (!pageId || !collectionId || !collectionViewId || !pageEnabled) {
    const options: logOption = {
      category: PAGE_TYPE_ARTICLE_LIST_PAGE,
      message: `required info are invalid | pageId: ${pageId} | collectionId: ${collectionId} | collectionViewId: ${collectionViewId} | pageEnabled: ${pageEnabled}`,
      level: 'error',
      req,
    }
    log(options)
    throw 'Required info are invalid in fetchArticles.'
  }

  const response = await getNotionPage(pageId)
  return response
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  store => async ({ params: { pageName }, req, res }) => {
    if (!isValidPageName(pageName)) {
      const options: logOption = {
        category: PAGE_TYPE_ARTICLE_LIST_PAGE,
        message: `invalid page | pageName: ${pageName}`,
        level: 'error',
        req,
      }
      log(options)
      return showCommonPage(req, res, 'notFound', pageName)
    }

    try {
      const response = await fetchArticleStream(req, pageName)
      const articleStream = await transformArticleStream(pageName, response)
      const menuItems = transformMenuItems(pageName, articleStream)

      // save SSR fetch stream article contents to redux store
      const payload = transformStreamActionPayload(pageName, articleStream)
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

const ArticleListPage = ({ hasError, menuItems, pageName }) => {
  const streamState = useAppSelector(state => state.stream)
  const dispatch = useAppDispatch()

  if (hasError) {
    return <Error statusCode={500} title="This page is broken" />
  }

  const blockId: string = get(notion, ['pages', pageName, 'collectionViewId'])
  const count: number = get(notion, ['pagination', 'batchLoadCount'])
  const content: ExtendedRecordMap = get(streamState, [pageName, 'content'])
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
        blockId={blockId}
        fullPage={false}
        recordMap={recordMap}
        components={NotionComponentMap}
        mapPageUrl={mapNotionPageLinkUrl.bind(this, pageName, recordMap)}
        previewImages={previewImagesEnabled}
        pageFooter={NotionPageFooter()}
        showCollectionViewDropdown={false}
      />
    </div>
  )
}

export default ArticleListPage
