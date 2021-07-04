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
import wrapper from '../libs/client/store'
import { updateStream } from '../libs/client/slices/stream'
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
import { useRemoveLinks } from '../libs/client/hooks'
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
          if (isEmpty(recordMap) || !get(postsData, ['result', 'total'])) {
            log({
              category: PAGE_TYPE_LIST_PAGE,
              message: `empty page data: is recordMap empty = ${isEmpty(
                recordMap
              )}, collection result total = ${get(postsData, [
                'result',
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
          const postIds = get(postsData, ['result', 'blockIds'])
          const action = updateStream({
            name: pageName,
            data: {
              content: cloneDeep(recordMap),
              ids: postIds,
              index: postIds.length - 1,
              total: get(postsData, ['result', 'total']),
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
              const postIds = get(data, ['result', 'blockIds'])
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

  switch (props.pageType) {
    case PAGE_TYPE_LIST_PAGE: {
      const { menuItems, notionPath, recordMap } = props
      const [pageName] = notionPath
      const components = Object.assign({}, NotionDefaultComponentMap, {
        pageLink: props => (
          <Link {...props}>
            <a {...props} />
          </Link>
        ),
      })

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
