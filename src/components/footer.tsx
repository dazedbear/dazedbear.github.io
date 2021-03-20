import ExtLink from './ext-link'
import {
  copyright,
  communitySettings,
  communityFeatures,
} from '../lib/site.config'

const CommunityIcon = ({ name, link }) => {
  if (!name || !link) {
    return null
  }
  return (
    <div className="w-24 p-0 m-0 text-center">
      <ExtLink href={link} target="_blank" className="text-gray-500">
        <i className={`text-gray-300 fab fa-3x fa-${name}`} />
        <p className="text-gray-300 mt-0.5 capitalize">{name}</p>
      </ExtLink>
    </div>
  )
}

const Footer = () => {
  return (
    <>
      <footer
        className="flex-shrink lg:flex-shrink-0 bg-lavender-purple-900 text-current text-base antialiased font-normal leading-6 py-8 relative"
        id="footer"
      >
        <section className="flex justify-around my-0 mx-auto">
          {communityFeatures.siteFooterIcon.map(({ name: brand, enable }) => {
            if (!enable) return
            let link
            if (brand === 'youtube') {
              link = `${communitySettings[brand]?.channelBaseUrl}/${communitySettings[brand]?.channelHash}`
            } else {
              link = `${communitySettings[brand]?.profileBaseUrl}/${communitySettings[brand]?.userName}`
            }
            return <CommunityIcon key={brand} link={link} name={brand} />
          })}
        </section>
        <section className="text-white text-opacity-40 text-center">
          {copyright}
        </section>
      </footer>
    </>
  )
}

export default Footer
