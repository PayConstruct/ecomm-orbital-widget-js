import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { init, InitOptions } from '@payperform/widget'
import 'tailwindcss/tailwind.css'
import Alert from '../components/Alert'
import { FaApplePay, FaGooglePay } from 'react-icons/fa'
const PaymentPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const orbitalRef = useRef<HTMLDivElement | null>(null)
  const [showError, setShowError] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<InitOptions['mode']>('small-widgets')
  const searchParams = new URLSearchParams(location.search)
  const signature = searchParams.get('signature')

  useEffect(() => {
    if (signature && orbitalRef.current && selectedTab) {
      setShowError(false)
      orbitalRef.current.setAttribute('signature', signature)
      init({
        container: orbitalRef.current,
        mode: selectedTab,
        button: {
          color: 'blue-white',
          logoOnly: true,
          container: 'orbital-button-container',
          onClickCallback: () => {
            setSelectedPayment('crypto')
          },
        },
      })
    } else {
      console.error('No signature found')
      setShowError(true)
    }
  }, [signature, navigate, selectedTab])

  return (
    <div className="bg-gray-100 min-h-screen p-8 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-7xl border border-gray-200 flex flex-col w-11/12 h-[90vh]">
        {/* Tab Navigation */}
        <div className="flex justify-center border-b border-gray-300 mb-4">
          <button
            onClick={() => setSelectedTab('small-widgets')}
            className={`px-6 py-2 font-semibold ${
              selectedTab === 'small-widgets' ? 'border-b-4 border-blue-500 text-blue-500' : 'text-gray-600'
            }`}
          >
            Smaller Widgets
          </button>
          <button
            onClick={() => {
              setSelectedTab('iframe-only'), setSelectedPayment(null)
            }}
            className={`px-6 py-2 font-semibold ${
              selectedTab === 'iframe-only' ? 'border-b-4 border-blue-500 text-blue-500' : 'text-gray-600'
            }`}
          >
            Iframe Only
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-grow overflow-y-auto">
          {selectedTab === 'small-widgets' && (
            <>
              <div className="flex flex-col items-center md:space-x-6 space-y-6 md:space-y-0 gap-10 ">
                {/* Payment selections */}
                <div className="flex items-center gap-3 w-full">
                  <div id="orbital-button-container" className="w-full"></div>
                  <button
                    onClick={() => setSelectedPayment('apple')}
                    className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-md focus:ring-4 focus:ring-gray-300 flex justify-center items-center gap-3 "
                  >
                    <FaApplePay style={{ width: '30px', height: '24px' }} />
                    <span>Apple Pay</span>
                  </button>
                  <button
                    onClick={() => setSelectedPayment('google')}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-md focus:ring-4 focus:ring-yellow-300 flex justify-center items-center gap-3"
                  >
                    <FaGooglePay style={{ width: '30px', height: '24px' }} />
                    <span>Google Pay</span>
                  </button>
                </div>
                {/* Divider */}
              </div>
              <div className="w-full h-[1px] bg-gray-300 hidden md:block my-4"></div>
              {/* Selected payment display */}
              <div className="flex justify-center items-center h-[85%]">
                <div
                  id="orbital"
                  ref={orbitalRef}
                  className={`w-full h-full border border-gray-200 rounded-lg overflow-auto bg-white box-border flex flex-col justify-center items-center p-3 ${
                    selectedPayment === 'crypto' ? '' : 'hidden'
                  }`}
                ></div>
                {selectedPayment !== 'crypto' && (
                  <p className="text-gray-600 text-center">
                    Payment details will appear here once a payment method is selected.
                  </p>
                )}
              </div>
            </>
          )}

          {selectedTab === 'iframe-only' && (
            <div className="flex justify-center items-center h-full">
              <div
                id="orbital"
                ref={orbitalRef}
                className={`w-full h-full border border-gray-200 rounded-lg overflow-auto bg-white box-border flex flex-col justify-center items-center`}
              ></div>
            </div>
          )}
        </div>
      </div>
      {showError && <Alert />}
    </div>
  )
}

export default PaymentPage
