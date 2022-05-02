import Document, { Html, Head, Main, NextScript } from 'next/document'
import {
  communityFeatures,
  currentEnv,
  trackingSettings,
} from '../../site.config'

const isLocal = currentEnv === 'development'
const isProduction = currentEnv === 'production'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
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
          {communityFeatures?.facebookChat?.enable && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.fbAsyncInit = function() {
                    FB.init({
                      xfbml            : true,
                      version          : 'v13.0'
                    });
                  };
                  (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) return;
                    js = d.createElement(s); js.id = id;
                    js.src = 'https://connect.facebook.net/zh_TW/sdk/xfbml.customerchat.js';
                    fjs.parentNode.insertBefore(js, fjs);
                  }(document, 'script', 'facebook-jssdk'));`,
              }}
            />
          )}
          {!isProduction && <meta name="robots" content="noindex" />}
        </Head>
        <body>
          {communityFeatures?.facebookChat?.enable && (
            <>
              <div id="fb-root" />
              <div id="fb-customer-chat" className="fb-customerchat" />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    var chatbox = document.getElementById('fb-customer-chat');
                    chatbox.setAttribute("page_id", "${communityFeatures.facebookChat.pageId}");
                    chatbox.setAttribute("attribution", "biz_inbox");`,
                }}
              />
            </>
          )}
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
