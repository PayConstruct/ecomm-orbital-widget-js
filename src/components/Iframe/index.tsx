import styles from './Iframe.module.scss'
import { createPortal } from 'react-dom'
import Loader from '../Loader'
import { useIframeContext } from '../../context/IframeContext'
import BaseFrame from './BaseFrame'
import CloseButton from '../Loader/CloseButton'

const Iframe = () => {
  const { setIsOpen, signature, options, isLoading } = useIframeContext()
  const { container: containerOption, mode } = options
  const container = containerOption as HTMLElement

  const iframeElement = (
    <>
      {isLoading && <Loader />}
      {signature && (
        <div className={styles['iframe']} style={isLoading ? { display: 'none' } : {}}>
          <CloseButton />
          <BaseFrame />
        </div>
      )}
    </>
  )
  return container && mode === 'small-widgets' ? createPortal(iframeElement, container) : <BaseFrame />
}

export default Iframe
