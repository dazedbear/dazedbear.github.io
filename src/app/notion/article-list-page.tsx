'use client'

import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import { NotionRenderer } from 'react-notion-x'

import Breadcrumb from '../../components/breadcrumb'
import NavMenu from '../../components/nav-menu'
import NotionComponentMap from '../../components/notion-components'
import { notion } from '../../../site.config'
import { mapNotionPageLinkUrl } from '../../libs/notion'

const NotionArticleListPage = ({
  menuItems,
  pageName,
  articleStream,
}: {
  menuItems: object[]
  pageName: string
  articleStream: any
}) => {
  if (!articleStream?.content) {
    return null
  }

  const previewImagesEnabled: boolean = get(notion, ['previewImages', 'enable'])

  // hack to temporarily fix "cannot assign type to read-only object" issue in react-notion-x
  const recordMap = cloneDeep(articleStream.content)

  // TODO: pagination support

  return (
    <div
      id="notion-article-list-page"
      data-namespace={pageName}
      className="mx-auto my-0 flex max-w-1100 flex-grow flex-row flex-nowrap px-5 py-0 pt-24 lg:pt-12"
    >
      <Breadcrumb title={get(notion, ['pages', pageName, 'navMenuTitle'])} />
      <NavMenu
        title={get(notion, ['pages', pageName, 'navMenuTitle'])}
        menuItems={menuItems}
      />
      <NotionRenderer
        className="overflow-y-scroll lg:max-h-full-viewport"
        fullPage={false}
        recordMap={recordMap}
        components={NotionComponentMap}
        mapPageUrl={mapNotionPageLinkUrl.bind(this, pageName, recordMap)}
        previewImages={previewImagesEnabled}
        showCollectionViewDropdown={false}
      />
    </div>
  )
}

export default NotionArticleListPage
