import Link from 'next/link'
import ExtLink from './ext-link'
import classnames from 'classnames'
import { useState, useEffect } from 'react'
import debounce from 'lodash/debounce'

/* top breadcrumb for smartphone */
const Breadcrumb = ({ title, enableNavMenu, setNavMenu }) => {
  const hamburgerLineClass =
    'w-full h-0.75 bg-gray-700 my-1 mx-0 rounded-lg transition duration-300 origin-left'
  return (
    <section className="fixed w-full left-0 right-0 z-1000 block lg:hidden">
      <div className="max-w-1100 py-2 px-5 my-0 mx-auto relative bg-gray-200 flex flex-row flex-nowrap box-border overflow-hidden">
        {/* hamburger lines */}
        <div className="h-8 w-5 mr-3 relative">
          <div
            className="absolute top-1 w-full"
            onClick={() => setNavMenu(!enableNavMenu)}
          >
            <div
              className={classnames(hamburgerLineClass, {
                'origin-left transform rotate-45': enableNavMenu,
              })}
            ></div>
            <div
              className={classnames(hamburgerLineClass, {
                invisible: enableNavMenu,
              })}
            ></div>
            <div
              className={classnames(hamburgerLineClass, {
                'origin-left transform -rotate-45': enableNavMenu,
              })}
            ></div>
          </div>
        </div>
        <h2 className="flex-grow font-semibold leading-8 text-gray-700">
          <i className="px-1">›</i>
          <span className="">{title}</span>
        </h2>
        <div></div>
      </div>
    </section>
  )
}

/* left side menu for desktop */
const NavigationMenu = ({
  title,
  items,
  enableNavMenu,
  dimensions: { isMobile },
}) => {
  const itemClass = 'py-1 cursor-pointer'
  const linkClass =
    'text-sm text-gray-500 hover:text-lavender-purple-300 font-normal block cursor-pointer'
  return (
    <section
      className={classnames('lg:mr-12 lg:w-60 lg:pb-10 lg:pt-12 lg:px-0', {
        block: enableNavMenu,
        hidden: !enableNavMenu,
        'fixed w-full z-1000 bg-white left-0 right-0 mt-12 border-t-1 border-gray-500 h-full pt-5 pb-15 px-5': isMobile,
      })}
    >
      <nav>
        {title && (
          <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>
        )}
        <ul className="px-2 py-0">
          {items.map(({ url, label }) => {
            const isRelativePath = /^\/.+/g.test(url)
            if (isRelativePath) {
              return (
                <li key={label} className={itemClass}>
                  <ExtLink href={url || '#'} className={linkClass}>
                    {label}
                  </ExtLink>
                </li>
              )
            }
            return (
              <li key={label} className={itemClass}>
                <Link href={url || '#'}>
                  <a className={linkClass}>{label}</a>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </section>
  )
}

const Menu = props => {
  const [enableNavMenu, setNavMenu] = useState(false)
  const [dimensions, setDimensions] = useState({
    height: 0,
    width: 0,
    isMobile: false,
  })
  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      const height = window.innerHeight
      const width = window.innerWidth
      const { height: oldHeight, width: oldWidth } = dimensions
      setDimensions({ height, width, isMobile: width < 1024 })
      if (oldWidth < 1024 && width >= 1024) {
        setNavMenu(true)
      } else if (oldWidth >= 1024 && width < 1024) {
        setNavMenu(false)
      }
    }, 100)

    debouncedHandleResize()

    window.addEventListener('resize', debouncedHandleResize)

    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  })

  return (
    <>
      <Breadcrumb
        {...props}
        enableNavMenu={enableNavMenu}
        setNavMenu={setNavMenu}
      />
      <NavigationMenu
        {...props}
        enableNavMenu={enableNavMenu}
        dimensions={dimensions}
      />
    </>
  )
}

export default Menu
