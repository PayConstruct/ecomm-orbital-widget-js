import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormValues, PayloadType, SignatureResponse } from '../types'
import 'tailwindcss/tailwind.css'

const FormPage: React.FC = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    targetAmount: '',
    targetCurrency: 'TST',
    currency: 'TST',
    email: '',
    firstName: '',
    lastName: '',
    countryOfResidence: 'US',
  })
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormValues(prevValues => ({ ...prevValues, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const externalId = 'EPP' + new Date().toISOString()
    const payload: PayloadType = {
      externalId,
      returnUrl: `http://localhost:5173/success?externalId=${encodeURIComponent(externalId)}`,
      notifyUrl: 'http://notify.com',
      primaryColor: '#4097F6',
      secondaryColor: '#4097F6',
      nameType: 'legal',
      ...formValues,
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(payload),
      })

      const data: SignatureResponse = await response.json()
      if (data.signature) {
        navigate(`/payment?signature=${encodeURIComponent(data.signature)}`)
      }
    } catch (error) {
      console.error('Error fetching signature:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Payment Details</h2>
        <div>
          <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="text"
            id="targetAmount"
            name="targetAmount"
            value={formValues.targetAmount}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="100"
          />
        </div>
        <div>
          <label htmlFor="targetCurrency" className="block text-sm font-medium text-gray-700">
            Target Currency
          </label>
          <select
            id="targetCurrency"
            name="targetCurrency"
            value={formValues.targetCurrency}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="TST">TST</option>
          </select>
        </div>
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={formValues.currency}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="TST">TST</option>
          </select>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="johndoe@email.com"
          />
        </div>
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formValues.firstName}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="John"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formValues.lastName}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Doe"
          />
        </div>
        <div>
          <label htmlFor="countryOfResidence" className="block text-sm font-medium text-gray-700">
            Country of Residence
          </label>
          <select
            id="countryOfResidence"
            name="countryOfResidence"
            value={formValues.countryOfResidence}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="PH">Philippines</option>
          </select>
        </div>
        <div>
          <label htmlFor="locale" className="block text-sm font-medium text-gray-700">
            Locale
          </label>
          <select
            id="locale"
            name="locale"
            value={formValues.locale}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="en-US">English</option>
            <option value="ja-JP">Japanese</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default FormPage
