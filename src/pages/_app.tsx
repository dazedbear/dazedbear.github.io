import '../styles/global.css'
import 'katex/dist/katex.css'
import Footer from '../components/footer'

const MyApp = ({ Component, pageProps }) => (
  <>
    <Component {...pageProps} />
    <Footer />
  </>
)
export default MyApp
