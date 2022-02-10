// css
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all'
import 'nprogress/nprogress.css'
import '../styles/global.css'
import '../styles/notion.css'

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

import Header from '../components/header'
import Footer from '../components/footer'
import {
  useCodeSyntaxHighlight,
  useResizeHandler,
  useInitLogRocket,
} from '../libs/client/hooks'
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
  useCodeSyntaxHighlight()
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
