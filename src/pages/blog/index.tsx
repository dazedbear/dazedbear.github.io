import Header from '../../components/header'
import Link from 'next/link'
import { NotionAPI } from 'notion-client'
import {
  NotionRenderer,
  Code,
  Collection,
  CollectionRow,
  Pdf,
  Equation,
  Modal,
} from 'react-notion-x'
import { BLOG_INDEX_ID, NOTION_TOKEN } from '../../lib/notion/server-constants'

export async function getStaticProps() {
  const notion = new NotionAPI({ authToken: NOTION_TOKEN })
  const recordMap = await notion.getPage(BLOG_INDEX_ID)
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
