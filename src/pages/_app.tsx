import 'react-notion-x/src/styles.css'
import 'katex/dist/katex.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'rc-dropdown/assets/index.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all'
import 'nprogress/nprogress.css'
import '../styles/global.css'
import '../styles/notion.css'
import Header from '../components/header'
import Footer from '../components/footer'
import { useResizeHandler, useInitLogRocket } from '../libs/client/hooks'
import wrapper from '../libs/client/store'
import Router from 'next/router'
import NProgress from 'nprogress'

// loading progress bar
NProgress.configure({ parent: '#main-content', showSpinner: false })
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const App = ({ Component, pageProps }) => {
  useInitLogRocket()
  useResizeHandler()
  return (
    <div id="app">
      <Header />
      <div id="main-content">
        <Component {...pageProps} />
      </div>
      <Footer />
    </div>
  )
}

export default wrapper.withRedux(App)
