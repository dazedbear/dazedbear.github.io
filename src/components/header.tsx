import Link from 'next/link'
import Head from 'next/head'
import ExtLink from './ext-link'
import { useRouter } from 'next/router'
import styles from '../styles/header.module.css'
import { meta, navigation as navItems } from '../lib/site.config'

const Header = () => {
  const isActive = path => {
    const { pathname } = useRouter()
    return path !== '/' && pathname.includes(path)
  }
  const titlePre = navItems.find(({ page }) => isActive(page))?.label

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <Head>
            <title>
              {titlePre ? `${titlePre} · ${meta.title}` : meta.title}
            </title>
            <meta name="description" content={meta.description} />
            <meta name="og:title" content={meta.title} />
            <meta property="og:image" content={meta.image} />
          </Head>
          <Link href="/">
            <a>
              <img src="/favicon.ico" alt={meta.title} />
              <h2>{meta.title}</h2>
            </a>
          </Link>
          <div className={styles.navigation}>
            <nav>
              <ul>
                {navItems.map(({ label, page, link }) => (
                  <li key={label}>
                    {page ? (
                      <Link href={page}>
                        <a
                          className={isActive(page) ? styles.active : undefined}
                        >
                          {label}
                        </a>
                      </Link>
                    ) : (
                      <ExtLink href={link}>{label}</ExtLink>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
      </div>
    </div>
  )
}

export default Header
