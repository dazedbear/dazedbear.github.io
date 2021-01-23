import '../styles/global.css'
import 'react-notion-x/src/styles.css'
import 'katex/dist/katex.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'rc-dropdown/assets/index.css'
import Footer from '../components/footer'

const MyApp = ({ Component, pageProps }) => (
  <>
    <Component {...pageProps} />
    <Footer />
  </>
)
export default MyApp
