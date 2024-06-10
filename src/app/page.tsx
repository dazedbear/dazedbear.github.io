'use client'

import { meta } from '../../site.config'

const Homepage = () => (
  <div className="homeContainer text-center">
    <div className="homeSplashFade flex min-h-screen items-center justify-center bg-cover-music bg-cover bg-50% pt-24 lg:pt-12">
      <div className="wrapper homeWrapper m-0 w-full bg-black/20 px-0 py-14">
        <h2 className="projectTitle mx-auto mb-2 inline-block bg-texture-colorful bg-contain bg-clip-text font-serif text-5.5xl font-semibold text-transparent md:text-8xl">
          {meta.title}
        </h2>
        <div className="mx-auto my-0 h-1 w-2/5 bg-gradient-yellow-purple"></div>
        <small className="mx-0 mb-5 mt-3 block font-serif text-xl font-normal text-white md:text-2xl">
          {meta.description}
        </small>
      </div>
    </div>
  </div>
)

export default Homepage
