import NotionArticleListPage from '../notion/article-list-page'
import { getNotionContent } from '../notion/content'
import { PAGE_TYPE_NOTION_ARTICLE_LIST_PAGE } from '../../libs/constant'
import { getPageMeta } from '../../libs/util'

export async function generateMetadata({ params: { pageName } }) {
  return getPageMeta({}, pageName)
}

const ArticleListPage = async ({ params, searchParams }) => {
  const { pageName } = params
  const { menuItems, articleStream } = await getNotionContent({
    pageType: PAGE_TYPE_NOTION_ARTICLE_LIST_PAGE,
    pageName,
    searchParams,
  })
  return (
    <NotionArticleListPage
      pageName={pageName}
      menuItems={menuItems}
      articleStream={articleStream}
    />
  )
}

export default ArticleListPage
