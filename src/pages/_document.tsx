import Document, { Html, Head, Main, NextScript } from 'next/document'
import LogRocket from 'logrocket'
import { communitySettings, trackingSettings } from '../../site.config'

const isLocal = process.env.NEXT_PUBLIC_APP_ENV === 'development'
const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production'

if (!isLocal && trackingSettings?.logRocket?.enable) {
  LogRocket.init(trackingSettings?.logRocket?.id)
}

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
          {!isLocal && trackingSettings?.microsoftClarity?.enable && (
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${trackingSettings?.microsoftClarity?.id}");`,
              }}
            />
          )}
          {!isLocal && trackingSettings?.googleAnalytics?.enable && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${trackingSettings?.googleAnalytics?.id}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${trackingSettings?.googleAnalytics?.id}');`,
                }}
              />
            </>
          )}
          {!isProduction && <meta name="robots" content="noindex" />}
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
