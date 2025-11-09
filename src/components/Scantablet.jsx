import { useState, useRef } from 'react'

function ScanTablet({ onNavigateToNext }) {
  const [currentStep, setCurrentStep] = useState(1) // 1: Packaging, 2: NAFDAC, 3: Blister Pack
  const [nafdacNumber, setNafdacNumber] = useState('')
  const [packagingImage, setPackagingImage] = useState(null)
  const [blisterPackImage, setBlisterPackImage] = useState(null)
  const [packagingImagePreview, setPackagingImagePreview] = useState(null)
  const [blisterPackImagePreview, setBlisterPackImagePreview] = useState(null)
  
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  
  const progressPercentage = 66 // Second step (2 of 3 steps = 66%)

  const handleChooseFromLibrary = () => {
    // Trigger file input click
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleTakePhoto = () => {
    // Trigger camera input click
    if (cameraInputRef.current) {
      cameraInputRef.current.click()
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageData = reader.result
        if (currentStep === 1) {
          setPackagingImage(file)
          setPackagingImagePreview(imageData)
        } else if (currentStep === 3) {
          setBlisterPackImage(file)
          setBlisterPackImagePreview(imageData)
        }
      }
      reader.readAsDataURL(file)
    } else {
      alert('Please select a valid image file')
    }
  }

  const handleNextFromPackaging = () => {
    if (packagingImage) {
      setCurrentStep(2) // Move to NAFDAC input
    } else {
      alert('Please scan or upload the packaging image first')
    }
  }

  const handleCheck = () => {
    if (nafdacNumber) {
      console.log('Checking NAFDAC Number:', nafdacNumber)
      // Add NAFDAC verification logic here
      setCurrentStep(3) // Move to Blister Pack scan
    } else {
      alert('Please enter NAFDAC Registration Number')
    }
  }

  const handleScan = () => {
    if (blisterPackImage) {
      if (onNavigateToNext) {
        // Prepare data to send to backend
        const scanData = {
          drugType: 'tablet',
          packagingImage: packagingImage,
          blisterPackImage: blisterPackImage,
          nafdacNumber: nafdacNumber
        }
        onNavigateToNext(scanData)
      }
    } else {
      alert('Please scan or upload the blister pack image first')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ECF6FE] to-white relative overflow-hidden pb-20">
      {/* Top Header */}
      <div className="h-16 bg-[#ECF6FE] flex items-center px-4 shadow-sm">
        <img src="/images/image.png" alt="CheckMed Logo" className="h-14" />
        <h1 className="ml-3 text-[32px] font-black" style={{ fontFamily: 'Poppins' }}>
          <span className="text-white" style={{ WebkitTextStroke: '1px #286595' }}>Check</span>
          <span className="text-[#286595]">Med</span>
        </h1>
      </div>

      {/* Step Progress Indicator */}
      <div className="bg-white py-6 px-4 shadow-sm">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep === step
                      ? 'bg-[#286595] text-white shadow-lg scale-110'
                      : currentStep > step
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`} style={{ fontFamily: 'Poppins' }}>
                    {currentStep > step ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : step}
                  </div>
                  <p className={`text-xs mt-2 text-center transition-colors ${
                    currentStep === step ? 'text-[#286595] font-semibold' : 'text-gray-500'
                  }`} style={{ fontFamily: 'Poppins' }}>
                    {step === 1 ? 'Packaging' : step === 2 ? 'NAFDAC' : 'Blister Pack'}
                  </p>
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 transition-colors duration-300 ${
                    currentStep > step ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden File Inputs - Always available for all steps */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 pt-8">
        {/* Step 1: Scan the Packaging */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#B2DAFB]">
            {/* Step Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#62B4F7] to-[#91CBF9] rounded-full flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#286595]" style={{ fontFamily: 'Poppins' }}>
                  Scan the Packaging
                </h2>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Poppins' }}>
                  Capture a clear photo of the drug box
                </p>
              </div>
            </div>

            {/* Image Placeholder */}
            <div className="relative w-full h-80 bg-gradient-to-br from-[#ECF6FE] to-[#B2DAFB] mb-6 flex items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#286595]/30 shadow-inner">
              {packagingImagePreview ? (
                <>
                  <img 
                    src={packagingImagePreview} 
                    alt="Packaging" 
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={() => {
                      setPackagingImage(null);
                      setPackagingImagePreview(null);
                    }}
                    className="absolute top-3 right-3 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <div className="text-center p-6">
                  <svg className="w-20 h-20 mx-auto text-[#286595]/40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-[#286595] font-semibold text-lg mb-1" style={{ fontFamily: 'Poppins' }}>No image captured yet</p>
                  <p className="text-gray-500 text-sm" style={{ fontFamily: 'Poppins' }}>Choose an option below to continue</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                onClick={handleTakePhoto} 
                className="flex flex-col items-center justify-center py-6 bg-gradient-to-br from-[#62B4F7] to-[#91CBF9] text-white rounded-xl hover:shadow-lg transition-all"
                style={{ fontFamily: 'Poppins' }}
              >
                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-semibold text-base">Take Photo</span>
              </button>
              <button 
                onClick={handleChooseFromLibrary} 
                className="flex flex-col items-center justify-center py-6 bg-white border-2 border-[#286595] text-[#286595] rounded-xl hover:bg-[#ECF6FE] transition-all"
                style={{ fontFamily: 'Poppins' }}
              >
                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold text-base">Choose from Library</span>
              </button>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextFromPackaging}
              className={`w-full rounded-xl py-4 text-white text-xl font-bold transition-all ${
                packagingImage 
                  ? 'bg-[#286595] hover:bg-[#1e4a6b] shadow-lg' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
              style={{ fontFamily: 'Poppins' }}
              disabled={!packagingImage}
            >
              Continue to NAFDAC Number
            </button>
          </div>
        )}

        {/* Step 2: NAFDAC Registration Input */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#B2DAFB]">
            {/* Step Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#62B4F7] to-[#91CBF9] rounded-full flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#286595]" style={{ fontFamily: 'Poppins' }}>
                  NAFDAC Registration
                </h2>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Poppins' }}>
                  Enter the registration number from the package
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-[#ECF6FE] border-l-4 border-[#286595] p-4 mb-6 rounded-r-lg">
              <div className="flex gap-3">
                <svg className="w-6 h-6 text-[#286595] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm text-[#286595] font-semibold mb-1" style={{ fontFamily: 'Poppins' }}>
                    Find the NAFDAC Number
                  </p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Poppins' }}>
                    Look for a registration number on the drug packaging (e.g., NAFDAC NO: A7-1234)
                  </p>
                </div>
              </div>
            </div>

            {/* NAFDAC Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#286595] mb-2" style={{ fontFamily: 'Poppins' }}>
                NAFDAC Registration Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nafdacNumber}
                  onChange={(e) => setNafdacNumber(e.target.value.toUpperCase())}
                  placeholder="e.g., A7-1234"
                  className="w-full h-14 bg-[#ECF6FE] px-4 pr-12 text-lg placeholder-gray-400 rounded-xl border-2 border-transparent focus:border-[#286595] focus:outline-none transition-colors"
                  style={{ fontFamily: 'Poppins' }}
                />
                {nafdacNumber && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                style={{ fontFamily: 'Poppins' }}
              >
                ← Back
              </button>
              <button
                onClick={handleCheck}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${
                  nafdacNumber 
                    ? 'bg-[#286595] text-white hover:bg-[#1e4a6b] shadow-lg' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                style={{ fontFamily: 'Poppins' }}
                disabled={!nafdacNumber}
              >
                Verify & Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Scan the Blister Pack */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#B2DAFB]">
            {/* Step Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#62B4F7] to-[#91CBF9] rounded-full flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#286595]" style={{ fontFamily: 'Poppins' }}>
                  Scan the Blister Pack
                </h2>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Poppins' }}>
                  Capture a clear photo of the pills/tablets
                </p>
              </div>
            </div>

            {/* Image Placeholder */}
            <div className="relative w-full h-80 bg-gradient-to-br from-[#ECF6FE] to-[#B2DAFB] mb-6 flex items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#286595]/30 shadow-inner">
              {blisterPackImagePreview ? (
                <>
                  <img 
                    src={blisterPackImagePreview} 
                    alt="Blister Pack" 
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={() => {
                      setBlisterPackImage(null);
                      setBlisterPackImagePreview(null);
                    }}
                    className="absolute top-3 right-3 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <div className="text-center p-6">
                  <svg className="w-20 h-20 mx-auto text-[#286595]/40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="text-[#286595] font-semibold text-lg mb-1" style={{ fontFamily: 'Poppins' }}>No image captured yet</p>
                  <p className="text-gray-500 text-sm" style={{ fontFamily: 'Poppins' }}>Choose an option below to continue</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                onClick={handleTakePhoto} 
                className="flex flex-col items-center justify-center py-6 bg-gradient-to-br from-[#62B4F7] to-[#91CBF9] text-white rounded-xl hover:shadow-lg transition-all"
                style={{ fontFamily: 'Poppins' }}
              >
                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-semibold text-base">Take Photo</span>
              </button>
              <button 
                onClick={handleChooseFromLibrary} 
                className="flex flex-col items-center justify-center py-6 bg-white border-2 border-[#286595] text-[#286595] rounded-xl hover:bg-[#ECF6FE] transition-all"
                style={{ fontFamily: 'Poppins' }}
              >
                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold text-base">Choose from Library</span>
              </button>
            </div>

            {/* Final Scan Button */}
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                style={{ fontFamily: 'Poppins' }}
              >
                ← Back
              </button>
              <button
                onClick={handleScan}
                className={`flex-1 py-4 rounded-xl font-bold text-xl transition-all ${
                  blisterPackImage 
                    ? 'bg-gradient-to-r from-[#286595] to-[#62B4F7] text-white hover:shadow-xl shadow-lg' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                style={{ fontFamily: 'Poppins' }}
                disabled={!blisterPackImage}
              >
                🔍 Scan & Verify
              </button>
            </div>

            {/* Summary Card */}
            <div className="mt-6 bg-[#ECF6FE] rounded-lg p-4">
              <p className="text-xs text-gray-600 font-semibold mb-2" style={{ fontFamily: 'Poppins' }}>
                Review Your Submission:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700" style={{ fontFamily: 'Poppins' }}>Packaging image captured</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700" style={{ fontFamily: 'Poppins' }}>NAFDAC: {nafdacNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  {blisterPackImage ? (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={blisterPackImage ? "text-gray-700" : "text-gray-400"} style={{ fontFamily: 'Poppins' }}>
                    Blister pack {blisterPackImage ? 'captured' : 'pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full bg-[#286595] py-4 px-4">
        <p className="text-white/80 text-xs text-center" style={{ fontFamily: 'Poppins' }}>
          © 2025 CheckMed. All rights reserved. Protecting Nigeria from counterfeit medications.
        </p>
      </div>
    </div>
  )
}

export default ScanTablet
