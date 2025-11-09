import { useState } from 'react'

function InputName({ onNavigateToNext, onNavigateToScanTablet, onNavigateToScanSyrup }) {
  const [medicineName, setMedicineName] = useState('')
  const [drugType, setDrugType] = useState('')
  const progressPercentage = 33 // First step (1 of 3 steps = 33%)

  const handleSearch = () => {
    console.log('Searching for:', medicineName)
    // Add search logic here
  }

  const handleNext = () => {
    if (!medicineName.trim()) {
      alert('Please enter the name of the medication')
      return
    }
    if (!drugType) {
      alert('Please select the drug type')
      return
    }
    
    // Navigate based on drug type and pass the medicine name
    if (drugType === 'tablet' && onNavigateToScanTablet) {
      onNavigateToScanTablet(medicineName)
    } else if (drugType === 'syrup' && onNavigateToScanSyrup) {
      onNavigateToScanSyrup(medicineName)
    } else if (onNavigateToNext) {
      onNavigateToNext()
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Top Header */}
      <div className="h-16 bg-[#ECF6FE] flex items-center px-4">
        <img src="/images/image.png" alt="CheckMed Logo" className="h-14" />
        <h1 className="ml-3 text-[32px] font-black" style={{ fontFamily: 'Poppins' }}>
          <span className="text-white" style={{ WebkitTextStroke: '1px #286595' }}>Check</span>
          <span className="text-[#286595]">Med</span>
        </h1>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-4 bg-[#D9D9D9] relative">
        <div 
          className="h-full bg-[#2E73AC] transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="px-4 pt-20 pb-12">
        <h2 className="text-[28px] font-semibold mb-12 leading-tight" style={{ fontFamily: 'Poppins' }}>
          Input the name of the medication you want to verify...
        </h2>

        {/* Input and Search Section */}
        <div className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="Name of the medicine"
              className="flex-1 h-14 bg-[#ECF6FE] px-4 text-base placeholder-[#286595]/40 rounded"
              style={{ fontFamily: 'Poppins' }}
            />
            <button
              onClick={handleSearch}
              className="w-44 h-14 bg-[#62B4F7] rounded-md text-white text-base font-semibold"
              style={{ fontFamily: 'Poppins' }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Drug Type Dropdown */}
        <div className="mb-12">
          <select
            value={drugType}
            onChange={(e) => setDrugType(e.target.value)}
            className="w-full h-14 bg-[#ECF6FE] px-4 text-base text-[#286595] rounded appearance-none cursor-pointer"
            style={{ fontFamily: 'Poppins' }}
          >
            <option value="" disabled>Select drug type</option>
            <option value="syrup">Syrup (Bottle)</option>
            <option value="tablet">Tablet</option>
          </select>
        </div>

        {/* Next Button */}
        <div className="mt-32">
          <button
            onClick={handleNext}
            className="w-full bg-[#286595] rounded-lg py-5 text-white text-[28px] font-semibold"
            style={{ fontFamily: 'Poppins' }}
          >
            NEXT
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full bg-[#D9D9D9] py-3 px-4">
        <p className="text-black/40 text-xs" style={{ fontFamily: 'Poppins' }}>
          2025. CheckMed. All rights reserved
        </p>
      </div>
    </div>
  )
}

export default InputName
