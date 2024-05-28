'use client'

import ExtLink from '../../components/ext-link'

const MaintainPage = () => (
  <div className="homeContainer text-center">
    <div className="homeSplashFade flex min-h-screen items-center justify-center bg-opacity-50 bg-cover-maintain bg-cover bg-50% pt-24 lg:pt-12">
      <div className="wrapper homeWrapper mx-auto my-0 max-w-1100 px-8 py-8">
        <div>
          <div className="feature-topic paddingBottom paddingTop container mx-auto my-0 rounded-xl bg-white/75 pb-10 pt-10 md:pb-20 md:pt-20">
            <div className="wrapper mx-auto my-0 max-w-900 px-5 py-0 font-semibold text-gray-600">
              <div className="flex p-0">
                目前本頁面正在進行維修作業中，非常抱歉造成您的不便！
                <br />
                <br /> This page is under maintenance and will come back soon.
                Sorry for your inconvenience.
              </div>
            </div>
          </div>
          <p className="unsplash-hint mx-0 my-4 text-center text-sm text-gray-300">
            Photo by
            <ExtLink
              className="mx-1 my-0 inline-block font-bold text-amber-300"
              href="https://unsplash.com/@cookiethepom?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            >
              Cookie the Pom
            </ExtLink>
            on
            <ExtLink
              className="mx-1 my-0 inline-block font-bold text-amber-300"
              href="https://unsplash.com/"
            >
              Unsplash
            </ExtLink>
            .
          </p>
        </div>
      </div>
    </div>
  </div>
)

export default MaintainPage
