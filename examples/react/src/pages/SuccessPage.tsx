import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const SuccessPage: React.FC = () => {
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const externalId = queryParams.get('externalId')
    setTransactionId(externalId)
  }, [location.search])

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-700 mb-6">
          Thank you for your payment. Your transaction has been processed successfully.
        </p>

        <div className="mb-4">
          <p className="text-sm text-gray-500 font-bold">
            Transaction ID: <span className="font-medium">{transactionId || ''}</span>
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
        >
          New payment
        </button>
      </div>
    </div>
  )
}

export default SuccessPage
