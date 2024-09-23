import React, { useEffect, useState, useRef } from 'react'
import { init } from '@payconstruct/orbital-widget'
import { payload } from '../config/config'
import { SignatureResponse } from '../types'
import styles from './OrbitalWidget.module.scss'

const OrbitalWidget: React.FC = () => {
  const [signature, setSignature] = useState<string | null>(null)
  const orbitalRef = useRef<HTMLDivElement | null>(null)
  const initialized = useRef(false)

  useEffect(() => {

    const fetchSignature = async () => {
      //initialized only use for example to avoid double rerendering for react running in strict mode locally, can be removed
      if (!initialized.current) {
        initialized.current = true
        try {
          // fetching the signature should be a call made to your own server
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
            setSignature(data.signature)
          }
        } catch (error) {
          console.error('Error fetching signature:', error)
        }
      }
    }

    fetchSignature()
  }, [])

  useEffect(() => {
    if (signature && orbitalRef.current) {
      orbitalRef.current.setAttribute('signature', signature)

      init({
        container: 'orbital',
      })

      /*
       * OR using React ref / passing HTML element directly
       * init({
       *  container: orbitalRef.current,
       * })
       */
    }
  }, [signature])

  return <div className={styles['iframe-container']} id="orbital" ref={orbitalRef}></div>
}

export default OrbitalWidget
