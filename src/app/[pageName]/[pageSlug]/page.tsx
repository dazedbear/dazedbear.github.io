import NotionArticleDetailPage from '../../notion/article-detail-page'
import { getNotionContent } from '../../notion/content'
import { PAGE_TYPE_NOTION_ARTICLE_DETAIL_PAGE } from '../../../libs/constant'
import { getPageMeta } from '../../../libs/util'
import { getPageProperty } from '../../../libs/notion'
import log from '../../../libs/server/log'

export async function generateMetadata({ params, searchParams }) {
  const { pageName, pageSlug } = params

  // hack way to get fetched article property.
  // TODO: need to find a way to pass property instead of redundant request.
  const { pageContent, pageId } = await getNotionContent({
    pageType: PAGE_TYPE_NOTION_ARTICLE_DETAIL_PAGE,
    pageName,
    pageSlug,
    searchParams,
  })
  const property: any = getPageProperty({ pageId, recordMap: pageContent })
  const metaOverride = {
    title: property?.PageTitle,
  }

  return getPageMeta(metaOverride, pageName)
}

const ArticleListPage = async ({ params, searchParams }) => {
  const { pageName, pageSlug } = params
  const { menuItems, pageContent, pageId, toc } = await getNotionContent({
    pageType: PAGE_TYPE_NOTION_ARTICLE_DETAIL_PAGE,
    pageName,
    pageSlug,
    searchParams,
  })

  log({
    category: PAGE_TYPE_NOTION_ARTICLE_DETAIL_PAGE,
    message: `dumpaccess to /${pageName}/${pageSlug}`,
    level: 'info',
  })
  return (
    <NotionArticleDetailPage
      pageId={pageId}
      pageName={pageName}
      pageContent={pageContent}
      menuItems={menuItems}
      toc={toc}
    />
  )
}

export default ArticleListPage
