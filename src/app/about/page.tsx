import { getPageMeta } from '../../libs/util'
import NotionSinglePage from '../notion/single-page'
import { getNotionContent } from '../notion/content'
import { PAGE_TYPE_NOTION_SINGLE_PAGE } from '../../libs/constant'
import log from '../../libs/server/log'

const pageName = 'about'

export async function generateMetadata() {
  return getPageMeta({}, pageName)
}

const AboutPage = async ({ searchParams }) => {
  const { pageContent } = await getNotionContent({
    pageType: PAGE_TYPE_NOTION_SINGLE_PAGE,
    pageName,
    searchParams,
  })

  log({
    category: PAGE_TYPE_NOTION_SINGLE_PAGE,
    message: `dumpaccess to /${pageName}`,
    level: 'info',
  })
  return <NotionSinglePage pageName="about" pageContent={pageContent} />
}

export default AboutPage
