import { useRouter } from 'next/router'
import Header from '../../components/header'
import blogStyles from '../../styles/blog.module.css'
import { NotionAPI } from 'notion-client'
import { NotionRenderer } from 'react-notion-x'
import { getPageTitle, uuidToId } from 'notion-utils'
import {
  BLOG_INDEX_ID,
  NOTION_TOKEN,
  COLLECTION_VIEW_NAME,
} from '../../lib/notion/server-constants'

// you can optionally pass an authToken to access private notion resources
const notion = new NotionAPI({ authToken: NOTION_TOKEN })

// Get the data for each blog post
export async function getStaticProps({ params: { slug: postId } }) {
  const recordMap = await notion.getPage(postId)
  return {
    props: {
      recordMap,
    },
    revalidate: 10,
  }
}

// Return our list of blog posts to prerender
export async function getStaticPaths() {
  const pageData = await notion.getPage(BLOG_INDEX_ID)

  // TODO: support 1 page has multiple tables
  const collectionId = Object.keys(pageData.collection)[0]
  if (!collectionId) {
    console.error('collectionId not found.')
    return
  }

  const collectionViewId = Object.keys(pageData.collection_view).find(
    id => pageData.collection_view[id]?.value?.name === COLLECTION_VIEW_NAME
  )
  if (!collectionViewId) {
    console.error('collectionViewId not found.')
    return
  }

  const collectionData = await notion.getCollectionData(
    collectionId,
    collectionViewId
  )
  const postIds = collectionData?.result?.blockIds

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
      <div className={blogStyles.post}>
        <p>
          Woops! didn't find that post, redirecting you back to the blog index
        </p>
      </div>
    )
  }

  const title = getPageTitle(recordMap)

  return (
    <>
      <Header titlePre={title} />
      <NotionRenderer
        recordMap={recordMap}
        fullPage={false}
        darkMode={false}
        showCollectionViewDropdown={false}
      />
    </>
  )
}

export default RenderPost
