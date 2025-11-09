function Steps({ onNavigateToInputName }) {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Top Header */}
      <div className="h-16 bg-[#ECF6FE] flex items-center px-4">
        <div className="w-8 h-8 border-2 border-gray-400" /> {/* Placeholder for hamburger icon */}
        <h1 className="ml-3 text-[32px] font-black" style={{ fontFamily: 'Poppins' }}>
          <span className="text-white" style={{ WebkitTextStroke: '1px #286595' }}>Check</span>
          <span className="text-[#286595]">Med</span>
        </h1>
      </div>

      {/* Step 1 - Blue Background with Image Left, Text Right */}
      <div className="bg-[#91CBF9] py-12 px-4">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2">
            <div className="w-full h-80 border-2 border-gray-400 bg-[#7AB8E8] flex items-center justify-center">
              <span className="text-gray-600 text-sm">Image</span>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-[32px] font-black text-white mb-4" style={{ fontFamily: 'Poppins' }}>
              1. Step 1
            </h2>
            <p className="text-[#286595] text-sm leading-relaxed" style={{ fontFamily: 'Poppins' }}>
              Lorem ipsum dolor sit amet, consectetur<br />
              adipiscing elit, sed do eiusmod tempor<br />
              incididunt ut labore et dolore magna<br />
              aliqua. Ut enim ad minim veniam, quis<br />
              nostrud exercitation ullamco laboris nis<br />
              i ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </div>

      {/* Step 2 - White Background with Text Left, Image Right */}
      <div className="bg-white py-12 px-4">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2 md:order-1">
            <h2 className="text-[32px] font-black mb-4" style={{ fontFamily: 'Poppins' }}>
              <span className="text-white" style={{ WebkitTextStroke: '1px #286595' }}>1. Step 1</span>
            </h2>
            <p className="text-[#286595] text-sm leading-relaxed" style={{ fontFamily: 'Poppins' }}>
              Lorem ipsum dolor sit amet, consectetur<br />
              adipiscing elit, sed do eiusmod tempor<br />
              incididunt ut labore et dolore magna<br />
              aliqua. Ut enim ad minim veniam, quis<br />
              nostrud exercitation ullamco laboris nis<br />
              i ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div className="w-full md:w-1/2 md:order-2">
            <div className="w-full h-80 border-2 border-gray-400 bg-gray-50 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Image</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3 - Blue Background with Image Left, Text Right */}
      <div className="bg-[#91CBF9] py-12 px-4">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2">
            <div className="w-full h-80 border-2 border-gray-400 bg-[#7AB8E8] flex items-center justify-center">
              <span className="text-gray-600 text-sm">Image</span>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-[32px] font-black text-white mb-4" style={{ fontFamily: 'Poppins' }}>
              1. Step 1
            </h2>
            <p className="text-[#286595] text-sm leading-relaxed" style={{ fontFamily: 'Poppins' }}>
              Lorem ipsum dolor sit amet, consectetur<br />
              adipiscing elit, sed do eiusmod tempor<br />
              incididunt ut labore et dolore magna<br />
              aliqua. Ut enim ad minim veniam, quis<br />
              nostrud exercitation ullamco laboris nis<br />
              i ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="px-4 py-8">
        <button 
          onClick={onNavigateToInputName}
          className="w-full bg-[#286595] rounded-lg py-4 text-white text-lg font-semibold" 
          style={{ fontFamily: 'Poppins' }}
        >
          NEXT
        </button>
      </div>

      {/* Footer */}
      <div className="bg-[#D9D9D9] py-3 px-4">
        <p className="text-black/40 text-xs" style={{ fontFamily: 'Poppins' }}>
          2025. CheckMed. All rights reserved
        </p>
      </div>
    </div>
  )
}

export default Steps
