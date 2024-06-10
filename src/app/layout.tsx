import dynamic from 'next/dynamic'
import App from './app'
import { currentEnv, searchSettings } from '../../site.config'
import { getPageMeta } from '../libs/util'

// css
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'nprogress/nprogress.css'
import '@docsearch/css'
import '../styles/global.css'
import '../styles/notion.css'

const isProduction = currentEnv === 'production'

export async function generateMetadata() {
  return getPageMeta()
}

const CustomScript = dynamic(() => import('./custom-script'), { ssr: false })

const RootLayout = ({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) => {
  // use `suppressHydrationWarning` to ignore extra attributes added by browser extensions
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <CustomScript />
        {!isProduction && <meta name="robots" content="noindex" />}
        <link
          rel="preconnect"
          href={`https://${searchSettings?.appId}-dsn.algolia.net`}
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <App>{children}</App>
      </body>
    </html>
  )
}

export default RootLayout
