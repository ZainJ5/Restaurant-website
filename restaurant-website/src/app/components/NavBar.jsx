import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
    return (
        <div className="relative">
            {/* Logo - Adjusted for better mobile positioning */}
            <div className="absolute top-0 left-0 z-10 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white rounded-full border-[3px] sm:border-4 border-yellow-400 overflow-hidden ml-4 sm:ml-8 md:ml-12 -mt-1 sm:-mt-2 md:-mt-4">
                <div className="w-full h-full flex items-center justify-center bg-yellow-100 p-2">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold leading-tight">LOGO</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="pt-14 sm:pt-20 md:pt-28 lg:pt-32 pb-2 md:pb-4">
                <div className="max-w-7xl mx-auto px-3 sm:px-5 md:px-8">
                    {/* Flex Container - Improved mobile stacking */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 md:gap-6">
                        
                        {/* Restaurant Info - Optimized for mobile */}
                        <div className="flex flex-col text-center sm:text-left mt-6 sm:mt-0">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 sm:mb-1">
                                Restaurant Name
                            </h1>
                            <div className="flex flex-col gap-1 sm:gap-2">
                                <div className="text-red-600 text-xs sm:text-sm md:text-base">
                                    <span>Open: </span>
                                    <span className="font-normal text-black">11:30 am to 3:30 am</span>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-red-600 text-xs sm:text-sm md:text-base">
                                    <div className="flex items-center gap-1">
                                        <span>Branch:</span>
                                        <span className="font-normal text-black">Clifton</span>
                                    </div>
                                    <Link href="#" className="underline hover:text-red-700 text-[11px] sm:text-xs">
                                        Change Location
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Info - Better mobile layout */}
                        <div className="bg-white rounded-md px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 shadow-[0_0_8px_rgba(0,0,0,0.1)] sm:shadow-[0_0_10px_rgba(0,0,0,0.2)] w-full max-w-xs sm:max-w-none sm:w-auto">
                            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 md:gap-6">
                                <div className="flex flex-col items-center">
                                    <span className="text-black font-semibold text-sm sm:text-base">30-45 mins</span>
                                    <span className="text-gray-600 text-[11px] sm:text-xs">Delivery Time</span>
                                </div>
                                <div className="hidden sm:block w-px h-8 bg-gray-300"></div>
                                <div className="flex flex-col items-center">
                                    <span className="text-black font-semibold text-sm sm:text-base">Rs. 500 Only</span>
                                    <span className="text-gray-600 text-[11px] sm:text-xs">Minimum Order</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Icons - Mobile-optimized spacing */}
                        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                            {[
                                { src: '/download.png', bg: 'bg-red-700' },
                                { src: '/whatsapp.png', bg: 'bg-green-500' },
                                { src: '/phone.png', bg: 'bg-blue-500' },
                                { src: '/facebook.png', bg: 'bg-blue-600' },
                                { src: '/instagram.png', bg: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500' }
                            ].map((item, index) => (
                                <Link
                                    key={index}
                                    href="#"
                                    className={`${item.bg} rounded flex items-center justify-center p-1.5 sm:p-2 hover:opacity-90 transition-opacity`}
                                    style={{ minWidth: '32px', minHeight: '32px' }}
                                >
                                    <Image 
                                        src={item.src} 
                                        alt="Social" 
                                        width={20} 
                                        height={20} 
                                        className="w-4 h-4 sm:w-5 sm:h-5"
                                    />
                                </Link>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}