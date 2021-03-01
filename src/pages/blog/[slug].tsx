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
import { getPageTitle, uuidToId, idToUuid } from 'notion-utils'
import { notion } from '../../lib/site.config'
import { getNotionPosts, getNotionSinglePost } from '../../lib/notion'

// Get the data for each blog post
export async function getStaticProps({ params: { slug: postId } }) {
  const recordMap = await getNotionSinglePost(idToUuid(postId))
  return {
    props: {
      recordMap,
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

const RenderPost = ({ recordMap }) => {
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

  const title = getPageTitle(recordMap) // TODO: find a way to pass page title to header
  const components = {
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

  return (
    <>
      <NotionRenderer
        components={components}
        recordMap={recordMap}
        fullPage={false}
        darkMode={false}
        showTableOfContents={false}
        showCollectionViewDropdown={false}
      />
    </>
  )
}

export default RenderPost
