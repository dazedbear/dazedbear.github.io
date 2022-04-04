import ExtLink from '../components/ext-link'

const MaintainPage = () => (
  <div className="text-center homeContainer">
    <div className="min-h-screen pt-24 lg:pt-12 bg-cover bg-50% bg-opacity-50 bg-cover-maintain homeSplashFade flex items-center justify-center">
      <div className="my-0 mx-auto max-w-1100 py-8 px-8 wrapper homeWrapper">
        <div>
          <div className="pb-10 pt-10 my-0 mx-auto md:pb-20 md:pt-20 bg-opacity-white-75 rounded-xl container feature-topic paddingBottom paddingTop">
            <div className="my-0 mx-auto max-w-900 py-0 px-5 text-gray-600 font-semibold wrapper">
              <div className="p-0 flex">
                目前本頁面正在進行維修作業中，非常抱歉造成您的不便！
                <br />
                <br /> This page is under maintenance and will come back soon.
                Sorry for your inconvenience.
              </div>
            </div>
          </div>
          <p className="my-4 mx-0 text-center text-gray-300 text-sm unsplash-hint">
            Photo by
            <ExtLink
              className="inline-block my-0 mx-1 font-bold text-yellow-300"
              href="https://unsplash.com/@cookiethepom?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            >
              Cookie the Pom
            </ExtLink>
            on
            <ExtLink
              className="inline-block my-0 mx-1 font-bold text-yellow-300"
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
