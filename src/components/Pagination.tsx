import styles from './Pagination.module.css'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
  windowSize?: number
}

/**
 * 페이지 번호 탐색 컴포넌트
 *
 * @example
 * ```tsx
 * import Pagination from '@/components/Pagination'
 *
 * const [page, setPage] = useState(1)
 * const totalPages = Math.ceil(total / pageSize)
 *
 * <Pagination
 *   page={page}
 *   totalPages={totalPages}
 *   onChange={setPage}
 *   windowSize={5}
 * />
 * ```
 *
 * @param page        현재 페이지 번호 (1-based)
 * @param totalPages  전체 페이지 수. 1 이하이면 렌더링하지 않음
 * @param onChange    페이지 변경 시 호출되는 콜백
 * @param windowSize  한 번에 표시할 페이지 버튼 수 (기본값: 5)
 */
export default function Pagination({ page, totalPages, onChange, windowSize = 5 }: PaginationProps) {
  if (totalPages <= 1) return null

  const half = Math.floor(windowSize / 2)
  const start = Math.max(1, Math.min(page - half, totalPages - windowSize + 1))
  const end = Math.min(totalPages, start + windowSize - 1)
  const pageNumbers = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <div className={styles.pagination}>
      <button className={styles.btn} onClick={() => onChange(1)} disabled={page === 1}>«</button>
      <button className={styles.btn} onClick={() => onChange(page - 1)} disabled={page === 1}>‹</button>

      {pageNumbers.map((n) => (
        <button
          key={n}
          className={`${styles.btn} ${n === page ? styles.btnActive : ''}`}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}

      <button className={styles.btn} onClick={() => onChange(page + 1)} disabled={page === totalPages}>›</button>
      <button className={styles.btn} onClick={() => onChange(totalPages)} disabled={page === totalPages}>»</button>

      <span className={styles.info}>{page} / {totalPages.toLocaleString()} 페이지</span>
    </div>
  )
}
