import { useState } from 'react'
import axios from 'axios'

function Result({ result, onStartNew }) {
  const [isReporting, setIsReporting] = useState(false)
  const [reportSuccess, setReportSuccess] = useState(false)
  const [reportError, setReportError] = useState(null)

  // Extract data from API response
  const isAuthentic = result?.isAuthentic || result?.authentic || false
  const hasError = result?.error || false
  
  // Handle message - it might be an object or string
  const getMessage = () => {
    if (!result?.message) return '';
    if (typeof result.message === 'string') return result.message;
    if (typeof result.message === 'object') {
      // If message is an object with status and reason, format it
      if (result.message.status && result.message.reason) {
        let msg = `${result.message.status}: ${result.message.reason}`;
        // Add NAFDAC details if present
        if (result.message.expected_nafdac && result.message.provided_nafdac) {
          msg += `\n\nExpected NAFDAC: ${result.message.expected_nafdac}\nProvided NAFDAC: ${result.message.provided_nafdac}`;
        }
        return msg;
      }
      // Otherwise convert to JSON string
      return JSON.stringify(result.message);
    }
    return String(result.message);
  };
  
  const messageText = getMessage();
  
  const handleStartNew = () => {
    if (onStartNew) {
      onStartNew()
    }
  }

  const handleReport = async () => {
    setIsReporting(true)
    setReportError(null)

    try {
      // Get user location
      const getLocation = () => {
        return new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'))
          } else {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                resolve({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                })
              },
              (error) => {
                // If user denies location, we'll still submit without it
                resolve(null)
              }
            )
          }
        })
      }

      // Get stored scan data from localStorage
      const storedData = localStorage.getItem('lastScanData')
      if (!storedData) {
        throw new Error('No scan data found to report')
      }

      const scanData = JSON.parse(storedData)
      
      // Get location
      const location = await getLocation()
      
      // Prepare form data
      const formData = new FormData()
      formData.append('drug_name', scanData.drug_name)
      formData.append('nafdac_number', scanData.nafdac_number)
      formData.append('reason', messageText || 'Counterfeit drug detected by CheckMed verification')
      
      if (location) {
        formData.append('location', `${location.latitude}, ${location.longitude}`)
      } else {
        formData.append('location', 'Location not available')
      }

      // Convert base64 images back to files
      if (scanData.box_image_base64) {
        const boxBlob = await fetch(scanData.box_image_base64).then(r => r.blob())
        formData.append('box_image', boxBlob, 'box_image.jpg')
      }

      if (scanData.blister_image_base64) {
        const blisterBlob = await fetch(scanData.blister_image_base64).then(r => r.blob())
        formData.append('blister_image', blisterBlob, 'blister_image.jpg')
      }

      // Send report to backend
      await axios.post(
        'https://checkmed-2q81.onrender.com/api/report/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      setReportSuccess(true)
      setIsReporting(false)
      
      // Clear localStorage after successful report
      localStorage.removeItem('lastScanData')
      
    } catch (err) {
      setIsReporting(false)
      setReportError(err.response?.data?.detail || err.message || 'Failed to submit report')
    }
  }

  // Safety check - if no result data, show loading or error
  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#ECF6FE] to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#286595] mb-4" style={{ fontFamily: 'Poppins' }}>
            No Result Data
          </h2>
          <button
            onClick={handleStartNew}
            className="bg-[#286595] rounded-lg py-3 px-6 text-white font-semibold"
            style={{ fontFamily: 'Poppins' }}
          >
            Start Over
          </button>
        </div>
      </div>
    )
  }

  // Show error state if verification failed
  if (hasError) {
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

        <div className="w-full h-4 bg-[#2E73AC]" />

        <div className="px-4 pt-12 pb-20 text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-orange-500 mb-6">
            <span className="text-white text-6xl">⚠</span>
          </div>
          <h2 className="text-[32px] font-bold text-orange-600 mb-4" style={{ fontFamily: 'Poppins' }}>
            VERIFICATION ERROR
          </h2>
          <p className="text-gray-700 text-base mb-8" style={{ fontFamily: 'Poppins' }}>
            {messageText || 'Unable to verify medication. Please try again.'}
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleStartNew}
              className="w-full bg-[#286595] rounded-lg py-4 text-white text-lg font-semibold"
              style={{ fontFamily: 'Poppins' }}
            >
              Try Again
            </button>
            
            <button
              onClick={handleReport}
              disabled={isReporting || reportSuccess}
              className={`w-full rounded-lg py-4 text-white text-lg font-semibold ${
                reportSuccess 
                  ? 'bg-green-600' 
                  : isReporting 
                    ? 'bg-red-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700'
              }`}
              style={{ fontFamily: 'Poppins' }}
            >
              {isReporting 
                ? 'Submitting Report...' 
                : reportSuccess 
                  ? '✓ Report Submitted' 
                  : 'Report Counterfeit'}
            </button>
          </div>

          {/* Report Status Messages */}
          {reportSuccess && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-green-700 font-semibold" style={{ fontFamily: 'Poppins' }}>
                  Thank you! Your report has been submitted to NAFDAC.
                </p>
              </div>
            </div>
          )}

          {reportError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700" style={{ fontFamily: 'Poppins' }}>
                  {reportError}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 w-full bg-[#D9D9D9] py-3 px-4">
          <p className="text-black/40 text-xs" style={{ fontFamily: 'Poppins' }}>
            2025. CheckMed. All rights reserved
          </p>
        </div>
      </div>
    )
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

      {/* Progress Bar - Full */}
      <div className="w-full h-4 bg-[#2E73AC]" />

      {/* Main Content */}
      <div className="px-4 pt-12 pb-20">
        {/* Result Icon and Status */}
        <div className="text-center mb-8">
          {isAuthentic ? (
            <>
              {/* Green Checkmark Circle */}
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-green-500 mb-6">
                <svg 
                  className="w-20 h-20 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={3} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
              <h2 
                className="text-[32px] font-bold text-green-600 mb-4" 
                style={{ fontFamily: 'Poppins' }}
              >
                REAL DRUG DETECTED
              </h2>
              <p 
                className="text-gray-700 text-base mb-2" 
                style={{ fontFamily: 'Poppins' }}
              >
                {messageText || 'This medication is authentic and safe to use.'}
              </p>
            </>
          ) : (
            <>
              {/* Red X Circle */}
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-red-500 mb-6">
                <svg 
                  className="w-20 h-20 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={3} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </div>
              <h2 
                className="text-[32px] font-bold text-red-600 mb-4" 
                style={{ fontFamily: 'Poppins' }}
              >
                FAKE DRUG DETECTED
              </h2>
              <p 
                className="text-gray-700 text-base mb-2" 
                style={{ fontFamily: 'Poppins' }}
              >
                {messageText || '⚠️ WARNING: This medication appears to be counterfeit.'}
              </p>
              {!messageText && (
                <p 
                  className="text-gray-600 text-sm" 
                  style={{ fontFamily: 'Poppins' }}
                >
                  Do not consume. Please report to authorities.
                </p>
              )}
            </>
          )}
        </div>

        {/* Details Card */}
        <div className="bg-[#ECF6FE] rounded-lg p-6 mb-8">
          <h3 
            className="text-xl font-semibold text-[#286595] mb-4" 
            style={{ fontFamily: 'Poppins' }}
          >
            Verification Details
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm" style={{ fontFamily: 'Poppins' }}>
                Status:
              </span>
              <span 
                className={`text-sm font-semibold ${isAuthentic ? 'text-green-600' : 'text-red-600'}`}
                style={{ fontFamily: 'Poppins' }}
              >
                {isAuthentic ? 'Verified Authentic' : 'Counterfeit Detected'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm" style={{ fontFamily: 'Poppins' }}>
                NAFDAC Verified:
              </span>
              <span 
                className={`text-sm font-semibold ${isAuthentic ? 'text-green-600' : 'text-red-600'}`}
                style={{ fontFamily: 'Poppins' }}
              >
                {result?.nafdacVerified !== undefined ? (result.nafdacVerified ? 'Yes ✓' : 'No ✗') : (isAuthentic ? 'Yes ✓' : 'No ✗')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm" style={{ fontFamily: 'Poppins' }}>
                Packaging Match:
              </span>
              <span 
                className={`text-sm font-semibold ${isAuthentic ? 'text-green-600' : 'text-red-600'}`}
                style={{ fontFamily: 'Poppins' }}
              >
                {result?.matchPercentage ? `${result.matchPercentage}%` : (isAuthentic ? '100%' : '0%')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm" style={{ fontFamily: 'Poppins' }}>
                Verified On:
              </span>
              <span className="text-gray-800 text-sm font-medium" style={{ fontFamily: 'Poppins' }}>
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleStartNew}
            className="w-full bg-[#286595] rounded-lg py-4 text-white text-lg font-semibold"
            style={{ fontFamily: 'Poppins' }}
          >
            Verify Another Medication
          </button>
          
          {!isAuthentic && (
            <button
              onClick={handleReport}
              disabled={isReporting || reportSuccess}
              className={`w-full rounded-lg py-4 text-white text-lg font-semibold ${
                reportSuccess 
                  ? 'bg-green-600' 
                  : isReporting 
                    ? 'bg-red-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700'
              }`}
              style={{ fontFamily: 'Poppins' }}
            >
              {isReporting 
                ? 'Submitting Report...' 
                : reportSuccess 
                  ? '✓ Report Submitted' 
                  : 'Report Counterfeit'}
            </button>
          )}
        </div>

        {/* Report Status Messages */}
        {reportSuccess && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-green-700 font-semibold" style={{ fontFamily: 'Poppins' }}>
                Thank you! Your report has been submitted to NAFDAC.
              </p>
            </div>
          </div>
        )}

        {reportError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700" style={{ fontFamily: 'Poppins' }}>
                {reportError}
              </p>
            </div>
          </div>
        )}

        {/* Backend Response Message */}
        {messageText && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2" style={{ fontFamily: 'Poppins' }}>
              AI Analysis Result:
            </h4>
            <p className="text-xs text-blue-700" style={{ fontFamily: 'Poppins' }}>
              {messageText}
            </p>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center" style={{ fontFamily: 'Poppins' }}>
            {isAuthentic 
              ? 'Always verify your medication before use. Store in a cool, dry place.'
              : 'Counterfeit drugs can be dangerous. Contact NAFDAC or your local health authority immediately.'}
          </p>
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

export default Result
