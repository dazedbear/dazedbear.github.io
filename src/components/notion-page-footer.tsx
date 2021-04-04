import { communitySettings, communityFeatures } from '../../site.config'
import { useState, useEffect } from 'react'

const facebookLikeButtons = ({ url }) =>
  url && (
    <iframe
      className="border-0 overflow-hidden"
      src={`https://www.facebook.com/plugins/like.php?href=${url}&width=174&layout=button_count&action=like&size=large&share=true&height=46&appId=164758098310813`}
      width="174"
      height="46"
      scrolling="no"
      frameBorder="0"
      allowFullScreen={true}
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
    />
  )

const likecoin = ({ url }) =>
  url && (
    <iframe
      className="likecoin w-full min-h-150 lg:min-h-200"
      scrolling="no"
      frameBorder="0"
      src={`https://button.like.co/in/embed/${communitySettings.likecoin.userId}/button?referrer=${url}`}
    />
  )

const facebookComments = ({ url }) =>
  url && (
    <div
      className="fb-comments w-full"
      data-href={url}
      data-width="100%"
      data-numposts={5}
      data-order-by="reverse_time"
    />
  )

const socialFeatureComponentMap = {
  facebookLikeButtons,
  facebookComments,
  likecoin,
}

const NotionPageFooter = () => {
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    if (document) {
      setCurrentUrl(`${document.location.origin}${document.location.pathname}`)
    }
  })

  const communityComponents = communityFeatures.articleFooter.map(
    ({ name, enable }) => {
      if (enable) {
        const Component = socialFeatureComponentMap[name]
        return <Component key={name} url={currentUrl} />
      }
      return null
    }
  )

  if (!communityComponents.length) {
    return null
  }

  return (
    <div className="w-full my-5 min-h-150 lg:min-h-200">
      {communityComponents}
    </div>
  )
}

export default NotionPageFooter
