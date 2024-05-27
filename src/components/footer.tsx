import Image from 'next/image'
import { FaGithub, FaLinkedin, FaSoundcloud, FaYoutube } from 'react-icons/fa'
import { GiMetronome } from 'react-icons/gi'
import ExtLink from './ext-link'
import {
  copyright,
  communitySettings,
  communityFeatures,
} from '../../site.config'
import logoOpenProcessing from '../../public/logo-openprocessing.png'

const unsupportIcons = {
  openprocessing: logoOpenProcessing,
}
const supportIcons = {
  github: FaGithub,
  linkedin: FaLinkedin,
  musicLogbook: GiMetronome,
  soundcloud: FaSoundcloud,
  youtube: FaYoutube,
}

const CommunityIcon = ({ name, link }) => {
  if (!name || !link) {
    return null
  }
  if (unsupportIcons[name]) {
    return (
      <div className="m-0 w-24 p-0 text-center">
        <ExtLink href={link} target="_blank" className="text-gray-500">
          <Image
            src={unsupportIcons[name]}
            className="mx-auto my-0 block h-8 grayscale"
            height="32"
            width="36"
            alt={name}
          />
        </ExtLink>
      </div>
    )
  }
  const IconComponent = supportIcons[name] || null
  return (
    <div className="m-0 w-24 p-0 text-center">
      <ExtLink
        href={link}
        target="_blank"
        className="inline-block text-gray-500"
      >
        <IconComponent className="text-gray-300" size="2em" />
      </ExtLink>
    </div>
  )
}

const Footer = () => {
  return (
    <>
      <footer
        className="relative shrink bg-lavender-purple-900 py-8 text-base font-normal leading-6 text-current antialiased lg:shrink-0"
        id="footer"
      >
        <section className="mx-auto mb-5 mt-0 flex justify-center">
          {communityFeatures.siteFooterIcon.map(({ name: brand, enable }) => {
            if (!enable) return
            let link
            switch (brand) {
              case 'youtube': {
                link = `${communitySettings[brand]?.channelBaseUrl}/${communitySettings[brand]?.channelHash}`
                break
              }
              case 'musicLogbook': {
                link = `${communitySettings[brand]?.pageUrl}`
                break
              }
              default: {
                link = `${communitySettings[brand]?.profileBaseUrl}/${communitySettings[brand]?.userName}`
              }
            }
            return <CommunityIcon key={brand} link={link} name={brand} />
          })}
        </section>
        <section className="text-center text-white/40">{copyright}</section>
      </footer>
    </>
  )
}

export default Footer
