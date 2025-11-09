import { useState } from 'react'
import emailjs from '@emailjs/browser'

function Home({ onNavigateToSteps }) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignUp = async (e) => {
    e.preventDefault()
    
    // Validate email
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      // EmailJS configuration
      // Replace these with your actual EmailJS credentials
      const serviceId = 'service_2cmd75w'
      const templateId = 'template_5osmu7x'
      const publicKey = 'bqRLGJnzRcLRO0Ytl'

      const templateParams = {
        email: email,  // Maps to {{email}} in your template
        name: 'CheckMed',  // Maps to {{name}} in your template
        message: `New newsletter subscription request from: ${email}`,  // Maps to {{message}}
      }

      await emailjs.send(serviceId, templateId, templateParams, publicKey)
      
      setMessage('✓ Successfully subscribed!')
      setEmail('')
      setTimeout(() => setMessage(''), 5000)
    } catch (error) {
      console.error('EmailJS Error:', error)
      setMessage('✗ Subscription failed. Please try again.')
      setTimeout(() => setMessage(''), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

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

      {/* Hero Section */}
      <div className="px-4 pt-20 pb-12">
        <div className="mb-6">
          <div className="w-full h-80 border-2 border-gray-300 bg-gray-50 flex items-center justify-center">
            {/* Placeholder for hero image */}
            <span className="text-gray-400 text-sm">Hero Image</span>
          </div>
        </div>

        <h2 className="text-[64px] font-black leading-tight mb-4" style={{ fontFamily: 'Poppins' }}>
          <span className="text-white" style={{ WebkitTextStroke: '2px #286595' }}>Check</span>
          <span className="text-[#286595]">Med</span>
        </h2>

        <p className="text-[#2E73AC] text-lg mb-6" style={{ fontFamily: 'Poppins' }}>
          Verify your medication instantly
        </p>

        <button 
          onClick={onNavigateToSteps}
          className="w-full bg-[#B2DAFB] rounded-lg py-4 text-[#286595] text-lg font-semibold" 
          style={{ fontFamily: 'Poppins' }}
        >
          Learn more
        </button>
      </div>

      {/* Blue Section with Content */}
      <div className="bg-[#286595] px-4 py-12">
        <div className="mb-8">
          <div className="w-full h-52 border-2 border-gray-400 bg-[#3A7BA8] flex items-center justify-center">
            {/* Placeholder for content image */}
            <span className="text-gray-300 text-sm">Content Image</span>
          </div>
        </div>

        {/* Main Explainer */}
        <div className="text-white mb-8" style={{ fontFamily: 'Poppins' }}>
          <h3 className="text-xl font-bold text-center mb-4">
            Fake Drugs: A Public Health Crisis
          </h3>
          <p className="text-base leading-relaxed text-center mb-6 px-2">
            Counterfeit, expired, and substandard medicines often reach buyers through open
            markets, informal vendors, and unregulated online sellers. These products may
            contain the wrong dose, the wrong ingredient, or no active ingredient at all—causing
            treatment failure, longer illness, extra costs, and sometimes death.
          </p>
        </div>

        {/* Key Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 mb-6" style={{ fontFamily: 'Poppins' }}>
          <h4 className="text-white font-semibold text-lg mb-4 text-center">Key Statistics</h4>
          <div className="space-y-3 text-white text-sm leading-relaxed">
            <div className="flex items-start gap-3">
              <span className="text-[#B2DAFB] text-xl font-bold flex-shrink-0">•</span>
              <p>
                Nigeria has a persistent market for substandard and falsified medicines.{' '}
                <span className="text-xs italic opacity-80">(WHO)</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#B2DAFB] text-xl font-bold flex-shrink-0">•</span>
              <p>
                National raids regularly seize large hauls worth hundreds of millions to billions of naira.{' '}
                <span className="text-xs italic opacity-80">(Nairametrics)</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#B2DAFB] text-xl font-bold flex-shrink-0">•</span>
              <p>
                Regulators estimate ~13–15% of the market may be substandard or falsified.{' '}
                <span className="text-xs italic opacity-80">(Think Global Health)</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#B2DAFB] text-xl font-bold flex-shrink-0">•</span>
              <p>
                Substandard antimalarial and pneumonia drugs contribute to preventable deaths in the region.{' '}
                <span className="text-xs italic opacity-80">(PMC)</span>
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-[#62B4F7] rounded-lg py-4 px-6" style={{ fontFamily: 'Poppins' }}>
          <p className="text-white font-bold text-base">
            If you see fake medicines, report now.
          </p>
          <p className="text-white/90 text-sm mt-1">
            Your report can prevent harm.
          </p>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-white px-4 py-8">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[32px] font-black mb-2" style={{ fontFamily: 'Poppins' }}>
              <span className="text-white" style={{ WebkitTextStroke: '1px #286595' }}>Check</span>
              <span className="text-[#286595]">Med</span>
            </h3>
            <p className="text-[#2E73AC] text-xs italic font-semibold" style={{ fontFamily: 'Poppins' }}>
              Verify your medication instantly.
            </p>
          </div>

          <div className="ml-8">
            <p className="text-xs mb-2" style={{ fontFamily: 'Poppins' }}>
              Sign up for our newsletter
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-40 h-7 bg-[#ECF6FE] px-2 text-xs mb-2 placeholder-[#286595]/40"
              style={{ fontFamily: 'Poppins' }}
            />
            <button
              onClick={handleSignUp}
              disabled={isSubmitting}
              className={`w-40 h-7 rounded-md text-white text-xs ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#62B4F7] hover:bg-[#4A9FE5]'
              }`}
              style={{ fontFamily: 'Poppins' }}
            >
              {isSubmitting ? 'Sending...' : 'Sign Up'}
            </button>
            {message && (
              <p 
                className={`text-xs mt-1 ${
                  message.includes('✓') ? 'text-green-600' : 'text-red-600'
                }`}
                style={{ fontFamily: 'Poppins' }}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#D9D9D9] py-3 px-4">
        <p className="text-black/40 text-xs" style={{ fontFamily: 'Poppins' }}>
          2025. CheckMed. All rights reserved
        </p>
      </div>
    </div>
  )
}

export default Home
