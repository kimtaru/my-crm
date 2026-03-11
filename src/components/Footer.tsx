import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.copyright}>© 2026 My CRM. All rights reserved.</span>
      <span className={styles.version}>v0.1.0</span>
    </footer>
  )
}
