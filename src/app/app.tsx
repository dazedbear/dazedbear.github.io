'use client'

import { usePathname } from 'next/navigation'
import Header from '../components/header'
import Footer from '../components/footer'
import {
  useCodeSyntaxHighlight,
  useResizeHandler,
  useInitLogRocket,
} from '../libs/client/hooks'
import wrapper from '../libs/client/store'

// TODO: new progress bar while route change

const App = ({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) => {
  useInitLogRocket()
  useResizeHandler()
  useCodeSyntaxHighlight()

  const pathname = usePathname()

  return (
    <div id="app">
      <Header pathname={pathname || '/'} />
      <div id="main-content">{children}</div>
      <Footer />
    </div>
  )
}

export default wrapper.withRedux(App)
