import Image from 'next/image'
import ExtLink from './ext-link'
import {
  copyright,
  communitySettings,
  communityFeatures,
} from '../../site.config'
import logoOpenProcessing from '../../public/logo-openprocessing.png'

const CommunityIcon = ({ name, link }) => {
  const fontAwesomeUnsupportIcons = {
    openprocessing: logoOpenProcessing,
  }
  if (!name || !link) {
    return null
  }
  if (fontAwesomeUnsupportIcons[name]) {
    return (
      <div className="w-24 p-0 m-0 text-center">
        <ExtLink href={link} target="_blank" className="text-gray-500">
          <Image
            src={fontAwesomeUnsupportIcons[name]}
            className="h-8 mx-auto my-0 block filter grayscale"
            height="32"
            width="36"
            alt={name}
          />
        </ExtLink>
      </div>
    )
  }
  return (
    <div className="w-24 p-0 m-0 text-center">
      <ExtLink href={link} target="_blank" className="text-gray-500">
        <i className={`text-gray-300 fab fa-2x fa-${name}`} />
        {/* <p className="text-gray-300 mt-0.5 capitalize">{name}</p> */}
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
        <section className="flex justify-center mt-0 mb-5 mx-auto">
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
