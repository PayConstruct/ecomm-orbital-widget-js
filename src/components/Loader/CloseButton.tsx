import CloseIcon from '../../assets/close.svg'
import { useIframeContext } from '../../context/IframeContext'
import styles from './Loader.module.scss'
const CloseButton = () => {
  const { setIsOpen } = useIframeContext()

  return (
    <img
      className={styles['loader-btn__close']}
      src={CloseIcon}
      alt="close-icon"
      onClick={() => {
        setIsOpen(false)
      }}
    />
  )
}

export default CloseButton
