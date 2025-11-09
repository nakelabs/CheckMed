import { useState, useRef } from 'react'

function ScanSyrup({ onNavigateToNext }) {
  const [currentStep, setCurrentStep] = useState(1) // 1: Scan Pack, 2: NAFDAC
  const [nafdacNumber, setNafdacNumber] = useState('')
  const [packImage, setPackImage] = useState(null)
  const [packImagePreview, setPackImagePreview] = useState(null)
  
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
        setPackImage(file)
        setPackImagePreview(imageData)
      }
      reader.readAsDataURL(file)
    } else {
      alert('Please select a valid image file')
    }
  }

  const handleCheck = () => {
    if (nafdacNumber) {
      console.log('Checking NAFDAC Number:', nafdacNumber)
      // Add NAFDAC verification logic here
      setCurrentStep(2) // Mark NAFDAC as checked
    } else {
      alert('Please enter NAFDAC Registration Number')
    }
  }

  const handleScan = () => {
    if (packImage && nafdacNumber) {
      if (onNavigateToNext) {
        // Prepare data to send to backend
        const scanData = {
          drugType: 'syrup',
          packImage: packImage,
          nafdacNumber: nafdacNumber
        }
        onNavigateToNext(scanData)
      }
    } else {
      alert('Please complete all steps: scan the pack and enter NAFDAC number')
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
          <div className="flex items-center justify-center mb-3">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
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
                  <p className={`text-xs mt-2 text-center transition-colors whitespace-nowrap ${
                    currentStep === step ? 'text-[#286595] font-semibold' : 'text-gray-500'
                  }`} style={{ fontFamily: 'Poppins' }}>
                    {step === 1 ? 'Scan Pack' : 'NAFDAC Number'}
                  </p>
                </div>
                {step < 2 && (
                  <div className={`w-16 md:w-24 h-1 mx-2 transition-colors duration-300 ${
                    currentStep > step ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#B2DAFB]">
          {/* Step Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#62B4F7] to-[#91CBF9] rounded-full flex items-center justify-center text-white font-bold text-lg">
              1
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#286595]" style={{ fontFamily: 'Poppins' }}>
                Scan the Syrup Pack
              </h2>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Poppins' }}>
                Capture a clear photo of the syrup bottle
              </p>
            </div>
          </div>

          {/* Image Placeholder */}
          <div className="relative w-full h-80 bg-gradient-to-br from-[#ECF6FE] to-[#B2DAFB] mb-6 flex items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#286595]/30 shadow-inner">
            {packImagePreview ? (
              <>
                <img 
                  src={packImagePreview} 
                  alt="Syrup Pack" 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => {
                    setPackImage(null);
                    setPackImagePreview(null);
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

          {/* Hidden File Inputs */}
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

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-semibold" style={{ fontFamily: 'Poppins' }}>
                Step 2: Enter NAFDAC Number
              </span>
            </div>
          </div>

          {/* NAFDAC Section */}
          <div className="mb-6">
            {/* Info Box */}
            <div className="bg-[#ECF6FE] border-l-4 border-[#286595] p-4 mb-4 rounded-r-lg">
              <div className="flex gap-3">
                <svg className="w-6 h-6 text-[#286595] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm text-[#286595] font-semibold mb-1" style={{ fontFamily: 'Poppins' }}>
                    Find the NAFDAC Number
                  </p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Poppins' }}>
                    Look for a registration number on the syrup bottle or packaging (e.g., NAFDAC NO: A7-1234)
                  </p>
                </div>
              </div>
            </div>

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

          {/* Summary Card */}
          {packImage && nafdacNumber && (
            <div className="mb-6 bg-[#ECF6FE] rounded-lg p-4">
              <p className="text-xs text-gray-600 font-semibold mb-2" style={{ fontFamily: 'Poppins' }}>
                Review Your Submission:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700" style={{ fontFamily: 'Poppins' }}>Syrup pack image captured</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700" style={{ fontFamily: 'Poppins' }}>NAFDAC: {nafdacNumber}</span>
                </div>
              </div>
            </div>
          )}

          {/* Final Scan Button */}
          <button
            onClick={handleScan}
            className={`w-full py-4 rounded-xl font-bold text-xl transition-all ${
              packImage && nafdacNumber
                ? 'bg-gradient-to-r from-[#286595] to-[#62B4F7] text-white hover:shadow-xl shadow-lg' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            style={{ fontFamily: 'Poppins' }}
            disabled={!packImage || !nafdacNumber}
          >
            🔍 Scan & Verify
          </button>
        </div>
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

export default ScanSyrup
