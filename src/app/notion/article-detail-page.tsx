'use client'

import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import { NotionRenderer } from 'react-notion-x'
import { notion } from '../../../site.config'
import { getPageProperty, mapNotionPageLinkUrl } from '../../libs/notion'
import { getDateStr } from '../../libs/util'
import { useRemoveLinks } from '../../libs/client/hooks'
import Breadcrumb from '../../components/breadcrumb'
import NavMenu from '../../components/nav-menu'
import TableOfContent from '../../components/toc'
import NotionPageHeader from '../../components/notion-page-header'
import NotionPageFooter from '../../components/notion-page-footer'
import NotionComponentMap from '../../components/notion-components'

const NotionArticleDetailPage = ({
  menuItems = [],
  pageContent,
  pageId,
  pageName,
  toc,
}: {
  menuItems: object[]
  pageContent: object
  pageId: string
  pageName: string
  toc: object[]
}) => {
  // disable links from notion table.
  useRemoveLinks({
    selector: '.notion-table a.notion-page-link',
    condition: () => true,
  })

  if (!pageContent) {
    return null
  }
  // hack to temporarily fix "cannot assign type to read-only object" issue in react-notion-x
  const recordMap = cloneDeep(pageContent)
  const previewImagesEnabled: boolean = get(notion, ['previewImages', 'enable'])
  const property: any = getPageProperty({ pageId, recordMap })
  const enableToc: boolean = toc && toc.length > 0

  const pageHeader = (
    <NotionPageHeader
      title={property.PageTitle}
      publishDate={getDateStr(get(property, ['Publish Date', 'start_date']))}
      lastEditedDate={getDateStr(property.LastEditedTime)}
      cover={property.PageCover}
      recordMap={recordMap}
    />
  )
  const pageFooter = <NotionPageFooter />

  return (
    <div
      id="notion-article-detail-page"
      data-namespace={pageName}
      className="mx-auto my-0 flex max-w-1400 flex-grow flex-row flex-nowrap justify-center px-5 py-0 pt-24 lg:pt-12"
    >
      <Breadcrumb
        title={get(notion, ['pages', pageName, 'navMenuTitle'])}
        enableToc={enableToc}
      />
      <NavMenu
        title={get(notion, ['pages', pageName, 'navMenuTitle'])}
        menuItems={menuItems}
      />
      <NotionRenderer
        blockId={pageId}
        components={NotionComponentMap}
        className="overflow-y-scroll pt-20 lg:max-h-full-viewport lg:w-3-cols-center lg:pt-10"
        recordMap={recordMap}
        fullPage={false}
        darkMode={false}
        mapPageUrl={mapNotionPageLinkUrl.bind(this, pageName, recordMap)}
        pageHeader={pageHeader}
        pageFooter={pageFooter}
        previewImages={previewImagesEnabled}
        showTableOfContents={false}
        showCollectionViewDropdown={false}
      />
      <TableOfContent toc={toc} />
    </div>
  )
}

export default NotionArticleDetailPage
