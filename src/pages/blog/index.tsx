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
import { getNotionPage, getNotionPostsFromTable } from '../../lib/notion'
import { getBlockTitle, uuidToId } from 'notion-utils'
import { notion } from '../../lib/site.config'
import { useBrokenImageHandler } from '../../lib/hooks'
import Breadcrumb from '../../components/breadcrumb'
import NavMenu from '../../components/nav-menu'
import get from 'lodash/get'

export async function getStaticProps() {
  const recordMap = await getNotionPage(notion.blog.pageId)
  const menuItems = await getNotionPostsFromTable(
    {
      pageId: notion.blog.pageId,
      collectionViewId: notion.blog.collectionViewId,
    },
    data => {
      const postIds = get(data, ['result', 'blockIds'])
      return postIds.map(postId => {
        const url = `/blog/${uuidToId(postId)}`
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
      recordMap,
    },
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
  useBrokenImageHandler({
    selector: '.notion-collection-card-cover img',
    fallbackImageUrl: '/default-cover.png',
  })
  return (
    <div
      id="article-list-page"
      className="flex flex-row flex-grow flex-nowrap max-w-1100 py-0 px-5 my-0 mx-auto"
    >
      <Breadcrumb title={notion.blog.navMenuTitle} />
      <NavMenu title={notion.blog.navMenuTitle} menuItems={menuItems} />
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
