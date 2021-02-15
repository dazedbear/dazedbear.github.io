import 'normalize.css'
import '../styles/global.css'
import 'react-notion-x/src/styles.css'
import 'katex/dist/katex.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'rc-dropdown/assets/index.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all'
import '../styles/notion.css'
import '../styles/homepage.css' // TODO: refactor css
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
