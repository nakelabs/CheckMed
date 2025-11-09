import { useState } from 'react';

function Steps({ onNavigateToInputName }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left - next step
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      }
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right - previous step
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      onNavigateToInputName();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

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

      {/* Introduction Section */}
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-[#286595] mb-3" style={{ fontFamily: 'Poppins' }}>
          How It Works
        </h2>
        <p className="text-base text-gray-600 max-w-2xl mx-auto mb-6" style={{ fontFamily: 'Poppins' }}>
          Three simple steps to verify your medication
        </p>
        
        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <button
                onClick={() => goToStep(step)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  currentStep === step
                    ? 'bg-[#286595] text-white scale-110 shadow-lg'
                    : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                }`}
                style={{ fontFamily: 'Poppins' }}
              >
                {step + 1}
              </button>
              {step < 2 && (
                <div className={`w-12 md:w-16 h-1 transition-colors duration-300 ${
                  currentStep > step ? 'bg-[#286595]' : 'bg-[#B2DAFB]'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Swipeable Steps Container */}
      <div 
        className="max-w-6xl mx-auto px-4 pb-8 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentStep * 100}%)` }}
        >
          {/* Each step takes full width */}
          
      {/* Step 1 - Card Style */}
      <div className="w-full flex-shrink-0 px-2">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#B2DAFB]">
        <div className="bg-gradient-to-r from-[#62B4F7] to-[#91CBF9] py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-[#286595] flex items-center justify-center font-black text-xl">
              1
            </div>
            <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'Poppins' }}>
              Select Your Drug
            </h2>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-8 p-8">
          <div className="w-full md:w-1/2">
            <div className="w-full h-80 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-[#ECF6FE] to-[#B2DAFB] flex items-center justify-center shadow-inner">
              <div className="text-center">
                <svg className="w-20 h-20 mx-auto text-[#286595] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-gray-500 text-sm mt-2 block">Drug Selection</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-[#286595] text-lg leading-relaxed" style={{ fontFamily: 'Poppins' }}>
              Begin by choosing your medication from our verified database. This step allows CheckMed's AI to identify the genuine reference model for that particular drug. Whether it's an antibiotic, painkiller, or malaria treatment, selecting the right name helps the system prepare the most accurate comparison.
            </p>
            <div className="mt-6 flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-600 text-sm">Instant database matching with AI-powered verification</p>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Step 2 - Card Style */}
      <div className="w-full flex-shrink-0 px-2">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#B2DAFB]">
        <div className="bg-gradient-to-r from-[#62B4F7] to-[#91CBF9] py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-[#286595] flex items-center justify-center font-black text-xl">
              2
            </div>
            <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'Poppins' }}>
              Scan the Details
            </h2>
          </div>
        </div>
        <div className="flex flex-col md:flex-row-reverse items-center gap-8 p-8">
          <div className="w-full md:w-1/2">
            <div className="w-full h-80 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-[#ECF6FE] to-[#B2DAFB] flex items-center justify-center shadow-inner">
              <div className="text-center">
                <svg className="w-20 h-20 mx-auto text-[#286595] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-500 text-sm mt-2 block">Camera Scanning</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-[#286595] text-lg leading-relaxed" style={{ fontFamily: 'Poppins' }}>
              Next, you'll be guided through a quick, three-part scan. First, capture the NAFDAC number printed on the box. Then, scan the full packaging to detect inconsistencies in logos, fonts, or design patterns. Finally, scan the physical pill itself. Each image is analyzed instantly using AI trained on thousands of authentic and counterfeit samples. You don't need any technical skills — just your camera.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-600 text-sm">Three-part verification: NAFDAC number, packaging, and pill</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-600 text-sm">No technical skills required — just use your phone camera</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Step 3 - Card Style */}
      <div className="w-full flex-shrink-0 px-2">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#B2DAFB]">
        <div className="bg-gradient-to-r from-[#62B4F7] to-[#91CBF9] py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-[#286595] flex items-center justify-center font-black text-xl">
              3
            </div>
            <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'Poppins' }}>
              View the Result
            </h2>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-8 p-8">
          <div className="w-full md:w-1/2">
            <div className="w-full h-80 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-[#ECF6FE] to-[#B2DAFB] flex items-center justify-center shadow-inner">
              <div className="text-center">
                <svg className="w-20 h-20 mx-auto text-[#286595] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-500 text-sm mt-2 block">Verification Result</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-[#286595] text-lg leading-relaxed" style={{ fontFamily: 'Poppins' }}>
              In seconds, CheckMed delivers your result. If your medication matches verified records, you'll see a bold "VERIFIED" screen. If inconsistencies are found, the app will display "HIGH-RISK" and highlight the reason — such as an invalid NAFDAC number, poor-quality packaging, or mismatched pill design. You can then report the location anonymously to help protect others.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-600 text-sm">Instant results: "VERIFIED" or "HIGH-RISK" with detailed reasons</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-600 text-sm">Anonymous reporting to protect your community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              currentStep === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-[#286595] border-2 border-[#286595] hover:bg-[#ECF6FE]'
            }`}
            style={{ fontFamily: 'Poppins' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          {/* Progress Dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((step) => (
              <button
                key={step}
                onClick={() => goToStep(step)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentStep === step
                    ? 'bg-[#286595] w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-[#286595] text-white hover:bg-[#1e4a6b] transition-all"
            style={{ fontFamily: 'Poppins' }}
          >
            {currentStep === 2 ? 'Get Started' : 'Next'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Swipe Hint */}
      <div className="max-w-6xl mx-auto px-4 pb-6 text-center">
        <p className="text-sm text-gray-500" style={{ fontFamily: 'Poppins' }}>
          💡 Swipe left or right to navigate between steps
        </p>
      </div>

 
      

      {/* Footer */}
      <div className="bg-[#286595] py-6 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/80 text-sm" style={{ fontFamily: 'Poppins' }}>
            © 2025 CheckMed. All rights reserved. Protecting Nigeria from counterfeit medications.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Steps
