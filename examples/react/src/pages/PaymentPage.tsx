import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { init } from '@payperform/widget'
import 'tailwindcss/tailwind.css'
import styles from './PaymentPage.module.scss'

const PaymentPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const orbitalRef = useRef<HTMLDivElement | null>(null)
  const [showError, setShowError] = useState(false)
  const searchParams = new URLSearchParams(location.search)
  const signature = searchParams.get('signature')

  useEffect(() => {
    if (signature && orbitalRef.current) {
      setShowError(false)
      orbitalRef.current.setAttribute('signature', signature)

      init({
        container: orbitalRef.current,
      })
    } else {
      console.error('No signature found')
      setShowError(true)
    }
  }, [signature, navigate])

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center flex-col">
      <div id="orbital" ref={orbitalRef} className={styles['iframe-container']}></div>
      <div role="alert" id="alert" className={`${showError ? '' : 'hidden'} fixed top-4 right-4 w-80`}>
        <div className="bg-red-400 text-white font-bold rounded-t px-4 py-2">Error</div>
        <div className="border border-t-0 border-red-300 rounded-b bg-red-100 px-4 py-3 text-red-600 flex flex-col items-center">
          <p className="mb-2 text-center">No signature detected.</p>
          <button
            onClick={() => navigate('/')}
            className="py-1 px-4 border border-red-500 text-red-500 font-bold rounded hover:bg-red-500 hover:text-white transition"
          >
            Create payment
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
