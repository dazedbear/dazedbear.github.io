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

import { GetServerSideProps } from 'next'
import Error from 'next/error'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import { NotionRenderer } from 'react-notion-x'

import NotionComponentMap from '../components/notion-components'
import { notion, pageProcessTimeout, cache } from '../../site.config'
import {
  FAILSAFE_PAGE_GENERATION_QUERY,
  FORCE_CACHE_REFRESH_QUERY,
  ABOUT_PAGE,
} from '../libs/constant'
import { mapNotionPageLinkUrl } from '../libs/notion'
import log from '../libs/server/log'
import wrapper from '../libs/client/store'
import { updateSinglePage } from '../libs/client/slices/page'
import { useAppSelector, useRemoveLinks } from '../libs/client/hooks'
import {
  showCommonPage,
  fetchSinglePage,
  isValidPageName,
  executeFunctionWithTimeout,
} from '../libs/server/page'
import {
  transformSinglePage,
  transformPageActionPayload,
} from '../libs/server/transformer'
import { logOption } from '../../types'

const pageName = 'about'

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async ({ query, req, res }) => {
    // disable page timeout when failsafe generation mode (?fsg=1)
    const timeout =
      query[FAILSAFE_PAGE_GENERATION_QUERY] === '1' ? 0 : pageProcessTimeout
    cache.forceRefresh = query[FORCE_CACHE_REFRESH_QUERY] === '1'
    const props = await executeFunctionWithTimeout(
      async () => {
        if (!isValidPageName(pageName)) {
          const options: logOption = {
            category: ABOUT_PAGE,
            message: `invalid page | pageName: ${pageName}`,
            level: 'error',
            req,
          }
          log(options)
          return showCommonPage(req, res, 'notFound', pageName)
        }

        try {
          const response = await fetchSinglePage({
            req,
            pageName,
            category: ABOUT_PAGE,
          })
          const pageContent = await transformSinglePage(response)

          // save SSR fetch page contents to redux store
          const payload = transformPageActionPayload(pageName, pageContent)
          const action = updateSinglePage(payload)
          store.dispatch(action)

          const options: logOption = {
            category: 'page',
            message: `dumpaccess to /${pageName}`,
            level: 'info',
            req,
          }
          log(options)
          return {
            props: {
              pageName,
            },
          }
        } catch (err) {
          const options: logOption = {
            category: ABOUT_PAGE,
            message: err,
            level: 'error',
            req,
          }
          log(options)
          return showCommonPage(req, res, 'error', pageName)
        }
      },
      timeout,
      (duration) => {
        const options: logOption = {
          category: ABOUT_PAGE,
          message: `page processing timeout | duration: ${duration} ms`,
          level: 'warn',
          req,
        }
        log(options)
        return showCommonPage(req, res, 'error', pageName)
      },
      ABOUT_PAGE
    )
    return props
  })

const AboutPage = ({ hasError, pageName }) => {
  const pageState = useAppSelector((state) => state.page)
  // disable links from notion table.
  useRemoveLinks({
    selector: '.notion-table a.notion-page-link',
    condition: () => true,
  })

  if (hasError) {
    return <Error statusCode={500} title="This page is broken" />
  }

  const blockId: string = get(notion, ['pages', pageName, 'pageId'])
  const content: any = get(pageState, [pageName])
  const previewImagesEnabled: boolean = get(notion, ['previewImages', 'enable'])

  // hack to temporarily fix "cannot assign type to read-only object" issue in react-notion-x
  const recordMap = cloneDeep(content)

  return (
    <div
      id="notion-about-page"
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

export default AboutPage
