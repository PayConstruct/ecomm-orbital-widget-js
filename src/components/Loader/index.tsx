import styles from './Loader.module.scss'
import CloseButton from './CloseButton'
const Loader = () => {
  return (
    <div className={styles['loader']}>
      <div className={styles['loader-header']}>
        <h1> Pay with your wallet</h1>
        <CloseButton />
      </div>
      <div className={styles['loader-content']}>
        <div className={styles['loader-content__bg']}>
          <span className={styles['loader-content__dot']}></span>
        </div>
        <p>Generating deposit address</p>
      </div>
    </div>
  )
}

export default Loader
