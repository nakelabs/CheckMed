import { useState } from 'react'
import axios from 'axios'

function Form({ onNavigateBack }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    nafdacNumber: '',
    drugName: '',
    drugType: '',
    manufacturerName: '',
    packageImage: null,
    blisterPackImage: null,
    barcode: ''
  })

  const [previewImages, setPreviewImages] = useState({
    package: null,
    blisterPack: null
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageCapture = (type) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        if (type === 'package') {
          setFormData(prev => ({ ...prev, packageImage: file }))
          setPreviewImages(prev => ({ ...prev, package: URL.createObjectURL(file) }))
        } else if (type === 'blisterPack') {
          setFormData(prev => ({ ...prev, blisterPackImage: file }))
          setPreviewImages(prev => ({ ...prev, blisterPack: URL.createObjectURL(file) }))
        }
      }
    }
    
    input.click()
  }

  const handleImageUpload = (type) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        if (type === 'package') {
          setFormData(prev => ({ ...prev, packageImage: file }))
          setPreviewImages(prev => ({ ...prev, package: URL.createObjectURL(file) }))
        } else if (type === 'blisterPack') {
          setFormData(prev => ({ ...prev, blisterPackImage: file }))
          setPreviewImages(prev => ({ ...prev, blisterPack: URL.createObjectURL(file) }))
        }
      }
    }
    
    input.click()
  }

  const removeImage = (type) => {
    if (type === 'package') {
      setFormData(prev => ({ ...prev, packageImage: null }))
      setPreviewImages(prev => ({ ...prev, package: null }))
    } else if (type === 'blisterPack') {
      setFormData(prev => ({ ...prev, blisterPackImage: null }))
      setPreviewImages(prev => ({ ...prev, blisterPack: null }))
    }
  }

  const canProceedToStep2 = () => {
    return formData.nafdacNumber && formData.drugName && formData.drugType && formData.manufacturerName
  }

  const canSubmit = () => {
    if (!formData.packageImage) return false
    if (formData.drugType === 'tablet' && !formData.blisterPackImage) return false
    return true
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Create FormData for API submission
      const apiFormData = new FormData()
      apiFormData.append('drug_name', formData.drugName)
      apiFormData.append('drug_type', formData.drugType)
      apiFormData.append('nafdac_number', formData.nafdacNumber)
      apiFormData.append('manufacturer', formData.manufacturerName)
      apiFormData.append('box_image', formData.packageImage)
      
      // Add blister_pack_image only for tablets
      if (formData.drugType === 'tablet' && formData.blisterPackImage) {
        apiFormData.append('blister_pack_image', formData.blisterPackImage)
      }
      
      // Add barcode if provided (optional)
      if (formData.barcode) {
        apiFormData.append('barcode', formData.barcode)
      }

      // Make API call to backend
      const response = await axios.post(
        'https://checkmed-2q81.onrender.com/api/register-drug/',
        apiFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      setSubmitSuccess(true)
      setIsSubmitting(false)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          nafdacNumber: '',
          drugName: '',
          drugType: '',
          manufacturerName: '',
          packageImage: null,
          blisterPackImage: null,
          barcode: ''
        })
        setPreviewImages({ package: null, blisterPack: null })
        setStep(1)
        setSubmitSuccess(false)
      }, 3000)

    } catch (err) {
      setIsSubmitting(false)
      
      // Handle different error formats
      let errorMessage = 'Failed to submit drug information'
      
      if (err.response?.data?.detail) {
        // Handle FastAPI validation error format
        if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map(e => `${e.loc?.[1] || 'Field'}: ${e.msg}`).join(', ')
        } else if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail
        } else {
          errorMessage = JSON.stringify(err.response.data.detail)
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setSubmitError(errorMessage)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ECF6FE] to-white relative overflow-hidden">
      {/* Top Header */}
      <div className="h-16 bg-[#ECF6FE] flex items-center px-4 shadow-sm">
        <button
          onClick={onNavigateBack}
          className="mr-3 text-[#286595] hover:text-[#1e4d6b] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <img src="/images/image.png" alt="CheckMed Logo" className="h-14" />
        <h1 className="ml-3 text-[32px] font-black" style={{ fontFamily: 'Poppins' }}>
          <span className="text-white" style={{ WebkitTextStroke: '1px #286595' }}>Check</span>
          <span className="text-[#286595]">Med</span>
        </h1>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-4 bg-[#ECF6FE]">
        <div 
          className="h-full bg-[#2E73AC] transition-all duration-300"
          style={{ width: `${(step / 2) * 100}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-24">
        <div className="max-w-2xl mx-auto">
          
          {/* Page Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-[#286595] mb-2" style={{ fontFamily: 'Poppins' }}>
              Register Drug Product
            </h2>
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'Poppins' }}>
              Upload your drug information to CheckMed database
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2">
              {/* Step 1 */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 1 ? 'bg-[#286595] text-white' : 'bg-gray-300 text-gray-600'
              } font-bold transition-all duration-300`} style={{ fontFamily: 'Poppins' }}>
                {step > 1 ? '✓' : '1'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-700" style={{ fontFamily: 'Poppins' }}>
                  Basic Info
                </span>
              </div>

              {/* Connector */}
              <div className={`w-12 h-1 mx-2 ${step >= 2 ? 'bg-[#286595]' : 'bg-gray-300'} transition-all duration-300`} />

              {/* Step 2 */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 2 ? 'bg-[#286595] text-white' : 'bg-gray-300 text-gray-600'
              } font-bold transition-all duration-300`} style={{ fontFamily: 'Poppins' }}>
                2
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-700" style={{ fontFamily: 'Poppins' }}>
                  Images
                </span>
              </div>
            </div>
          </div>

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Card Container */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#B2DAFB]">
                
                {/* NAFDAC Number */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#286595] mb-2" style={{ fontFamily: 'Poppins' }}>
                    NAFDAC Registration Number *
                  </label>
                  <input
                    type="text"
                    name="nafdacNumber"
                    value={formData.nafdacNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., A11-1161"
                    className="w-full px-4 py-3 border-2 border-[#B2DAFB] rounded-lg focus:border-[#286595] focus:outline-none text-gray-800 uppercase"
                    style={{ fontFamily: 'Poppins' }}
                  />
                  <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Poppins' }}>
                    Enter the official NAFDAC registration number
                  </p>
                </div>

                {/* Drug Name */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#286595] mb-2" style={{ fontFamily: 'Poppins' }}>
                    Drug Name *
                  </label>
                  <input
                    type="text"
                    name="drugName"
                    value={formData.drugName}
                    onChange={handleInputChange}
                    placeholder="e.g., Paracetamol"
                    className="w-full px-4 py-3 border-2 border-[#B2DAFB] rounded-lg focus:border-[#286595] focus:outline-none text-gray-800"
                    style={{ fontFamily: 'Poppins' }}
                  />
                </div>

                {/* Drug Type */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#286595] mb-2" style={{ fontFamily: 'Poppins' }}>
                    Drug Type *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, drugType: 'tablet' }))}
                      className={`py-4 px-6 rounded-lg font-semibold text-base transition-all duration-200 ${
                        formData.drugType === 'tablet'
                          ? 'bg-[#286595] text-white shadow-lg'
                          : 'bg-[#ECF6FE] text-[#286595] hover:bg-[#B2DAFB]'
                      }`}
                      style={{ fontFamily: 'Poppins' }}
                    >
                      💊 Tablet
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, drugType: 'syrup' }))}
                      className={`py-4 px-6 rounded-lg font-semibold text-base transition-all duration-200 ${
                        formData.drugType === 'syrup'
                          ? 'bg-[#286595] text-white shadow-lg'
                          : 'bg-[#ECF6FE] text-[#286595] hover:bg-[#B2DAFB]'
                      }`}
                      style={{ fontFamily: 'Poppins' }}
                    >
                      🍶 Syrup/Bottle
                    </button>
                  </div>
                </div>

                {/* Manufacturer Name */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#286595] mb-2" style={{ fontFamily: 'Poppins' }}>
                    Manufacturer Name *
                  </label>
                  <input
                    type="text"
                    name="manufacturerName"
                    value={formData.manufacturerName}
                    onChange={handleInputChange}
                    placeholder="e.g., Pharma Company Ltd"
                    className="w-full px-4 py-3 border-2 border-[#B2DAFB] rounded-lg focus:border-[#286595] focus:outline-none text-gray-800"
                    style={{ fontFamily: 'Poppins' }}
                  />
                </div>

              </div>

              {/* Next Button */}
              <button
                onClick={() => setStep(2)}
                disabled={!canProceedToStep2()}
                className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg transition-all duration-200 ${
                  canProceedToStep2()
                    ? 'bg-[#286595] text-white hover:bg-[#1e4d6b]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                style={{ fontFamily: 'Poppins' }}
              >
                Next: Upload Images →
              </button>
            </div>
          )}

          {/* Step 2: Images Upload */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Package Image Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#B2DAFB]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#286595]" style={{ fontFamily: 'Poppins' }}>
                    📦 Package Image *
                  </h3>
                  <span className="text-xs text-gray-500" style={{ fontFamily: 'Poppins' }}>Required</span>
                </div>

                {!previewImages.package ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => handleImageCapture('package')}
                      className="w-full bg-[#286595] text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2"
                      style={{ fontFamily: 'Poppins' }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Take Photo
                    </button>
                    <button
                      onClick={() => handleImageUpload('package')}
                      className="w-full bg-[#ECF6FE] text-[#286595] py-4 rounded-lg font-semibold flex items-center justify-center gap-2"
                      style={{ fontFamily: 'Poppins' }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Choose from Library
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={previewImages.package}
                      alt="Package"
                      className="w-full h-64 object-cover rounded-lg border-2 border-[#B2DAFB]"
                    />
                    <button
                      onClick={() => removeImage('package')}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Blister Pack Image (Only for Tablets) */}
              {formData.drugType === 'tablet' && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#B2DAFB]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#286595]" style={{ fontFamily: 'Poppins' }}>
                      💊 Blister Pack Image *
                    </h3>
                    <span className="text-xs text-gray-500" style={{ fontFamily: 'Poppins' }}>Required for tablets</span>
                  </div>

                  {!previewImages.blisterPack ? (
                    <div className="space-y-3">
                      <button
                        onClick={() => handleImageCapture('blisterPack')}
                        className="w-full bg-[#286595] text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2"
                        style={{ fontFamily: 'Poppins' }}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Take Photo
                      </button>
                      <button
                        onClick={() => handleImageUpload('blisterPack')}
                        className="w-full bg-[#ECF6FE] text-[#286595] py-4 rounded-lg font-semibold flex items-center justify-center gap-2"
                        style={{ fontFamily: 'Poppins' }}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Choose from Library
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={previewImages.blisterPack}
                        alt="Blister Pack"
                        className="w-full h-64 object-cover rounded-lg border-2 border-[#B2DAFB]"
                      />
                      <button
                        onClick={() => removeImage('blisterPack')}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Barcode (Optional) */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#B2DAFB]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#286595]" style={{ fontFamily: 'Poppins' }}>
                    🔢 Barcode Number
                  </h3>
                  <span className="text-xs text-green-600" style={{ fontFamily: 'Poppins' }}>Optional</span>
                </div>
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleInputChange}
                  placeholder="Enter barcode if available"
                  className="w-full px-4 py-3 border-2 border-[#B2DAFB] rounded-lg focus:border-[#286595] focus:outline-none text-gray-800"
                  style={{ fontFamily: 'Poppins' }}
                />
                <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: 'Poppins' }}>
                  Leave blank if product doesn't have a barcode
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setStep(1)}
                  className="w-full bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold"
                  style={{ fontFamily: 'Poppins' }}
                >
                  ← Back to Basic Info
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit() || isSubmitting}
                  className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg transition-all duration-200 ${
                    canSubmit() && !isSubmitting
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  style={{ fontFamily: 'Poppins' }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Drug Information ✓'}
                </button>
              </div>

              {/* Success Message */}
              {submitSuccess && (
                <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-green-800 font-bold" style={{ fontFamily: 'Poppins' }}>
                        Success!
                      </p>
                      <p className="text-green-700 text-sm" style={{ fontFamily: 'Poppins' }}>
                        Drug information has been submitted successfully.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitError && (
                <div className="p-4 bg-red-50 border-2 border-red-500 rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-red-800 font-bold" style={{ fontFamily: 'Poppins' }}>
                        Error
                      </p>
                      <p className="text-red-700 text-sm" style={{ fontFamily: 'Poppins' }}>
                        {submitError}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 w-full bg-[#286595] py-4 px-4">
        <p className="text-white/80 text-xs text-center" style={{ fontFamily: 'Poppins' }}>
          © 2025 CheckMed. All rights reserved. Protecting Nigeria from counterfeit medications.
        </p>
      </div>
    </div>
  )
}

export default Form
