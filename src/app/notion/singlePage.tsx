'use client'

// for Prism.js language highlight
import 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-markup-templating'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-css-extras'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
// prism-php has a dependency: prism-markup-templating.
// see: https://github.com/PrismJS/prism/issues/1400#issuecomment-485847919
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-php-extras'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-shell-session'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-vim'
import 'prismjs/components/prism-graphql'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-log'

import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import { NotionRenderer } from 'react-notion-x'

import NotionComponentMap from '../../components/notion-components'
import { notion } from '../../../site.config'
import { mapNotionPageLinkUrl } from '../../libs/notion'
import { useRemoveLinks } from '../../libs/client/hooks'

const NotionSinglePage = ({
  pageName,
  pageContent,
}: {
  pageName: string
  pageContent: object
}) => {
  // disable links from notion table.
  useRemoveLinks({
    selector: '.notion-table a.notion-page-link',
    condition: () => true,
  })

  if (!pageContent) {
    return null
  }

  const blockId: string = get(notion, ['pages', pageName, 'pageId'])
  const previewImagesEnabled: boolean = get(notion, ['previewImages', 'enable'])

  // hack to temporarily fix "cannot assign type to read-only object" issue in react-notion-x
  const recordMap = cloneDeep(pageContent)

  return (
    <div
      id={`notion-${pageName}-page`}
      data-namespace={pageName}
      className="mx-auto my-0 flex max-w-1100 flex-grow flex-row flex-nowrap px-5 py-0 pt-24 lg:pt-12"
    >
      <NotionRenderer
        blockId={blockId}
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

export default NotionSinglePage
