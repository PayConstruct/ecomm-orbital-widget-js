import React, { useEffect, useState } from 'react'
import { IframeOptions, InitOptions } from '../../types'
import styles from './Button.module.scss'
import classNames from 'classnames'
import Iframe from '../Iframe'
import LogoIcon from '../Icon'

const Button: React.FC<NonNullable<InitOptions['button'] & IframeOptions>> = ({
  color = 'white-black',
  logoOnly = false,
  signature,
  container,
  height,
  width,
  onClickCallback,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasIframe, setHasIframe] = useState(false)

  useEffect(() => {
    if (container && container.querySelector('iframe') !== null) {
      setHasIframe(true)
    } else {
      setHasIframe(false)
    }
  }, [container])
  return (
    <>
      <button
        className={classNames([styles['button'], styles[color]])}
        style={{ height, width }}
        onClick={e => {
          setIsOpen(true)
          if (onClickCallback) {
            onClickCallback(e)
          }
        }}
      >
        <span>Deposit with Crypto</span>
        <LogoIcon color={color} logoOnly={logoOnly} />
      </button>
      {isOpen && !hasIframe && <Iframe signature={signature} container={container} />}
    </>
  )
}

export default Button
