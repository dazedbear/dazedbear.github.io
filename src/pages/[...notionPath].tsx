import { GetServerSideProps } from 'next'
import Link from 'next/link'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import {
  NotionRenderer,
  Code,
  Collection,
  CollectionRow,
  Pdf,
  Equation,
  Modal,
} from 'react-notion-x'
import { getBlockTitle, idToUuid, getPageTableOfContents } from 'notion-utils'
import VisibilitySensor from 'react-visibility-sensor'
import wrapper from '../libs/client/store'
import { updateStream, fetchStreamPosts } from '../libs/client/slices/stream'
import {
  getNotionPostsFromTable,
  getNotionPage,
  getNotionPreviewImages,
} from '../libs/server/notion'
import { notion } from '../../site.config'
import {
  getPageProperty,
  getDateStr,
  getSinglePagePath,
  extractSinglePagePath,
} from '../libs/client/blog-helpers'
import Breadcrumb from '../components/breadcrumb'
import NavMenu from '../components/nav-menu'
import TableOfContent from '../components/toc'
import NotionPageHeader from '../components/notion-page-header'
import NotionPageFooter from '../components/notion-page-footer'
import Placeholder from '../components/placeholder'
import {
  useRemoveLinks,
  useAppSelector,
  useAppDispatch,
} from '../libs/client/hooks'
import log from '../libs/server/log'

const PAGE_TYPE_LIST_PAGE = 'listPage'
const PAGE_TYPE_SINGLE_PAGE = 'singlePage'

const NotionDefaultComponentMap: any = {
  code: Code,
  collection: Collection,
  collectionRow: CollectionRow,
  equation: Equation,
  modal: Modal,
  pageLink: () => null,
  pdf: Pdf,
  tweet: () => null,
}

// function to update the page link urls
const NotionMapPageUrl: any = (pageName = '', recordMap = {}, pageId = '') => {
  const pagePath = getSinglePagePath({ pageName, pageId, recordMap })
  return `/${pageName}/${pagePath}`
}

