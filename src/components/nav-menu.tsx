import Link from 'next/link'
import ExtLink from './ext-link'
import classnames from 'classnames'
import { useSiteContext } from '../lib/context'

const NavigationMenu = ({ title, menuItems }) => {
  const { showNavMenu, device } = useSiteContext()
  const isMobile = device === 'smartphone'
  const itemClass = 'py-1 cursor-pointer'
  const linkClass =
    'text-sm text-gray-500 hover:text-lavender-purple-300 font-normal block cursor-pointer'
  return (
    <section
      className={classnames(
        'overflow-y-scroll lg:mr-12 lg:w-60 lg:pb-10 lg:mt-12 lg:px-0 lg:flex-shrink-0 lg:max-h-full-viewport',
        {
          block: showNavMenu,
          hidden: !showNavMenu,
          'fixed w-full z-990 bg-white left-0 right-0 top-0 m-0 h-full pt-40 pb-5 px-5': isMobile,
        }
      )}
    >
      <nav>
        {title && (
          <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>
        )}
        <ul
          className={classnames({
            'px-2 py-0': !isMobile,
            'p-0': isMobile,
          })}
        >
          {menuItems.map(({ url, label }) => {
            const isRelativePath = /^\/.+/g.test(url)
            if (isRelativePath) {
              return (
                <li key={label} className={itemClass}>
                  <Link href={url || '#'}>
                    <a className={linkClass}>{label}</a>
                  </Link>
                </li>
              )
            }
            return (
              <li key={label} className={itemClass}>
                <ExtLink href={url || '#'} className={linkClass}>
                  {label}
                </ExtLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </section>
  )
}

export default NavigationMenu
