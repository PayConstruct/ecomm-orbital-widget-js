import styles from './Button.module.scss'
import classNames from 'classnames'
import Iframe from '../Iframe'
import LogoIcon from '../Icon'
import { useIframeContext } from '../../context/IframeContext'

const Button = () => {
  const { options } = useIframeContext()
  const { color, height, width, onClickCallback } = options?.button || {}
  const { isOpen, setIsOpen, setIsLoading } = useIframeContext()
  return (
    <>
      <button
        className={classNames([styles['button'], styles[color || '']])}
        style={{ height, width }}
        onClick={e => {
          setIsOpen(true)
          if (onClickCallback) {
            onClickCallback(e)
          }
          if ((options?.container as HTMLElement)?.querySelector('iframe') === null) {
            setIsLoading(true)
          }
        }}
      >
        <span>Deposit with Crypto</span>
        <LogoIcon />
      </button>
      {isOpen && <Iframe key={isOpen ? 'iframe-open' : 'iframe-closed'} />}
    </>
  )
}

export default Button
