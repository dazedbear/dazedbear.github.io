import { GetServerSideProps } from 'next'
import Link from 'next/link'
import Error from 'next/error'
import dynamic from 'next/dynamic'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import VisibilitySensor from 'react-visibility-sensor'
import { ExtendedRecordMap } from 'notion-types'
import { Code, Collection, CollectionRow, NotionRenderer } from 'react-notion-x'

import Breadcrumb from '../../components/breadcrumb'
import NavMenu from '../../components/nav-menu'
import Placeholder from '../../components/placeholder'
import { notion, pageProcessTimeout } from '../../../site.config'
import {
  FAILSAFE_PAGE_GENERATION_QUERY,
  PAGE_TYPE_ARTICLE_LIST_PAGE,
} from '../../libs/constant'
import { mapNotionPageLinkUrl } from '../../libs/notion'
import log from '../../libs/server/log'
import wrapper from '../../libs/client/store'
import { updateStream, fetchStreamPosts } from '../../libs/client/slices/stream'
import { useAppSelector, useAppDispatch } from '../../libs/client/hooks'
import {
  showCommonPage,
  fetchArticleStream,
  isValidPageName,
  executeFunctionWithTimeout,
} from '../../libs/server/page'
import {
  transformArticleStream,
  transformArticleStreamPreviewImages,
  transformMenuItems,
  transformStreamActionPayload,
} from '../../libs/server/transformer'
import { logOption } from '../../../types'

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  store => async ({ params: { pageName }, query, req, res }) => {
    // disable page timeout when failsafe generation mode (?fsg=1)
    const timeout =
      query[FAILSAFE_PAGE_GENERATION_QUERY] === '1' ? 0 : pageProcessTimeout
    const props = await executeFunctionWithTimeout(
      async () => {
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
          const response = await fetchArticleStream({
            req,
            pageName,
            category: PAGE_TYPE_ARTICLE_LIST_PAGE,
          })
          let articleStream = await transformArticleStream(pageName, response)
          articleStream = await transformArticleStreamPreviewImages(
            articleStream
          )
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
      },
      timeout,
      duration => {
        const options: logOption = {
          category: PAGE_TYPE_ARTICLE_LIST_PAGE,
          message: `page processing timeout | duration: ${duration} ms`,
          level: 'warn',
          req,
        }
        log(options)
        return showCommonPage(req, res, 'error', pageName)
      },
      PAGE_TYPE_ARTICLE_LIST_PAGE
    )
    return props
  }
)

const NotionComponentMap: object = {
  code: Code,
  collection: Collection,
  collectionRow: CollectionRow,
  equation: () => null, // we don't have math equation in articles, so we don't need this
  modal: dynamic(() => import('react-notion-x').then(notion => notion.Modal), {
    ssr: false,
  }),
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
