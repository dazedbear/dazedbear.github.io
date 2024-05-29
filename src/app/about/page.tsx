import NotionSinglePage from '../notion/single-page'
import { getNotionSinglePageContent } from '../notion/content'

const AboutPage = async ({ searchParams }) => {
  const pageContent = await getNotionSinglePageContent({
    pageName: 'about',
    searchParams,
  })
  return <NotionSinglePage pageName="about" pageContent={pageContent} />
}

export default AboutPage
