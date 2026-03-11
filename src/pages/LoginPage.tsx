import styles from './LoginPage.module.css'

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>C</div>
          <span className={styles.logoText}>My CRM</span>
        </div>

        <h1 className={styles.title}>로그인</h1>
        <p className={styles.subtitle}>계정 정보를 입력해주세요.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="example@company.com"
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            로그인
          </button>
        </form>
      </div>
    </div>
  )
}
