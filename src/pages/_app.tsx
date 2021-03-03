import '../styles/global.css'
import '../styles/notion.css'
import 'react-notion-x/src/styles.css'
import 'katex/dist/katex.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'rc-dropdown/assets/index.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all'
import Header from '../components/header'
import Footer from '../components/footer'

const MyApp = ({ Component, pageProps }) => (
  <>
    <Header />
    <div className="pt-24 lg:pt-12">
      <Component {...pageProps} />
    </div>
    <Footer />
  </>
)
export default MyApp
