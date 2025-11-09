import { useEffect, useState } from 'react'
import axios from 'axios'

function Verify({ scanData, onVerificationComplete }) {
  const [error, setError] = useState(null)
  const progressPercentage = 100 // Final step (100%)

  useEffect(() => {
    const verifyMedication = async () => {
      try {
        // Create FormData to send images and data
        const formData = new FormData()
        
        // Log what we're sending
        console.log('Sending verification request with:', {
          drugName: scanData.drugName,
          nafdacNumber: scanData.nafdacNumber,
          drugType: scanData.drugType,
          hasPackagingImage: !!scanData.packagingImage,
          hasBlisterPackImage: !!scanData.blisterPackImage,
          hasPackImage: !!scanData.packImage
        })
        
        // Add drug name
        formData.append('drug_name', scanData.drugName)
        
        // Add NAFDAC number
        formData.append('nafdac_number', scanData.nafdacNumber)
        
        if (scanData.drugType === 'tablet') {
          // For tablets: box_image and blister_pack_image
          formData.append('box_image', scanData.packagingImage)
          formData.append('blister_pack_image', scanData.blisterPackImage)
        } else if (scanData.drugType === 'syrup') {
          // For syrup: box_image (pack image)
          formData.append('box_image', scanData.packImage)
        }

        console.log('Making API request to: https://checkmed-2q81.onrender.com/api/verify/verify')

        // Make API call to backend
        const response = await axios.post(
          'https://checkmed-2q81.onrender.com/api/verify/verify',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )

        console.log('API Response:', response)

        // The API returns a string response on success (200)
        // We'll treat 200 response as authentic
        if (onVerificationComplete) {
          onVerificationComplete({
            isAuthentic: true,
            message: response.data,
            nafdacVerified: true,
            matchPercentage: 100
          })
        }
      } catch (err) {
        console.error('Verification error details:', {
          message: err.message,
          response: err.response,
          status: err.response?.status,
          data: err.response?.data
        })
        
        // Handle validation errors (422) or other errors
        let errorMessage = 'Failed to verify medication. Please try again.'
        
        if (err.response?.data?.detail) {
          // Handle FastAPI validation error format
          if (Array.isArray(err.response.data.detail)) {
            errorMessage = err.response.data.detail.map(e => e.msg).join(', ')
          } else {
            errorMessage = err.response.data.detail
          }
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message
        } else if (err.message) {
          errorMessage = err.message
        }
        
        setError(errorMessage)
        
        // Wait 3 seconds before showing result
        setTimeout(() => {
          if (onVerificationComplete) {
            // If 422 validation error, it might mean fake/invalid
            onVerificationComplete({
              isAuthentic: false,
              error: true,
              message: errorMessage,
              nafdacVerified: false,
              matchPercentage: 0
            })
          }
        }, 3000)
      }
    }

    if (scanData) {
      verifyMedication()
    }
  }, [scanData, onVerificationComplete])

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Top Header */}
      <div className="h-16 bg-[#ECF6FE] flex items-center px-4">
        <img src="/images/image.png" alt="CheckMed Logo" className="h-10" />
        <h1 className="ml-3 text-[32px] font-black" style={{ fontFamily: 'Poppins' }}>
          <span className="text-white" style={{ WebkitTextStroke: '1px #286595' }}>Check</span>
          <span className="text-[#286595]">Med</span>
        </h1>
      </div>

      {/* Progress Bar - Full */}
      <div className="w-full h-4 bg-[#D9D9D9] relative">
        <div 
          className="h-full bg-[#2E73AC] transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Main Content - Centered Loading */}
      <div className="flex flex-col items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 160px)' }}>
        {/* Image Placeholder */}
        <div className="w-64 h-64 border-2 border-gray-300 mb-12 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Image Preview</span>
        </div>

        {/* Loading Spinner */}
        <div className="mb-4">
          <div 
            className="w-10 h-10 border-[5px] border-[#2E73AC] border-t-transparent rounded-full animate-spin"
          />
        </div>

        {/* Loading Text */}
        <p className="text-[#42A5F5] text-base" style={{ fontFamily: 'Poppins' }}>
          {error ? error : 'AI is verifying......'}
        </p>
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

export default Verify
