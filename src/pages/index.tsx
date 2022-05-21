import { meta } from '../../site.config'

const Homepage = () => (
  <div className="text-center homeContainer">
    <div className="min-h-screen pt-24 lg:pt-12 bg-cover bg-50% bg-cover-music homeSplashFade flex items-center justify-center">
      <div className="m-0 py-14 px-0 wrapper homeWrapper w-full bg-black/20">
        <h2 className="inline-block font-serif text-transparent text-5.5xl mb-2 md:text-8xl font-semibold mx-auto projectTitle bg-contain bg-texture-colorful bg-clip-text">
          {meta.title}
        </h2>
        <div className="w-2/5 mx-auto my-0 h-1 bg-gradient-yellow-purple"></div>
        <small className="block font-normal font-serif text-white text-xl md:text-2xl mt-3 mb-5 mx-0">
          {meta.description}
        </small>
      </div>
    </div>
  </div>
)

export default Homepage
