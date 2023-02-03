// css
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'nprogress/nprogress.css'
import '@docsearch/css'
import '../styles/global.css'
import '../styles/notion.css'

import Header from '../components/header'
import Footer from '../components/footer'
import {
  useCodeSyntaxHighlight,
  useResizeHandler,
  useInitLogRocket,
} from '../libs/client/hooks'
import wrapper from '../libs/client/store'
import { getPageMeta } from '../libs/util'
import Router from 'next/router'
import Head from 'next/head'
import NProgress from 'nprogress'

// loading progress bar
NProgress.configure({ parent: '#main-content', showSpinner: false })
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const App = ({ Component, pageProps }) => {
  useInitLogRocket()
  useResizeHandler()
  useCodeSyntaxHighlight()
  const { title, description, image } = getPageMeta(pageProps.meta)
  return (
    <div id="app">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="og:title" content={title} />
        <meta property="og:image" content={image} />
      </Head>
      <Header />
      <div id="main-content">
        <Component {...pageProps} />
      </div>
      <Footer />
    </div>
  )
}

export default wrapper.withRedux(App)
