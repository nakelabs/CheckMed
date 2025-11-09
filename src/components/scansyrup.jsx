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

      {/* Main Content */}
      <div className="px-4 pt-6">
        {/* Scan the Pack Section */}
        <h2 className="text-[28px] font-semibold mb-4" style={{ fontFamily: 'Poppins' }}>
          SCAN THE PACK
        </h2>

        {/* Image Placeholder */}
        <div className="w-full h-80 bg-[#D9D9D9] mb-4 flex items-center justify-center overflow-hidden rounded-lg">
          {packImagePreview ? (
            <img 
              src={packImagePreview} 
              alt="Syrup Pack" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 border-2 border-gray-600 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">No image selected</p>
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

        {/* Options */}
        <div className="text-center mb-6" style={{ fontFamily: 'Poppins' }}>
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

        {/* NAFDAC Registration Input */}
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

export default ScanSyrup
