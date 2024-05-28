'use client'

import {
  FAILSAFE_PAGE_GENERATION_QUERY,
  END_TO_END_TEST_QUERY,
} from '../libs/constant'
import {
  communityFeatures,
  currentEnv,
  trackingSettings,
} from '../../site.config'

const isLocal = currentEnv === 'development'
const prependCheck = (inputScript) => `if(!window.DBS.isBot){${inputScript}}`

const CustomScript = () => {
  return (
    <>
      {/* custom script for bot query detection */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(w){
              const qry = ['${END_TO_END_TEST_QUERY}', '${FAILSAFE_PAGE_GENERATION_QUERY}'];
              if (!w.DBS) {
                w.DBS = {};
              }
              w.DBS.isBot = qry.some(key => window.location.search.includes(key+'=1'));
            })(window)`,
        }}
      />
      {!isLocal && trackingSettings?.microsoftClarity?.enable && (
        <script
          dangerouslySetInnerHTML={{
            __html: prependCheck(`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${trackingSettings?.microsoftClarity?.id}");`),
          }}
        />
      )}
      {!isLocal && trackingSettings?.googleTagManager?.enable && (
        <script
          dangerouslySetInnerHTML={{
            __html: prependCheck(`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${trackingSettings?.googleTagManager?.id}');`),
          }}
        />
      )}
      {communityFeatures?.facebookChat?.enable && (
        <script
          dangerouslySetInnerHTML={{
            __html: prependCheck(`
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
                }(document, 'script', 'facebook-jssdk'));`),
          }}
        />
      )}
    </>
  )
}

export default CustomScript
