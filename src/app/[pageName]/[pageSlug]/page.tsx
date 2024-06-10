import NotionArticleDetailPage from '../../notion/article-detail-page'
import { getNotionContent } from '../../notion/content'
import { PAGE_TYPE_NOTION_ARTICLE_DETAIL_PAGE } from '../../../libs/constant'

const ArticleListPage = async ({ params, searchParams }) => {
  const { pageName, pageSlug } = params
  const { menuItems, pageContent, pageId, toc } = await getNotionContent({
    pageType: PAGE_TYPE_NOTION_ARTICLE_DETAIL_PAGE,
    pageName,
    pageSlug,
    searchParams,
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
