import ExtLink from '../components/ext-link'
import classnames from 'classnames'
import { pages } from '../../site.config'

const { music: pageSettings } = pages

const MusicPage = () => {
  const blockClass =
    'relative rounded-md w-full pb-full h-0 shadow-2xl box-border mb-10 last:mb-0 sm:mb-0 sm:col-span-5 sm:row-span-5 lg:cursor-pointer transform hover:scale-105 active:scale-95 transition-all'
  const contentContainerClass =
    'absolute h-full w-full flex flex-col justify-center'
  const contentTitleClass = 'text-2xl lg:text-4xl text-center font-bold px-4'
  const contentDescriptionClass = 'mt-3 sm:mt-5 text-center px-4'
  const blocksClass = [
    'bg-gradient-red active:bg-gradient-red-spread',
    'bg-gradient-yellow active:bg-gradient-yellow-spread sm:col-start-8',
    'bg-gradient-green active:bg-gradient-green-spread sm:row-start-8',
    'bg-gradient-purple active:bg-gradient-purple-spread sm:col-start-8 sm:row-start-8',
  ]
  const blocksData = pageSettings.blocks || []

  return (
    <div className="pt-24 lg:pt-12 min-h-screen w-full bg-cover bg-50% bg-music-cover homeSplashFade bg-brown-300 text-white text-center">
      <div className="inline-block h-screen w-0 align-middle" />
      <div className="w-2/3 lg:w-1/2 max-w-600 mx-auto px-6 py-12 sm:p-12 rounded-md inline-block align-middle ">
        <ul className="sm:grid sm:grid-cols-12 sm:grid-rows-12">
          {blocksData.map(
            ({ title = '', description = '', link = '' }, index) => (
              <li
                key={title}
                className={classnames(blockClass, blocksClass[index])}
              >
                <ExtLink href={link}>
                  <div className={contentContainerClass}>
                    {title && <h2 className={contentTitleClass}>{title}</h2>}
                    {description && (
                      <p className={contentDescriptionClass}>{description}</p>
                    )}
                  </div>
                </ExtLink>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  )
}

export default MusicPage
