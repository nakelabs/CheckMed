import { useState } from 'react'
import emailjs from '@emailjs/browser'

function Home({ onNavigateToSteps, onNavigateToForm }) {
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
      <div className="h-16 bg-[#ECF6FE] flex items-center justify-between px-4">
        <div className="flex items-center min-w-0 flex-1">
          <img src="/images/image.png" alt="CheckMed Logo" className="h-10 sm:h-14 flex-shrink-0" />
          <h1 className="ml-2 text-[24px] sm:text-[32px] font-black whitespace-nowrap" style={{ fontFamily: 'Poppins' }}>
            <span className="text-white" style={{ WebkitTextStroke: '0.5px #286595', WebkitTextStrokeWidth: 'clamp(0.5px, 1px, 1px)' }}>Check</span>
            <span className="text-[#286595]">Med</span>
          </h1>
        </div>
        <button
          onClick={onNavigateToForm}
          className="bg-[#286595] hover:bg-[#1e4d6b] text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-md flex items-center gap-1 whitespace-nowrap flex-shrink-0"
          style={{ fontFamily: 'Poppins' }}
        >
          <span className="hidden sm:inline">🏢</span> Register
        </button>
      </div>

      {/* Hero Section */}
      <div className="px-4 pt-12 pb-8">
        <h2 className="text-[48px] font-black leading-tight mb-3" style={{ fontFamily: 'Poppins' }}>
          <span className="text-white" style={{ WebkitTextStroke: '2px #286595' }}>Check</span>
          <span className="text-[#286595]">Med</span>
        </h2>

        <p className="text-[#2E73AC] text-xl font-semibold mb-8" style={{ fontFamily: 'Poppins' }}>
          Verify your medication instantly with AI
        </p>

        <div className="mb-6">
          <div className="w-full h-64 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-[#286595] to-[#62B4F7] flex items-center justify-center">
            {/* Placeholder for hero image */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl">💊</span>
              </div>
              <p className="text-white/80 text-sm">Scan. Verify. Stay Safe.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={onNavigateToSteps}
          className="w-full bg-[#286595] hover:bg-[#2E73AC] transition-colors rounded-xl py-4 text-white text-lg font-semibold shadow-md" 
          style={{ fontFamily: 'Poppins' }}
        >
          Get Started →
        </button>
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-b from-[#286595] to-[#1e4d6f] px-4 py-10">
        {/* Main Explainer */}
        <div className="text-white mb-8" style={{ fontFamily: 'Poppins' }}>
          <h3 className="text-2xl font-bold mb-4 text-center">
            ⚠️ Fake Drugs: A Public Health Crisis
          </h3>
          <p className="text-base leading-relaxed mb-6 opacity-95">
            Counterfeit, expired, and substandard medicines reach buyers through open
            markets, informal vendors, and unregulated online sellers. These products may
            contain the wrong dose, wrong ingredient, or no active ingredient—causing
            treatment failure, longer illness, extra costs, and sometimes death.
          </p>
        </div>

        {/* Key Stats Grid */}
        <div className="space-y-4 mb-8">
          <h4 className="text-white font-bold text-lg mb-4 text-center" style={{ fontFamily: 'Poppins' }}>
            📊 Key Statistics
          </h4>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-start gap-3">
              <span className="text-[#B2DAFB] text-2xl flex-shrink-0">🇳🇬</span>
              <div className="text-white text-sm leading-relaxed" style={{ fontFamily: 'Poppins' }}>
                <p className="font-medium">Nigeria has a persistent market for substandard and falsified medicines.</p>
                <span className="text-xs italic opacity-70">(WHO)</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-start gap-3">
              <span className="text-[#B2DAFB] text-2xl flex-shrink-0">💰</span>
              <div className="text-white text-sm leading-relaxed" style={{ fontFamily: 'Poppins' }}>
                <p className="font-medium">National raids regularly seize hauls worth hundreds of millions to billions of naira.</p>
                <span className="text-xs italic opacity-70">(Nairametrics)</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-start gap-3">
              <span className="text-[#B2DAFB] text-2xl flex-shrink-0">📈</span>
              <div className="text-white text-sm leading-relaxed" style={{ fontFamily: 'Poppins' }}>
                <p className="font-medium">Regulators estimate ~13–15% of the market may be substandard or falsified.</p>
                <span className="text-xs italic opacity-70">(Think Global Health)</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-start gap-3">
              <span className="text-[#B2DAFB] text-2xl flex-shrink-0">⚕️</span>
              <div className="text-white text-sm leading-relaxed" style={{ fontFamily: 'Poppins' }}>
                <p className="font-medium">Substandard antimalarial and pneumonia drugs contribute to preventable deaths.</p>
                <span className="text-xs italic opacity-70">(PMC)</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Box */}
        <div className="bg-[#62B4F7] rounded-xl p-6 shadow-xl border-2 border-white/30" style={{ fontFamily: 'Poppins' }}>
          <div className="text-center">
            <p className="text-white font-bold text-lg mb-2">
              🚨 If you see fake medicines, report now
            </p>
            <p className="text-white/95 text-sm mb-4">
              Your report can prevent harm and save lives
            </p>
            <button 
              onClick={onNavigateToSteps}
              className="bg-white text-[#286595] px-8 py-3 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors shadow-md"
            >
              Start Verification
            </button>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-[#ECF6FE] px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-black mb-2" style={{ fontFamily: 'Poppins' }}>
              <span className="text-white" style={{ WebkitTextStroke: '1px #286595' }}>Stay</span>
              <span className="text-[#286595]"> Informed</span>
            </h3>
            <p className="text-[#2E73AC] text-sm" style={{ fontFamily: 'Poppins' }}>
              Get safety alerts and updates on counterfeit medicines
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full h-12 bg-white border-2 border-[#286595]/20 focus:border-[#286595] outline-none rounded-lg px-4 text-sm transition-colors"
              style={{ fontFamily: 'Poppins' }}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-12 rounded-lg text-white text-sm font-semibold transition-all shadow-md ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#62B4F7] hover:bg-[#4A9FE5]'
              }`}
              style={{ fontFamily: 'Poppins' }}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
            </button>
            {message && (
              <p 
                className={`text-sm text-center ${
                  message.includes('✓') ? 'text-green-600' : 'text-red-600'
                }`}
                style={{ fontFamily: 'Poppins' }}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#286595] py-4 px-4">
        <p className="text-white/60 text-xs text-center" style={{ fontFamily: 'Poppins' }}>
          © 2025 CheckMed. All rights reserved. Data from WHO, NAFDAC, and peer-reviewed research.
        
        </p>
      </div>
    </div>
  )
}

export default Home
