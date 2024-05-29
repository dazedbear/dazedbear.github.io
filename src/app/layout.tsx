import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import App from './app'
import {
  currentEnv,
  currentWebsite,
  meta,
  searchSettings,
} from '../../site.config'

// css
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'nprogress/nprogress.css'
import '@docsearch/css'
import '../styles/global.css'
import '../styles/notion.css'

const isProduction = currentEnv === 'production'

export const metadata: Metadata = {
  metadataBase: new URL(`${currentWebsite.protocol}://${currentWebsite.host}`),
  title: meta.title,
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    images: [
      {
        url: meta.image,
        alt: meta.title,
      },
    ],
  },
}

const CustomScript = dynamic(() => import('./customScript'), { ssr: false })

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
