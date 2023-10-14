import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import classnames from 'classnames'
import ExtLink from './ext-link'
import { meta, navigation as navItems, searchSettings } from '../../site.config'
import { isActivePage } from '../libs/util'
import faviconIcon from '../../public/favicon.ico'
import { DocSearch } from '@docsearch/react'

const themeClassMap = {
  classic: {
    header: 'bg-lavender-purple-300 text-white',
    nav: 'bg-lavender-purple-500 text-white lg:bg-transparent',
    title: 'text-white',
    linkInActive: 'text-white lg:text-white/80 lg:hover:text-white',
    linkActive: 'bg-lavender-purple-300 lg:text-white lg:bg-transparent',
  },
  modern: {
    header: 'text-white bg-black/90 lg:bg-transparent',
    nav: 'bg-lavender-purple-500 lg:bg-transparent',
    title: 'text-white',
    linkInActive:
      'text-white focus:bg-lavender-purple-300 lg:text-white/80 lg:hover:text-white lg:bg-transparent lg:hover:bg-transparent',
    linkActive: 'bg-lavender-purple-300 lg:bg-transparent',
  },
}

const Header = () => {
  const router = useRouter()
  const currentTheme = isActivePage('/', router) ? 'modern' : 'classic'
  const linkClass =
    'box-border items-center border-0 border-white text-base m-0 p-2.5 justify-center flex flex-row flex-nowrap h-12 z-1000 transition duration-300 lg:h-8 font-normal lg:py-1.5 lg:px-2.5'
  const liniInActiveClass = themeClassMap[currentTheme]?.linkInActive || ''
  const linkActiveClass = themeClassMap[currentTheme]?.linkActive || ''

  return (
    <div
      className={classnames(
        'fixed z-9999 min-h-12 w-full px-0 py-2 lg:shrink-0',
        themeClassMap[currentTheme]?.header
      )}
      style={{ transform: 'translateZ(0)' }}
    >
      <div className="mx-auto my-0 max-w-1400 px-5 py-0">
        <header className="relative flex flex-row flex-nowrap text-left">
          <Link href="/">
            <a className="z-1000 flex h-9 flex-row flex-nowrap items-center border-0 border-white">
              <div className="relative mr-2.5 box-content h-9 w-9">
                <Image src={faviconIcon} alt={meta.title} layout="fill" />
              </div>
              <h2
                className={classnames(
                  'relative z-9999 m-0 block text-xl font-semibold',
                  themeClassMap[currentTheme]?.title
                )}
              >
                {meta.title}
              </h2>
            </a>
          </Link>
          <div className="flex lg:relative lg:ml-auto lg:flex lg:h-9">
            <nav className="fixed bottom-auto left-0 right-0 top-0 box-border lg:relative lg:right-auto lg:top-auto lg:h-auto lg:w-auto lg:bg-none">
              <ul
                className={classnames(
                  'mt-13 box-border flex w-full list-none flex-nowrap p-0 lg:m-0 lg:flex lg:w-auto lg:flex-row lg:flex-nowrap lg:bg-none lg:p-0',
                  themeClassMap[currentTheme]?.nav
                )}
              >
                {navItems.map(({ label, page, link, enabled }) => {
                  if (!enabled) {
                    return null
                  }
                  const isActive = isActivePage(page, router)
                  return (
                    <li
                      key={label}
                      className="m-0 flex-auto whitespace-nowrap text-center"
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
            <DocSearch
              appId={searchSettings?.appId}
              apiKey={searchSettings?.apiKey}
              indexName={searchSettings?.indexName}
            />
          </div>
        </header>
      </div>
    </div>
  )
}

export default Header
