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
    <div className="min-h-screen bg-white relative overflow-hidden pb-20">
      {/* Top Header */}
      <div className="h-16 bg-[#ECF6FE] flex items-center px-4">
        <div className="w-8 h-8 border-2 border-gray-400" /> {/* Placeholder for hamburger icon */}
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
      <div className="px-4 pt-6">
        {/* Step 1: Scan the Packaging */}
        {currentStep === 1 && (
          <>
            <h2 className="text-[28px] font-semibold mb-4" style={{ fontFamily: 'Poppins' }}>
              SCAN THE PACKAGING.
            </h2>

            {/* Image Placeholder */}
            <div className="w-full h-80 bg-[#D9D9D9] mb-4 flex items-center justify-center overflow-hidden rounded-lg">
              {packagingImagePreview ? (
                <img 
                  src={packagingImagePreview} 
                  alt="Packaging" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 border-2 border-gray-600 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No image selected</p>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="text-center mb-12" style={{ fontFamily: 'Poppins' }}>
              <button 
                onClick={handleChooseFromLibrary} 
                className="text-base text-[#286595] hover:underline"
              >
                choose from library
              </button>
              <span className="mx-2 text-base">or</span>
              <button 
                onClick={handleTakePhoto} 
                className="text-base text-[#286595] hover:underline"
              >
                take photo
              </button>
            </div>

            {/* Next Button */}
            <div className="mb-8">
              <button
                onClick={handleNextFromPackaging}
                className="w-full bg-[#286595] rounded-lg py-5 text-white text-[28px] font-semibold"
                style={{ fontFamily: 'Poppins' }}
              >
                NEXT
              </button>
            </div>
          </>
        )}

        {/* Step 2: NAFDAC Registration Input */}
        {currentStep === 2 && (
          <>
            <h2 className="text-[28px] font-semibold mb-12" style={{ fontFamily: 'Poppins' }}>
              Enter NAFDAC Registration Number
            </h2>

            {/* NAFDAC Input */}
            <div className="mb-12">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={nafdacNumber}
                  onChange={(e) => setNafdacNumber(e.target.value)}
                  placeholder="NAFDAC Registration No."
                  className="flex-1 h-14 bg-[#ECF6FE] px-4 text-base placeholder-[#286595]/40 rounded"
                  style={{ fontFamily: 'Poppins' }}
                />
                <button
                  onClick={handleCheck}
                  className="w-44 h-14 bg-[#62B4F7] rounded-md text-white text-base font-semibold"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Check
                </button>
              </div>
            </div>
          </>
        )}

        {/* Step 3: Scan the Blister Pack */}
        {currentStep === 3 && (
          <>
            <h2 className="text-[28px] font-semibold mb-4" style={{ fontFamily: 'Poppins' }}>
              SCAN THE BLISTER PACK
            </h2>

            {/* Image Placeholder */}
            <div className="w-full h-80 bg-[#D9D9D9] mb-4 flex items-center justify-center overflow-hidden rounded-lg">
              {blisterPackImagePreview ? (
                <img 
                  src={blisterPackImagePreview} 
                  alt="Blister Pack" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 border-2 border-gray-600 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No image selected</p>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="text-center mb-12" style={{ fontFamily: 'Poppins' }}>
              <button 
                onClick={handleChooseFromLibrary} 
                className="text-base text-[#286595] hover:underline"
              >
                choose from library
              </button>
              <span className="mx-2 text-base">or</span>
              <button 
                onClick={handleTakePhoto} 
                className="text-base text-[#286595] hover:underline"
              >
                take photo
              </button>
            </div>

            {/* Scan Button */}
            <div className="mb-8">
              <button
                onClick={handleScan}
                className="w-full bg-[#286595] rounded-lg py-5 text-white text-[28px] font-semibold"
                style={{ fontFamily: 'Poppins' }}
              >
                SCAN
              </button>
            </div>
          </>
        )}
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

export default ScanTablet
