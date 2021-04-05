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
import { useResizeHandler } from '../libs/client/hooks'
import { Provider } from 'react-redux'
import store from '../libs/client/store'

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

const Root = props => {
  return (
    <Provider store={store}>
      <App {...props} />
    </Provider>
  )
}

export default Root
