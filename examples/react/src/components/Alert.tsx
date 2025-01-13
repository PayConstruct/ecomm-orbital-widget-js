import { useNavigate } from 'react-router-dom'

const Alert = () => {
  const navigate = useNavigate()

  return (
    <div role="alert" id="alert" className={'fixed top-4 right-4 w-80'}>
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
  )
}

export default Alert
