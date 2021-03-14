import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  NotionRenderer,
  Code,
  Collection,
  Pdf,
  Equation,
  Modal,
} from 'react-notion-x'
import {
  getBlockTitle,
  uuidToId,
  idToUuid,
  getPageTableOfContents,
} from 'notion-utils'
import { notion } from '../../lib/site.config'
import {
  getNotionPosts,
  getNotionSinglePost,
  getTransformedNotionData,
} from '../../lib/notion'
import Breadcrumb from '../../components/breadcrumb'
import NavMenu from '../../components/nav-menu'
import TableOfContent from '../../components/toc'
import { useTOCScrollHandler, useBrokenImageHandler } from '../../lib/hooks'
import { getPageProperty, getDateStr } from '../../lib/blog-helpers'

// Get the data for each blog post
export async function getStaticProps({ params: { slug } }) {
  const currentPostId = idToUuid(slug)
  const recordMap = await getNotionSinglePost(currentPostId)
  const postIds = await getNotionPosts(
    {
      pageId: notion.blog.pageId,
      collectionViewName: notion.blog.collectionViewName,
    },
    data => data?.result?.blockIds
  )
  const postBlocksMap = await getTransformedNotionData(
    'getBlocks',
    response => {
      return response?.recordMap?.block
    },
    postIds
  )

  const menuItems = postIds.map(postId => {
    const url = `/blog/${uuidToId(postId)}`
    const block = postBlocksMap[postId]?.value
    const label = getBlockTitle(block, recordMap)
    return {
      label,
      url,
    }
  })

  const toc = getPageTableOfContents(
    postBlocksMap[currentPostId]?.value,
    recordMap
  )

  return {
    props: {
      pageId: currentPostId,
      recordMap,
      menuItems,
      toc,
    },
    revalidate: 10,
  }
}

// Return our list of blog posts to prerender
export async function getStaticPaths() {
  const postIds = await getNotionPosts(
    {
      pageId: notion.blog.pageId,
      collectionViewName: notion.blog.collectionViewName,
    },
    data => {
      return data?.result?.blockIds
    }
  )

  // TODO: we use postId as slug for now. will support to use readable text as slug later
  // https://github.com/vercel/next.js/discussions/11272
  const paths = postIds.map(postId => ({ params: { slug: uuidToId(postId) } }))
  return { paths, fallback: false }
}

const NotionComponents = {
  pageLink: ({ href, ...props }) => (
    <Link href={`/blog${href}`} {...props}>
      <a {...props} />
    </Link>
  ),
  code: Code,
  collection: Collection,
  collectionRow: () => null, // we don't render property table for each articles
  modal: Modal,
  pdf: Pdf,
  equation: Equation,
}

const RenderPost = ({ pageId, recordMap, menuItems = [], toc = [] }) => {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  // if you don't have a post at this point, and are not
  // loading one from fallback then  redirect back to the index
  if (!recordMap) {
    return (
      <div>
        <p>
          Woops! didn't find that post, redirecting you back to the blog index
        </p>
      </div>
    )
  }

  useBrokenImageHandler({
    selector: '.notion img',
    fallbackImageUrl: '/broken-image.png',
  })

  const { PageTitle, PageCover, LastEditedTime }: any = getPageProperty({
    pageId,
    recordMap,
  })
  const enableToc = toc && toc.length > 0
  if (enableToc) {
    useTOCScrollHandler()
  }

  const pageHeader = (
    <>
      <div className="notion-title">{PageTitle}</div>
      <p>{getDateStr(LastEditedTime)}</p>
      <img
        className="notion-page-cover"
        src={PageCover}
        loading="lazy"
        decoding="async"
      />
    </>
  )

  return (
    <div
      id="article-single-page"
      className="flex flex-row flex-grow flex-nowrap justify-center max-w-1400 py-0 px-5 my-0 mx-auto"
    >
      <Breadcrumb title={notion.blog.navMenuTitle} enableToc={enableToc} />
      <NavMenu title={notion.blog.navMenuTitle} menuItems={menuItems} />
      <NotionRenderer
        components={NotionComponents}
        className="pt-20 lg:pt-10 overflow-y-scroll lg:max-h-full-viewport lg:w-3-cols-center"
        recordMap={recordMap}
        fullPage={false}
        darkMode={false}
        pageHeader={pageHeader}
        showTableOfContents={false}
        showCollectionViewDropdown={false}
      />
      <TableOfContent toc={toc} />
    </div>
  )
}

export default RenderPost
