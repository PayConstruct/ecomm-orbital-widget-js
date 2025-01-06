import React, { useEffect, useState } from 'react'
import styles from './Iframe.module.scss'
import { useIframeContext } from '../../context/IframeContext'

const BaseFrame = () => {
  const {
    signature,
    setIsLoading,
    options: { mode },
  } = useIframeContext()
  const [subDomain, setSubDomain] = useState<string>(signature)

  useEffect(() => {
    if (!signature) {
      console.warn('No signature provided.')
      return
    }
    const widgetSize = mode === 'small-widgets' ? `&widgetSize=small` : ''
    setSubDomain(
      signature?.includes('transaction-failed') ? signature : `invoice/widgets?hppEncodedId=${signature}${widgetSize}`
    )
  }, [signature])

  return (
    <iframe
      src={`${process.env.BASE_URL}/${subDomain}`}
      sandbox="allow-scripts allow-same-origin allow-top-navigation"
      referrerPolicy="no-referrer"
      className={styles['iframe-content']}
      onLoad={() => {
        setIsLoading(false)
      }}
      title="Embedded Payment Page"
    />
  )
}

export default BaseFrame