const showNotFoundPage = (req, notionPath): any => {
  const message = `redirect to 404 page | notionPath: /${
    Array.isArray(notionPath) ? notionPath.join('/') : notionPath
  }`
  log({ category: 'page', message, level: 'warn', req })
  return {
    notFound: true,
  }
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  store => async ({ params: { notionPath }, req }) => {
    let pageType
    if (notionPath.length === 1) {
      pageType = PAGE_TYPE_LIST_PAGE
    } else if (notionPath.length === 2) {
      pageType = PAGE_TYPE_SINGLE_PAGE
    }

    switch (pageType) {
      case PAGE_TYPE_LIST_PAGE: {
        const [pageName] = notionPath
        const pageId = get(notion, ['pages', pageName, 'pageId'])
        const collectionViewId = get(notion, [
          'pages',
          pageName,
          'collectionViewId',
        ])
        const pageEnabled = get(notion, ['pages', pageName, 'enabled'])
        const paginationEnabled = get(notion, ['pagination', 'enabled'])
        // 404 when pageName is invalid
        if (!pageId || !collectionViewId || !pageEnabled) {
          log({
            category: PAGE_TYPE_LIST_PAGE,
            message: `required info are invalid: pageId = ${pageId}, collectionViewId = ${collectionViewId}, pageEnabled = ${pageEnabled}`,
            level: 'error',
            req,
          })
          return showNotFoundPage(req, notionPath)
        }
        try {
          const postsData = await getNotionPostsFromTable({
            pageId,
            collectionViewId,
            paginationEnabled,
            fetchAllPosts: true,
          })
          const recordMap = postsData.recordMap
          // 404 when data not found
          if (
            isEmpty(recordMap) ||
            !get(postsData, [
              'result',
              'reducerResults',
              'collection_group_results',
              'total',
            ])
          ) {
            log({
              category: PAGE_TYPE_LIST_PAGE,
              message: `empty page data: is recordMap empty = ${isEmpty(
                recordMap
              )}, collection result total = ${get(postsData, [
                'result',
                'reducerResults',
                'collection_group_results',
                'total',
              ])}`,
              level: 'error',
              req,
            })
            return showNotFoundPage(req, notionPath)
          }
          const menuItems = get(postsData, [
            'allPosts',
            'result',
            'reducerResults',
            'collection_group_results',
            'blockIds',
          ]).map(postId => {
            const recordMap = get(postsData, ['allPosts', 'recordMap'])
            const pagePath = getSinglePagePath({
              pageName,
              pageId: postId,
              recordMap,
            })
            const url = `/${pageName}/${pagePath}`
            const block = get(recordMap, ['block', postId, 'value'])
            const label = getBlockTitle(block, recordMap)
            return {
              label,
              url,
            }
          })

          if (get(notion, ['previeImages', 'enable'])) {
            // we only parse the cover preview images from the recordMap of collection data to prevent duplicated parsing from blog/[slug]
            const previewImageMap = await getNotionPreviewImages(recordMap)
            recordMap['preview_images'] = previewImageMap
          }

          // save SSR fetch stream article contents to redux store
          const postIds = get(postsData, [
            'result',
            'reducerResults',
            'collection_group_results',
            'blockIds',
          ])
          const total = get(postsData, [
            'result',
            'reducerResults',
            'collection_group_results',
            'total',
          ])
          const hasNext = paginationEnabled && postIds.length < total
          const action = updateStream({
            name: pageName,
            data: {
              content: cloneDeep(recordMap),
              hasNext,
              ids: postIds,
              index: postIds.length - 1,
              total,
            },
          })
          store.dispatch(action)
          log({
            category: 'page',
            message: `dumpaccess to notionPath: ${
              Array.isArray(notionPath) ? notionPath.join('/') : notionPath
            }`,
            level: 'info',
            req,
          })
          return {
            props: {
              menuItems,
              notionPath,
              pageType,
              recordMap,
            },
          }
        } catch (err) {
          log({
            category: PAGE_TYPE_LIST_PAGE,
            message: err,
            level: 'error',
            req,
          })
          return showNotFoundPage(req, notionPath)
        }
      }
      case PAGE_TYPE_SINGLE_PAGE: {
        const [pageName, pagePath] = notionPath
        const { pageId: postId, slug } = extractSinglePagePath(pagePath)
        const listPageId = get(notion, ['pages', pageName, 'pageId'])
        const listCollectionViewId = get(notion, [
          'pages',
          pageName,
          'collectionViewId',
        ])
        const listPageEnabled = get(notion, ['pages', pageName, 'enabled'])
        // 404 when pageName, pageId is invalid
        if (
          !listPageId ||
          !listCollectionViewId ||
          !postId ||
          !listPageEnabled
        ) {
          log({
            category: PAGE_TYPE_SINGLE_PAGE,
            message: `required info are invalid: listPageId = ${listPageId}, listCollectionViewId = ${listCollectionViewId}, listPageEnabled = ${listPageEnabled}, postId = ${postId}`,
            level: 'error',
            req,
          })
          return showNotFoundPage(req, notionPath)
        }
        try {
          const currentPostId = idToUuid(postId)
          const recordMap = await getNotionPage(currentPostId)
          // 404 when data not found
          if (isEmpty(recordMap)) {
            log({
              category: PAGE_TYPE_SINGLE_PAGE,
              message: `empty page data: is recordMap empty = ${isEmpty(
                recordMap
              )}`,
              level: 'error',
              req,
            })
            return showNotFoundPage(req, notionPath)
          }
          const toc = getPageTableOfContents(
            get(recordMap, ['block', currentPostId, 'value']),
            recordMap
          )

          if (get(notion, ['previeImages', 'enable'])) {
            const previewImageMap = await getNotionPreviewImages(recordMap)
            recordMap['preview_images'] = previewImageMap
          }

          const menuItems = await getNotionPostsFromTable(
            {
              pageId: listPageId,
              collectionViewId: listCollectionViewId,
              paginationEnabled: false,
              fetchAllPosts: false,
            },
            data => {
              const postIds = get(data, [
                'result',
                'reducerResults',
                'collection_group_results',
                'blockIds',
              ])
              return postIds.map(postId => {
                const postPath = getSinglePagePath({
                  pageName,
                  pageId: postId,
                  recordMap: data.recordMap,
                })
                const url = `/${pageName}/${postPath}`
                const block = get(data, ['recordMap', 'block', postId, 'value'])
                const label = getBlockTitle(block, data.recordMap)
                return {
                  label,
                  url,
                }
              })
            }
          )

          log({
            category: 'page',
            message: `dumpaccess to notionPath: ${
              Array.isArray(notionPath) ? notionPath.join('/') : notionPath
            }`,
            level: 'info',
            req,
          })
          return {
            props: {
              menuItems,
              notionPath,
              pageId: currentPostId,
              pageType,
              recordMap,
              toc,
            },
          }
        } catch (err) {
          log({
            category: PAGE_TYPE_SINGLE_PAGE,
            message: err,
            level: 'error',
            req,
          })
          return showNotFoundPage(req, notionPath)
        }
      }
      default: {
        log({
          category: 'page',
          message: `unknown pageType: ${pageType}`,
          level: 'error',
          req,
        })
        return showNotFoundPage(req, notionPath)
      }
    }
  }
)

