import 'normalize.css'
import '../styles/global.css'
import 'react-notion-x/src/styles.css'
import 'katex/dist/katex.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'rc-dropdown/assets/index.css'
import '../styles/notion.css'
import Header from '../components/header'
import Footer from '../components/footer'
import sharedStyles from '../styles/shared.module.css'

const MyApp = ({ Component, pageProps }) => (
  <>
    <Header />
    <div className={sharedStyles.layout}>
      <Component {...pageProps} />
    </div>
    <Footer />
  </>
)
export default MyApp
