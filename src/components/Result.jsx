function Result({ result, onStartNew }) {
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
        return `${result.message.status}: ${result.message.reason}`;
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
          <button
            onClick={handleStartNew}
            className="w-full bg-[#286595] rounded-lg py-4 text-white text-lg font-semibold"
            style={{ fontFamily: 'Poppins' }}
          >
            Try Again
          </button>
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
              className="w-full bg-red-600 rounded-lg py-4 text-white text-lg font-semibold"
              style={{ fontFamily: 'Poppins' }}
            >
              Report Counterfeit
            </button>
          )}
        </div>

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
