import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import get from 'lodash/get'
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

const PAGE_TYPE_LIST_PAGE = 'listPage'
const PAGE_TYPE_SINGLE_PAGE = 'singlePage'

const isLocal = process.env.NODE_ENV === 'development'

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

export const getStaticPaths: GetStaticPaths = async () => {
  let paths = []
  for (let pageName in notion.pages) {
    if (!notion.pages.hasOwnProperty(pageName)) {
      continue
    }
    if (notion.pages[pageName]?.enable) {
      // collect path for list page like `/blog`
      paths.push({
        params: {
          notionPath: [pageName],
        },
      })

      // collect path for single page like `/blog/xxxxxxx`
      const pageId = get(notion, ['pages', pageName, 'pageId'])
      const collectionViewId = get(notion, [
        'pages',
        pageName,
        'collectionViewId',
      ])

      if (!pageId || !collectionViewId) {
        continue
      }
      const { recordMap, result } = await getNotionPostsFromTable({
        pageId,
        collectionViewId,
      })
      const postIds = result.blockIds.filter(Boolean)

      postIds.forEach(postId => {
        const pagePath = getSinglePagePath({
          pageId: postId,
          pageName,
          recordMap,
        })
        paths.push({
          params: { notionPath: [pageName, pagePath] },
        })
      })
    }
  }

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({
  params: { notionPath },
}) => {
  let pageType
  if (notionPath.length === 1) {
    pageType = PAGE_TYPE_LIST_PAGE
  } else if (notionPath.length === 2) {
    pageType = PAGE_TYPE_SINGLE_PAGE
  }

  switch (pageType) {
    case PAGE_TYPE_LIST_PAGE: {
      const [pageName] = notionPath
      const recordMap = await getNotionPage(
        get(notion, ['pages', pageName, 'pageId'])
      )
      const postsData = await getNotionPostsFromTable({
        pageId: get(notion, ['pages', pageName, 'pageId']),
        collectionViewId: get(notion, ['pages', pageName, 'collectionViewId']),
      })
      const menuItems = get(postsData, ['result', 'blockIds']).map(postId => {
        const pagePath = getSinglePagePath({
          pageName,
          pageId: postId,
          recordMap,
        })
        const url = `/${pageName}/${pagePath}`
        const block = get(postsData, ['recordMap', 'block', postId, 'value'])
        const label = getBlockTitle(block, postsData.recordMap)
        return {
          label,
          url,
        }
      })

      if (get(notion, ['previeImages', 'enable'])) {
        // we only parse the cover preview images from the recordMap of collection data to prevent duplicated parsing from blog/[slug]
        const previewImageMap = await getNotionPreviewImages(
          postsData.recordMap
        )
        recordMap['preview_images'] = previewImageMap
      }

      return {
        props: {
          menuItems,
          notionPath,
          pageType,
          recordMap,
        },
        revalidate: isLocal
          ? notion?.pageCacheTTL?.development
          : notion?.pageCacheTTL?.production,
      }
    }
    case PAGE_TYPE_SINGLE_PAGE: {
      const [pageName, pagePath] = notionPath
      const { pageId: postId, slug } = extractSinglePagePath(pagePath)
      const currentPostId = idToUuid(postId)
      const recordMap = await getNotionPage(currentPostId)
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
          pageId: get(notion, ['pages', pageName, 'pageId']),
          collectionViewId: get(notion, [
            'pages',
            pageName,
            'collectionViewId',
          ]),
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

      return {
        props: {
          menuItems,
          notionPath,
          pageId: currentPostId,
          pageType,
          recordMap,
          toc,
        },
        revalidate: isLocal
          ? notion?.pageCacheTTL?.development
          : notion?.pageCacheTTL?.production,
      }
    }
    default: {
      throw Error(`Invalid notionPath found: ${notionPath}`)
    }
  }
}

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
          className="flex flex-row flex-grow flex-nowrap max-w-1100 py-0 px-5 my-0 mx-auto"
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
          className="flex flex-row flex-grow flex-nowrap justify-center max-w-1400 py-0 px-5 my-0 mx-auto"
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
