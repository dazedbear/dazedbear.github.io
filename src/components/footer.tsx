import classnames from 'classnames'
import ExtLink from './ext-link'
import styles from '../styles/footer.module.css'
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
    <div className={styles['community__tab']}>
      <ExtLink
        href={link}
        target="_blank"
        className={styles['community__tab-link']}
      >
        <i
          className={classnames(
            styles['community__tab-icon'],
            'fab fa-3x',
            `fa-${name}`
          )}
        />
        <p className={styles['community__tab-name']}>{name}</p>
      </ExtLink>
    </div>
  )
}

const Footer = () => {
  const communityIcons = Object.keys(communityFeatures.siteFooterIcon)
  return (
    <>
      <footer className={styles['nav-footer']} id="footer">
        <section className={styles.community}>
          {communityIcons.map(brand => {
            if (!brand || !communityFeatures.siteFooterIcon[brand]) return
            let link
            if (brand === 'youtube') {
              link = `${communitySettings[brand]?.channelBaseUrl}/${communitySettings[brand]?.channelHash}`
            } else {
              link = `${communitySettings[brand]?.profileBaseUrl}/${communitySettings[brand]?.userName}`
            }
            return <CommunityIcon key={brand} link={link} name={brand} />
          })}
        </section>
        <section className={styles.copyright}>{copyright}</section>
      </footer>
    </>
  )
}

export default Footer
