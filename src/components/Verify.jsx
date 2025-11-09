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
        
        // Add drug name
        formData.append('drug_name', scanData.drugName)
        
        // Add drug type
        formData.append('drug_type', scanData.drugType)
        
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

        // Make API call to backend
        const response = await axios.post(
          'https://checkmed-2q81.onrender.com/api/verify/',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )

        // The API returns a string response on success (200)
        // We'll treat 200 response as authentic
        // Wait 2 seconds to show the loading animation
        setTimeout(() => {
          if (onVerificationComplete) {
            onVerificationComplete({
              isAuthentic: true,
              message: response.data,
              nafdacVerified: true,
              matchPercentage: 100
            })
          }
        }, 2000)
      } catch (err) {
        // Handle validation errors (422) or other errors
        let errorMessage = 'Failed to verify medication. Please try again.'
        let errorData = null
        
        if (err.response?.data?.detail) {
          // Handle FastAPI validation error format
          if (Array.isArray(err.response.data.detail)) {
            errorMessage = err.response.data.detail.map(e => e.msg).join(', ')
          } else if (typeof err.response.data.detail === 'string') {
            errorMessage = err.response.data.detail
          } else if (typeof err.response.data.detail === 'object') {
            // detail is an object with status, reason, etc.
            errorData = err.response.data.detail
            if (errorData.status && errorData.reason) {
              errorMessage = `${errorData.status}: ${errorData.reason}`
              if (errorData.expected_nafdac && errorData.provided_nafdac) {
                errorMessage += `\nExpected: ${errorData.expected_nafdac}\nProvided: ${errorData.provided_nafdac}`
              }
            } else {
              errorMessage = JSON.stringify(errorData)
            }
          }
        } else if (err.response?.data?.message) {
          if (typeof err.response.data.message === 'string') {
            errorMessage = err.response.data.message
          } else {
            errorMessage = JSON.stringify(err.response.data.message)
          }
        } else if (err.response?.data) {
          // Check if data itself is an object with status/reason
          errorData = err.response.data
          if (typeof errorData === 'object' && errorData !== null) {
            if (errorData.status && errorData.reason) {
              errorMessage = `${errorData.status}: ${errorData.reason}`
              if (errorData.expected_nafdac && errorData.provided_nafdac) {
                errorMessage += `\nExpected: ${errorData.expected_nafdac}\nProvided: ${errorData.provided_nafdac}`
              }
            } else {
              errorMessage = JSON.stringify(errorData)
            }
          } else if (typeof errorData === 'string') {
            errorMessage = errorData
          }
        } else if (err.message) {
          errorMessage = String(err.message)
        }
        
        // Ensure errorMessage is always a string
        if (typeof errorMessage !== 'string') {
          errorMessage = 'An error occurred during verification'
        }
        
        setError(errorMessage)
        
        // Wait 3 seconds before showing result
        setTimeout(() => {
          if (onVerificationComplete) {
            // Pass the full error data if available
            onVerificationComplete({
              isAuthentic: false,
              error: true,
              message: errorData || errorMessage,
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
    <div className="min-h-screen bg-gradient-to-b from-[#ECF6FE] to-white relative overflow-hidden">
      {/* Top Header */}
      <div className="h-16 bg-[#ECF6FE] flex items-center px-4 shadow-sm">
        <img src="/images/image.png" alt="CheckMed Logo" className="h-14" />
        <h1 className="ml-3 text-[32px] font-black" style={{ fontFamily: 'Poppins' }}>
          <span className="text-white" style={{ WebkitTextStroke: '1px #286595' }}>Check</span>
          <span className="text-[#286595]">Med</span>
        </h1>
      </div>

      {/* Main Content - Centered Loading */}
      <div className="flex flex-col items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 140px)' }}>
        <div className="max-w-md w-full">
          
          {/* Modern Loading Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-[#B2DAFB]">
            
            {/* Animated Icon Container */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Outer rotating ring */}
                <div className="w-32 h-32 rounded-full border-4 border-[#ECF6FE] relative">
                  {/* Animated gradient ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#286595] border-r-[#62B4F7] animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-[#91CBF9] border-l-[#B2DAFB] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                  
                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gradient-to-br from-[#286595] to-[#62B4F7] rounded-full p-4 shadow-lg">
                      <svg className="w-10 h-10 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading Text */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-[#286595] mb-3" style={{ fontFamily: 'Poppins' }}>
                {error ? 'Verification Failed' : 'Drug is Being Verified'}
              </h2>
              <p className="text-gray-600 text-base leading-relaxed" style={{ fontFamily: 'Poppins' }}>
                {error ? (
                  <span className="text-red-500 whitespace-pre-line">{String(error)}</span>
                ) : (
                  'Our AI is analyzing your medication against verified records. This may take a few moments...'
                )}
              </p>
            </div>

            {/* Progress Indicators */}
            {!error && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600" style={{ fontFamily: 'Poppins' }}>
                  <div className="w-2 h-2 bg-[#286595] rounded-full animate-pulse"></div>
                  <span>Analyzing packaging details</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600" style={{ fontFamily: 'Poppins' }}>
                  <div className="w-2 h-2 bg-[#62B4F7] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <span>Verifying NAFDAC registration</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600" style={{ fontFamily: 'Poppins' }}>
                  <div className="w-2 h-2 bg-[#91CBF9] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <span>Cross-checking with database</span>
                </div>
              </div>
            )}

            {/* Animated Progress Bar */}
            {!error && (
              <div className="mt-8">
                <div className="h-2 bg-[#ECF6FE] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#286595] via-[#62B4F7] to-[#91CBF9] rounded-full animate-pulse" style={{ width: '100%' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-[#ECF6FE] rounded-xl p-4 border-l-4 border-[#286595]">
            <div className="flex gap-3">
              <svg className="w-6 h-6 text-[#286595] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm text-[#286595] font-semibold mb-1" style={{ fontFamily: 'Poppins' }}>
                  What's happening?
                </p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Poppins' }}>
                  We're using advanced AI to compare your medication with authentic samples, verify the NAFDAC registration, and check for any signs of counterfeiting.
                </p>
              </div>
            </div>
          </div>

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

export default Verify
