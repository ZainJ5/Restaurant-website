import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative">
        <div className="relative rounded-full border-4 border-yellow-400 w-32 h-32 
                        bg-white absolute left-1/2 top-[-50px] transform -translate-x-1/2 -translate-y-1/2 z-10 overflow-hidden">
          <Image src="/Logo.jpeg" alt="Logo" layout="fill" objectFit="cover" />
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold">Restaurant Name</h2>

          <p className="mt-2">
            <Link href="#" className="text-blue-600 hover:underline">
              Location Address Complete with google map link
            </Link>
          </p>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            The best food in Town! Established in 1993. At the time of opening we started
            with the bun kabab's but now we have opened the complete FAST FOOD and BAR-B-Q.
            Just all pure are being used here.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-12">
            <div>
              <h3 className="font-semibold">UAN Number</h3>
              <p>021-111 222 3333</p>
            </div>
            
            <div className="sm:border-x sm:px-8 sm:border-x-gray-500">
              <h3 className="font-semibold">WhatsApp</h3>
              <p>0300 123 4567</p>
            </div>

            <div>
              <h3 className="font-semibold">Timing</h3>
              <p>11:30 am to 3:30 am</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full h-36">
        <div className="bg-blue-600 flex-1"></div>
        <div className="bg-red-600 flex-1"></div>
        <div className="bg-yellow-500 flex-1"></div>
        <div className="bg-green-500 flex-1"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center py-12 sm:px-6 lg:px-8 text-center space-y-8 sm:space-y-0">
        <h3 className="text-3xl pl-8 font-bold">Download Our App!</h3>

        <div className="flex justify-center space-x-4">
          <Link
            href="https://apps.apple.com/de/app/stihl/id382028262"
            target="_blank"
            title="Download on the App Store"
            className="relative inline-block m-[5px] pt-[15px] pr-[16px] pb-[5px] pl-[40px] text-lg leading-[1.33] rounded-md whitespace-nowrap cursor-pointer select-none border border-black font-semibold bg-[#111] text-white no-underline hover:bg-[#2c2b2b] focus:bg-[#555] active:bg-[#555] focus:outline-none"
          >
            <span
              className="absolute left-[6px] top-1/2 -translate-y-1/2 w-[30px] h-[30px] bg-cover bg-no-repeat"
                style={{ backgroundImage: `url('/apple.png')` }}
            ></span>
            <span className="absolute top-[5px] left-[40px] text-[10px] font-normal">
              Download on the
            </span>
            App Store
          </Link>

          <Link
            href="https://play.google.com/store/apps/details?id=com.stihl.app&hl=en"
            target="_blank"
            title="Google Play"
            className="relative inline-block m-[5px] pt-[15px] pr-[16px] pb-[5px] pl-[40px] text-lg leading-[1.33] rounded-md whitespace-nowrap cursor-pointer select-none border border-black font-semibold bg-[#111] text-white no-underline hover:bg-[#2c2b2b] focus:bg-[#555] active:bg-[#555] focus:outline-none"
          >
            <span
              className="absolute left-[6px] top-1/2 -translate-y-1/2 w-[30px] h-[30px] bg-cover bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://4.bp.blogspot.com/-52U3eP2JDM4/WSkIT1vbUxI/AAAAAAAArQA/iF1BeARv2To-2FGQU7V6UbNPivuv_lccACLcB/s30/nexus2cee_ic_launcher_play_store_new-1.png')",
              }}
            ></span>
            <span className="absolute top-[5px] left-[40px] text-[10px] font-normal">
              GET IT ON
            </span>
            Google Play
          </Link>
        </div>
      </div>

      <div className="bg-[rgb(76,76,76)] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between text-sm text-white space-y-4 sm:space-y-0">
            <p>Powered by Name.</p>
            <div className="space-x-4">
              <Link href="#" className="hover:underline">
                Terms &amp; Conditions
              </Link>
              <Link href="#" className="hover:underline">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:underline">
                Returns &amp; Refund
              </Link>
              <Link href="#" className="hover:underline">
                Faqs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
