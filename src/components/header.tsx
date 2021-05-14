import Link from 'next/link'
import Head from 'next/head'
import classnames from 'classnames'
import ExtLink from './ext-link'
import { meta, navigation as navItems } from '../../site.config'
import { getCurrentPageTitle, isActivePage } from '../libs/client/blog-helpers'

const themeClassMap = {
  original: {
    header: 'bg-lavender-purple-300 text-white',
    nav: 'bg-lavender-purple-500 text-white lg:bg-transparent',
    title: 'text-white',
    linkInActive: 'text-white lg:text-opacity-white-80 lg:hover:text-white',
    linkActive: 'bg-lavender-purple-300 lg:text-white lg:bg-transparent',
  },
  modern: {
    header: 'text-white bg-black bg-opacity-90 lg:bg-transparent',
    nav: 'bg-lavender-purple-500 lg:bg-transparent',
    title: 'text-white',
    linkInActive:
      'text-white focus:bg-lavender-purple-300 lg:text-opacity-white-80 lg:hover:text-white lg:bg-transparent lg:hover:bg-transparent',
    linkActive: 'bg-lavender-purple-300 lg:bg-transparent',
  },
}

const Header = () => {
  let currentTheme = 'original'
  navItems.some(({ page, theme }) => {
    const isActive = isActivePage(page)
    if (isActive && theme) {
      currentTheme = theme
      return true
    }
    return false
  })

  const titlePre = getCurrentPageTitle()
  const linkClass =
    'box-border items-center border-0 border-white text-base m-0 p-2.5 justify-center flex flex-row flex-nowrap h-12 z-10000 transition duration-300 lg:h-8 font-normal lg:py-1.5 lg:px-2.5'
  const liniInActiveClass = themeClassMap[currentTheme]?.linkInActive || ''
  const linkActiveClass = themeClassMap[currentTheme]?.linkActive || ''

  return (
    <div
      className={classnames(
        'fixed w-full z-9999 min-h-12 py-2 px-0 lg:flex-shrink-0',
        themeClassMap[currentTheme]?.header
      )}
      style={{ transform: 'translateZ(0)' }}
    >
      <div className="my-0 mx-auto max-w-1400 py-0 px-5">
        <header className="flex relative text-left flex-nowrap flex-row">
          <Head>
            <title>
              {titlePre ? `${titlePre} · ${meta.title}` : meta.title}
            </title>
            <meta name="description" content={meta.description} />
            <meta name="og:title" content={meta.title} />
            <meta property="og:image" content={meta.image} />
          </Head>
          <Link href="/">
            <a className="items-center border-0 border-white flex flex-row flex-nowrap h-9 z-10000">
              <img
                className="h-full mr-2.5 box-content max-w-full"
                src="/favicon.ico"
                alt={meta.title}
              />
              <h2
                className={classnames(
                  'block text-xl m-0 relative z-9999 font-semibold',
                  themeClassMap[currentTheme]?.title
                )}
              >
                {meta.title}
              </h2>
            </a>
          </Link>
          <div className="lg:h-9 lg:ml-auto lg:relative">
            <nav className="fixed left-0 right-0 top-0 bottom-auto box-border lg:bg-none lg:h-auto lg:relative lg:right-auto lg:top-auto lg:w-auto">
              <ul
                className={classnames(
                  'box-border flex flex-nowrap list-none mt-13 p-0 w-full lg:bg-none lg:flex lg:flex-row lg:flex-nowrap lg:m-0 lg:p-0 lg:w-auto',
                  themeClassMap[currentTheme]?.nav
                )}
              >
                {navItems.map(({ label, page, link }) => {
                  const isActive = isActivePage(page)
                  return (
                    <li
                      key={label}
                      className="flex-auto m-0 text-center whitespace-nowrap"
                    >
                      {page ? (
                        <Link href={page}>
                          <a
                            className={classnames(linkClass, {
                              [linkActiveClass]: isActive,
                              [liniInActiveClass]: !isActive,
                            })}
                          >
                            {label}
                          </a>
                        </Link>
                      ) : (
                        <ExtLink
                          className={classnames(linkClass, {
                            [linkActiveClass]: isActive,
                            [liniInActiveClass]: !isActive,
                          })}
                          href={link}
                        >
                          {label}
                        </ExtLink>
                      )}
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        </header>
      </div>
    </div>
  )
}

export default Header
