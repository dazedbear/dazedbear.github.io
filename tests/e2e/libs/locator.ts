export default {
  pageTitle: 'title',
  meta: {
    description: 'meta[name="description"]',
    ogTitle: 'meta[property="og:title"]',
    ogImage: 'meta[property="og:image"]',
  },
  pages: {
    about: {
      notionWrapper: '#notion-about-page',
      notionContent: '#notion-about-page > main.notion-page',
    },
    article: {
      navigationMenu:
        '#notion-article-list-page[data-namespace="article"] [data-testid="navigation-menu"]',
      notionWrapper: '#notion-article-list-page[data-namespace="article"]',
      notionContent:
        '#notion-article-list-page[data-namespace="article"] > main.notion-page',
    },
    coding: {
      navigationMenu:
        '#notion-article-list-page[data-namespace="coding"] [data-testid="navigation-menu"]',
      notionWrapper: '#notion-article-list-page[data-namespace="coding"]',
      notionContent:
        '#notion-article-list-page[data-namespace="coding"] > main.notion-page',
    },
    music: {
      navigationMenu:
        '#notion-article-list-page[data-namespace="music"] [data-testid="navigation-menu"]',
      notionWrapper: '#notion-article-list-page[data-namespace="music"]',
      notionContent:
        '#notion-article-list-page[data-namespace="music"] > main.notion-page',
    },
  },
}
