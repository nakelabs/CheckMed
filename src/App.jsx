import { useState } from 'react'
import Home from './components/Home'
import Steps from './components/Steps'
import InputName from './components/InputName'
import ScanTablet from './components/Scantablet'
import ScanSyrup from './components/scansyrup'
import Verify from './components/Verify'
import Result from './components/Result'
import Form from './components/Form'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [drugName, setDrugName] = useState('')
  const [scanData, setScanData] = useState(null)
  const [verificationResult, setVerificationResult] = useState(null)

  const handleInputNameNext = (name, type) => {
    setDrugName(name)
    if (type === 'tablet') {
      setCurrentPage('scanTablet')
    } else if (type === 'syrup') {
      setCurrentPage('scanSyrup')
    }
  }

  const handleScanComplete = (data) => {
    setScanData({ ...data, drugName })
    setCurrentPage('verify')
  }

  const handleVerificationComplete = (result) => {
    setVerificationResult(result)
    setCurrentPage('result')
  }

  return (
    <div>
      {currentPage === 'home' && <Home onNavigateToSteps={() => setCurrentPage('steps')} onNavigateToForm={() => setCurrentPage('form')} />}
      {currentPage === 'steps' && <Steps onNavigateToInputName={() => setCurrentPage('inputName')} />}
      {currentPage === 'form' && <Form onNavigateBack={() => setCurrentPage('home')} />}
      {currentPage === 'inputName' && (
        <InputName 
          onNavigateToScanTablet={(name) => handleInputNameNext(name, 'tablet')}
          onNavigateToScanSyrup={(name) => handleInputNameNext(name, 'syrup')}
          onNavigateToNext={() => setCurrentPage('nextStep')}
        />
      )}
      {currentPage === 'scanTablet' && <ScanTablet onNavigateToNext={handleScanComplete} />}
      {currentPage === 'scanSyrup' && <ScanSyrup onNavigateToNext={handleScanComplete} />}
      {currentPage === 'verify' && (
        <Verify 
          scanData={scanData}
          onVerificationComplete={handleVerificationComplete} 
        />
      )}
      {currentPage === 'result' && (
        <Result 
          result={verificationResult}
          onStartNew={() => setCurrentPage('inputName')} 
        />
      )}
    </div>
  )
}

export default App
