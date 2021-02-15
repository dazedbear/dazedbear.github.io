import { useRouter } from 'next/router'
import Header from '../../components/header'
import blogStyles from '../../styles/blog.module.css'
import { NotionRenderer } from 'react-notion-x'
import { getPageTitle, uuidToId } from 'notion-utils'
import { notion } from '../../lib/site.config'
import { getNotionPosts, getNotionSinglePost } from '../../lib/notion'

// Get the data for each blog post
export async function getStaticProps({ params: { slug: postId } }) {
  const recordMap = await getNotionSinglePost(postId)
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
      console.log('data', data)
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
      <Header />
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
