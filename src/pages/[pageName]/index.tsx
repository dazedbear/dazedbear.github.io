import { GetServerSideProps } from 'next'
import Error from 'next/error'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import VisibilitySensor from 'react-visibility-sensor'
import { ExtendedRecordMap } from 'notion-types'
import { NotionRenderer } from 'react-notion-x'
import { FaCircleNotch, FaRedo } from 'react-icons/fa'

import Breadcrumb from '../../components/breadcrumb'
import NavMenu from '../../components/nav-menu'
import Placeholder from '../../components/placeholder'
import NotionComponentMap from '../../components/notion-components'
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
  setSSRCacheHeaders,
} from '../../libs/server/page'
import {
  transformArticleStream,
  transformArticleStreamPreviewImages,
  transformMenuItems,
  transformStreamActionPayload,
} from '../../libs/server/transformer'
import { logOption } from '../../../types'

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async ({ params, query, req, res }) => {
    const pageName = params.pageName as string
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
          setSSRCacheHeaders(res)
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
      (duration) => {
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
  })

const ArticleListPage = ({ hasError, menuItems, pageName }) => {
  const streamState = useAppSelector((state) => state.stream)
  const dispatch = useAppDispatch()

  if (hasError) {
    return <Error statusCode={500} title="This page is broken" />
  }

  const blockId: string = get(notion, ['pages', pageName, 'collectionViewId'])
  const count: number = get(notion, ['pagination', 'batchLoadCount'])
  const content: any = get(streamState, [pageName, 'content'])
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
        <div className="m-0 block w-full rounded-md bg-gray-200 py-4 text-center">
          <p className="inline-block text-center text-sm text-gray-700">
            文章讀取中...
            <span className="ml-2 inline-block w-4 animate-spin text-center">
              <FaCircleNotch />
            </span>
          </p>
        </div>
      )
    }

    if (error) {
      return (
        <button
          className="m-0 block w-full rounded-md bg-gray-200 py-4 text-center"
          onClick={() => dispatch(fetchStreamPosts({ index, count, pageName }))}
        >
          <p className="inline-block text-center text-sm text-gray-700">
            文章讀取發生了問題. 請點此再試一次.
            <span className="ml-2 inline-block w-4 text-center">
              <FaRedo />
            </span>
          </p>
        </button>
      )
    }

    if (hasNext) {
      const handlePaginationFetch = (isVisible) => {
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
      className="mx-auto my-0 flex max-w-1100 flex-grow flex-row flex-nowrap px-5 py-0 pt-24 lg:pt-12"
    >
      <Breadcrumb title={get(notion, ['pages', pageName, 'navMenuTitle'])} />
      <NavMenu
        title={get(notion, ['pages', pageName, 'navMenuTitle'])}
        menuItems={menuItems}
      />
      <NotionRenderer
        blockId={blockId}
        className="overflow-y-scroll lg:max-h-full-viewport"
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
