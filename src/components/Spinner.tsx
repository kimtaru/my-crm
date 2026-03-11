import styles from './Spinner.module.css'

export default function Spinner() {
  return (
    <div className={styles.wrapper} aria-label="로딩 중">
      <div className={styles.spinner} />
    </div>
  )
}
