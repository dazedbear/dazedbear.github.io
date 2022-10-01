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
          {!isLocal && trackingSettings?.googleTagManager?.enable && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                <!-- Google Tag Manager -->
                <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${trackingSettings?.googleTagManager?.id}');</script>
                <!-- End Google Tag Manager -->`,
              }}
            />
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
          {!isLocal && trackingSettings?.googleTagManager?.enable && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                <!-- Google Tag Manager (noscript) -->
                <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${trackingSettings?.googleTagManager?.id}"
                height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
                <!-- End Google Tag Manager (noscript) -->`,
              }}
            />
          )}
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
