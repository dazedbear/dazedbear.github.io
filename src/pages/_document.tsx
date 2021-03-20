import Document, { Html, Head, Main, NextScript } from 'next/document'
import { communitySettings } from '../lib/site.config'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {communitySettings?.facebook?.facebookAppId && (
            <script
              async
              defer
              crossOrigin="anonymous"
              nonce="CwIpMVWO"
              src={`https://connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v10.0&appId=${communitySettings.facebook.facebookAppId}`}
            />
          )}
        </Head>
        <body>
          {communitySettings?.facebook?.facebookAppId && <div id="fb-root" />}
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
