import Link from 'next/link'
import {
  NotionRenderer,
  Code,
  Collection,
  CollectionRow,
  Pdf,
  Equation,
  Modal,
} from 'react-notion-x'
import { getNotionPosts, getTransformedNotionData } from '../../lib/notion'
import { getBlockTitle, uuidToId } from 'notion-utils'
import { notion } from '../../lib/site.config'
import Menu from '../../components/menu'

export async function getStaticProps() {
  const recordMap = await getNotionPosts({ pageId: notion.blog.pageId })
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

  return {
    props: {
      menuItems,
      recordMap,
    },
    revalidate: 10,
  }
}

const Index = ({ recordMap, menuItems }) => {
  const components = {
    pageLink: ({ href, ...props }) => (
      <Link href={`/blog${href}`} {...props}>
        <a {...props} />
      </Link>
    ),
    code: Code,
    collection: Collection,
    collectionRow: CollectionRow,
    modal: Modal,
    pdf: Pdf,
    equation: Equation,
  }
  return (
    <div className="flex flex-row flex-grow flex-nowrap max-w-1100 py-0 px-5 my-0 mx-auto">
      <Menu title="所有文章" items={menuItems} />
      <NotionRenderer
        fullPage={false}
        recordMap={recordMap}
        components={components}
        showCollectionViewDropdown={false}
      />
    </div>
  )
}

export default Index
