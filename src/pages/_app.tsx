import 'react-notion-x/src/styles.css'
import 'katex/dist/katex.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'rc-dropdown/assets/index.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all'
import '../styles/global.css'
import '../styles/notion.css'
import Header from '../components/header'
import Footer from '../components/footer'
import { withSiteContextProvider } from '../lib/context'
import { useResizeHandler } from '../lib/hooks'

const App = ({ Component, pageProps }) => {
  useResizeHandler()
  return (
    <div id="app">
      <Header />
      <div className="pt-24 lg:pt-12">
        <Component {...pageProps} />
      </div>
      <Footer />
    </div>
  )
}

export default withSiteContextProvider(App)
