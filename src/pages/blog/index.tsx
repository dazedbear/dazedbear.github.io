import Header from '../../components/header'
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
import { getNotionPosts } from '../../lib/notion'
import { notion } from '../../lib/site.config'

export async function getStaticProps() {
  const recordMap = await getNotionPosts({ pageId: notion.blog.pageId })
  return {
    props: {
      recordMap,
    },
    revalidate: 10,
  }
}

const Index = ({ recordMap }) => {
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
    <>
      <Header titlePre="Blog" />
      <NotionRenderer
        recordMap={recordMap}
        components={components}
        showCollectionViewDropdown={false}
      />
    </>
  )
}

export default Index
