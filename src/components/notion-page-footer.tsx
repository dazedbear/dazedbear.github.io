import { communitySettings, communityFeatures } from '../../site.config'
import { useState, useEffect } from 'react'

const likecoin = ({ url }) =>
  url && (
    <iframe
      className="likecoin w-full min-h-150 lg:min-h-200"
      scrolling="no"
      frameBorder="0"
      src={`https://button.like.co/in/embed/${communitySettings.likecoin.userId}/button?referrer=${url}`}
    />
  )

const socialFeatureComponentMap = {
  likecoin,
}

const NotionPageFooter = () => {
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    if (document) {
      setCurrentUrl(`${document.location.origin}${document.location.pathname}`)
    }
  }, [setCurrentUrl])

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
