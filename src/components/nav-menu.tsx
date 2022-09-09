import Link from 'next/link'
import ExtLink from './ext-link'
import classnames from 'classnames'
import { useAppDispatch, useAppSelector } from '../libs/client/hooks'
import { updateNavMenuViewability } from '../libs/client/slices/layout'

const NavigationMenu = ({ title, menuItems }) => {
  const dispatch = useAppDispatch()
  const isNavMenuViewable = useAppSelector(
    (state) => state.layout.isNavMenuViewable
  )
  const device = useAppSelector((state) => state.layout.device)
  const isMobile = device === 'smartphone'
  const itemClass = 'py-1 cursor-pointer'
  const linkClass =
    'text-sm text-gray-500 hover:text-lavender-purple-300 font-normal block cursor-pointer'
  return (
    <section
      className={classnames(
        'overflow-y-scroll lg:mr-12 lg:mt-12 lg:max-h-full-viewport lg:w-60 lg:shrink-0 lg:px-0 lg:pb-10',
        {
          block: isNavMenuViewable,
          hidden: !isNavMenuViewable,
          'fixed left-0 right-0 top-0 z-970 m-0 h-full w-full bg-white px-5 pt-40 pb-5':
            isMobile,
        }
      )}
    >
      <nav>
        {title && (
          <h3 className="mb-2 text-lg font-medium text-gray-700">{title}</h3>
        )}
        <ul
          className={classnames({
            'px-2 py-0': !isMobile,
            'p-0': isMobile,
          })}
          data-testid="navigation-menu"
        >
          {menuItems.map(({ url, label }) => {
            const isRelativePath = /^\/.+/g.test(url)
            if (isRelativePath) {
              return (
                <li
                  key={label}
                  className={itemClass}
                  onClick={() => {
                    isMobile && dispatch(updateNavMenuViewability(false))
                  }}
                >
                  <Link href={url || '#'}>
                    <a className={linkClass}>{label}</a>
                  </Link>
                </li>
              )
            }
            return (
              <li
                key={label}
                className={itemClass}
                onClick={() => {
                  isMobile && dispatch(updateNavMenuViewability(false))
                }}
              >
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
