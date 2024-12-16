import { useEffect, useState } from 'react'
import { IframeOptions } from '../../types'
import styles from './Iframe.module.scss'
import { createPortal } from 'react-dom'
import Loader from '../Loader'
const Iframe: React.FC<IframeOptions> = ({ signature, container }) => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [subDomain, setSubDomain] = useState<string>(signature)
  useEffect(() => {
    if (!signature) {
      console.warn('No signature provided.')
      setError('No signature provided.')
      return
    }

    setSubDomain(signature?.includes('transaction-failed') ? signature : `invoice/widgets?hppEncodedId=${signature}`)
  }, [signature])

  const iframeElement = (
    <>
      {(error || !signature) && <div>{error}</div>}
      {isLoading && <Loader />}
      {!error && signature && (
        <iframe
          src={`${process.env.BASE_URL}/${subDomain}`}
          sandbox="allow-scripts allow-same-origin allow-top-navigation"
          referrerPolicy="no-referrer"
          className={styles.iframe}
          style={isLoading ? { display: 'none' } : {}}
          onLoad={() => {
            setIsLoading(false)
          }}
        />
      )}
    </>
  )
  if (container) {
    return createPortal(iframeElement, container)
  }
  return iframeElement
}

export default Iframe
