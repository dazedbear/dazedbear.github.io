const React = require("react");

/**
 * Hacky method to extend .blogSocialSection and fix issue of Facebook Comments
 * 
 * supports: facebook like buttons, facebook comments, likecoin
 */
class BlogSocialSection extends React.Component {
  constructor(props) {
    super(props);
  }
  renderSDKScript() {
    const {
      facebookAppId,
      facebookLikeButtons,
      facebookComments,
      likecoinId,
    } = this.props.config.blogSocialSection || {};
    if (facebookAppId) {
      const initBlogSocialSectionScript = `
        window.BlogSocialSection = {
          facebookComments: ${!!facebookComments},
          facebookLikeButtons: ${!!facebookLikeButtons},
          likecoin: ${!!likecoinId}
        };
        (function(d){
          var fbMeta = d.createElement('meta');
          fbMeta.setAttribute('property', 'fb:app_id');
          fbMeta.setAttribute('content', '${facebookAppId}');
          d.head.appendChild(fbMeta);
        }(document))
      `;
      return (
        <>
          <div id="fb-root" />
          <script dangerouslySetInnerHTML={{ __html: initBlogSocialSectionScript }} />
          <script
            async
            defer
            crossOrigin="anonymous"
            src={`https://connect.facebook.net/zh_TW/sdk.js#xfbml=1&autoLogAppEvents=1&version=v8.0&appId=${facebookAppId}`}
            nonce="HR6gUgcD"
          />
        </>
      );
    }
    return null;
  }
  renderSocialSectionItemScript() {
    const { likecoinId } = this.props.config.blogSocialSection || {};
    const BLOG_SECTION_WRAPPER_CLASSNAME = 'blogSocialSection';
    const BLOG_SECTION_ITEM_CLASSNAME = 'blogSocialSectionItem';

    const renderScript = `
      (function(d, w, bss){
        var item, sectionItem, sectionWrapper = d.getElementsByClassName('${BLOG_SECTION_WRAPPER_CLASSNAME}')[0];
        var settings = [
          {
            key: 'likecoin',
            tagName: 'iframe',
            handler: function(item) {
              item.setAttribute('class', 'likecoin');
              item.setAttribute('scrolling', 'no');
              item.setAttribute('frameborder', '0');
              item.src = 'https://button.like.co/in/embed/${likecoinId}/button?referrer=' + w.location.href;
              return item;
            }
          },
          {
            key: 'facebookLikeButtons',
            tagName: 'div',
            handler: function(item) {
              item.setAttribute('class', 'fb-like');
              item.setAttribute('data-href', w.location.href);
              item.setAttribute('data-layout', 'standard');
              item.setAttribute('data-share', 'true');
              item.setAttribute('data-width', '225');
              item.setAttribute('data-show-faces', 'false');
              return item;
            }
          },
          {
            key: 'facebookComments',
            tagName: 'div',
            handler: function(item) {
              item.setAttribute('class', 'fb-comments');
              item.setAttribute('data-href', w.location.href);
              item.setAttribute('data-width', '100%');
              item.setAttribute('data-numposts', '5');
              item.setAttribute('data-order-by', 'time');
              return item;
            }
          }
        ];

        if (!bss || !sectionWrapper) {return;}        
        settings.forEach(function(config){
          if (!bss[config.key]) {return;}

          sectionItem = d.createElement('div');
          sectionItem.setAttribute('class', '${BLOG_SECTION_ITEM_CLASSNAME}');
          item = d.createElement(config.tagName);
          item = config.handler(item);

          sectionItem.appendChild(item);
          sectionWrapper.appendChild(sectionItem);
          sectionItem = undefined;
        });
      }(document, window, window.BlogSocialSection));
    `;
    return <script dangerouslySetInnerHTML={{ __html: renderScript }} />;
  }
  render() {
    const SDKScript = this.renderSDKScript();
    if (SDKScript) {
      return (
        <>
          {SDKScript}
          {this.renderSocialSectionItemScript()}
        </>
      );
    }
    return null;
  }
}

module.exports = BlogSocialSection;
