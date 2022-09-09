export default {
  pageTitle: 'title',
  meta: {
    description: 'meta[name="description"]',
    ogTitle: 'meta[name="og:title"]',
    ogImage: 'meta[property="og:image"]',
  },
  pages: {
    about: {
      notionWrapper: '#notion-about-page',
      notionContent: '#notion-about-page > main.notion-page',
    },
    article: {
      navigationMenu:
        '#notion-list-page[data-namespace="article"] [data-testid="navigation-menu"]',
      notionWrapper: '#notion-list-page[data-namespace="article"]',
      notionContent:
        '#notion-list-page[data-namespace="article"] > main.notion-page',
    },
    coding: {
      navigationMenu:
        '#notion-list-page[data-namespace="coding"] [data-testid="navigation-menu"]',
      notionWrapper: '#notion-list-page[data-namespace="coding"]',
      notionContent:
        '#notion-list-page[data-namespace="coding"] > main.notion-page',
    },
    music: {
      navigationMenu:
        '#notion-list-page[data-namespace="music"] [data-testid="navigation-menu"]',
      notionWrapper: '#notion-list-page[data-namespace="music"]',
      notionContent:
        '#notion-list-page[data-namespace="music"] > main.notion-page',
    },
  },
}
