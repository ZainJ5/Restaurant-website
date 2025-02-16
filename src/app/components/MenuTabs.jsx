export default function MenuTabs() {
    const tabs = [
      'Hot Deals',
      'Super Deals',
      'Roll',
      'BBQ',
      'Burger',
      'Broast',
      'Breast',
      'Sandwich',
      'Bun Kebab',
      'Chinese',
    ]
  
    return (
      <>
        <div className="bg-red-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center overflow-x-auto py-3 scrollbar-hide">
              <div className="flex items-center gap-3 mx-auto">
                <button className="text-white shrink-0 focus:outline-none p-1">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
  
                {tabs.map((tab, idx) => (
                  <button
                    key={tab}
                    className={
                      idx === 0
                        ? 'bg-white text-black font-semibold px-4 py-1 rounded-lg whitespace-nowrap text-sm sm:text-base shrink-0 shadow-sm'
                        : 'border border-white text-white font-semibold px-4 py-1 rounded-lg whitespace-nowrap text-sm sm:text-base shrink-0 hover:bg-white/10 transition-colors'
                    }
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
  
        <div className="bg-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center gap-3 sm:gap-4">
              <button className="border border-black text-black px-5 sm:px-6 py-1 rounded-2xl font-medium text-sm sm:text-[15px] hover:bg-gray-50 transition-colors">
                CHICKEN ROLL
              </button>
              <button className="bg-black text-white px-5 sm:px-6 py-1 rounded-2xl font-medium text-sm sm:text-[15px] hover:bg-gray-800 transition-colors">
                BEEF ROLL
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }