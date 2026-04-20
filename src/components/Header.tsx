import { Link, NavLink } from 'react-router-dom'
import styles from './Header.module.css'

const NAV_ITEMS = [
  { path: '/', label: '대시보드' },
  { path: '/table', label: '테이블' },
  { path: '/calendar', label: '캘린더' },
  { path: '/orders', label: '칸반보드' },
] as const

export default function Header() {
  const isLoggedIn = false

  return (
    <header className={styles.header}>
      <NavLink to="/" className={styles.logo}>
        <div className={styles.logoIcon}>C</div>
        <span className={styles.logoText}>My CRM</span>
      </NavLink>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `${styles.navLink}${isActive ? ` ${styles.active}` : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.userArea}>
        {isLoggedIn ? (
          <>
            <button className={styles.notificationBtn} aria-label="알림">
              🔔
              <span className={styles.badge} />
            </button>
            <button className={styles.userBtn} aria-label="사용자 메뉴">
              <div className={styles.avatar}>김</div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>김진솔</span>
                <span className={styles.userRole}>영업팀</span>
              </div>
              <span className={styles.chevron}>▼</span>
            </button>
          </>
        ) : (
          <Link to="/login" className={styles.loginBtn}>로그인</Link>
        )}
      </div>
    </header>
  )
}