const NotionPage = props => {
  // disable links from notion table.
  useRemoveLinks({
    selector: '.notion-table a.notion-page-link',
    condition: () => props.pageType === PAGE_TYPE_SINGLE_PAGE,
  })

  const streamState = useAppSelector(state => state.stream)
  const dispatch = useAppDispatch()

  switch (props.pageType) {
    case PAGE_TYPE_LIST_PAGE: {
      const { menuItems, notionPath } = props
      const [pageName] = notionPath
      const components = Object.assign({}, NotionDefaultComponentMap, {
        pageLink: props => (
          <Link {...props}>
            <a {...props} />
          </Link>
        ),
      })

      const count = get(notion, ['pagination', 'batchLoadCount'])
      const content = get(streamState, [pageName, 'content'])
      const error = get(streamState, [pageName, 'error'])
      const hasNext = get(streamState, [pageName, 'hasNext'])
      const index = get(streamState, [pageName, 'index'], 0)
      const isLoading = get(streamState, [pageName, 'isLoading'])

      // hack to temporarily fix "cannot assign type to read-only object" issue in react-notion-x
      const recordMap = cloneDeep(content)

      const getPageFooter = () => {
        if (!get(notion, ['pagination', 'enabled'])) {
          return null
        }

        if (error) {
          return isLoading ? (
            <div className="text-center w-full block m-0 py-4 rounded-md bg-gray-200">
              <p className="text-gray-700 text-sm text-center inline-block">
                文章讀取中...
                <span className="w-4 ml-2 text-center inline-block animate-spin">
                  <i className="fas fa-circle-notch"></i>
                </span>
              </p>
            </div>
          ) : (
            <button
              className="text-center w-full block m-0 py-4 rounded-md bg-gray-200"
              onClick={() =>
                dispatch(fetchStreamPosts({ index, count, pageName }))
              }
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
          <Breadcrumb
            title={get(notion, ['pages', pageName, 'navMenuTitle'])}
          />
          <NavMenu
            title={get(notion, ['pages', pageName, 'navMenuTitle'])}
            menuItems={menuItems}
          />
          <NotionRenderer
            fullPage={false}
            recordMap={recordMap}
            components={components}
            mapPageUrl={NotionMapPageUrl.bind(this, pageName, recordMap)}
            previewImages={get(notion, ['previeImages', 'enable'])}
            pageFooter={getPageFooter()}
            showCollectionViewDropdown={false}
          />
        </div>
      )
    }
    case PAGE_TYPE_SINGLE_PAGE: {
      const { pageId, recordMap, menuItems = [], notionPath, toc = [] } = props
      const [pageName, pagePath] = notionPath
      const property: any = getPageProperty({ pageId, recordMap })
      const enableToc = toc && toc.length > 0
      const components = Object.assign({}, NotionDefaultComponentMap, {
        pageLink: props => (
          <Link {...props}>
            <a {...props} />
          </Link>
        ),
        collectionRow: () => null, // we don't render property table for each articles
      })

      const pageHeader = (
        <NotionPageHeader
          title={property.PageTitle}
          publishDate={getDateStr(
            get(property, ['Publish Date', 'start_date'])
          )}
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
            components={components}
            className="pt-20 lg:pt-10 overflow-y-scroll lg:max-h-full-viewport lg:w-3-cols-center"
            recordMap={recordMap}
            fullPage={false}
            darkMode={false}
            mapPageUrl={NotionMapPageUrl.bind(this, pageName, recordMap)}
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
    default: {
      return null
    }
  }
}

export default NotionPage
