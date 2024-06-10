import { communitySettings, communityFeatures } from '../../site.config'
import { useState, useEffect, ReactElement } from 'react'

// https://docs.like.co/developer/likecoin-button/iframe
const likecoin = ({ url }) =>
  url && (
    <div className="likecoin-embed likecoin-button">
      <div />
      <iframe
        className="likecoin min-h-150 w-full lg:min-h-200"
        scrolling="no"
        frameBorder="0"
        src={`https://button.like.co/in/embed/${
          communitySettings.likecoin.userId
        }/button?referrer=${encodeURIComponent(url)}`}
      />
    </div>
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

  const communityComponents = communityFeatures.articleFooter.reduce(
    (enableItems: ReactElement[], { name, enable }) => {
      if (enable) {
        const Component = socialFeatureComponentMap[name]
        enableItems.push(<Component key={name} url={currentUrl} />)
      }
      return enableItems
    },
    []
  )

  if (!communityComponents.length) {
    return null
  }

  return (
    <div className="my-5 min-h-150 w-full lg:min-h-200">
      {communityComponents}
    </div>
  )
}

export default NotionPageFooter
