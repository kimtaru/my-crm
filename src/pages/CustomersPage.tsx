import { useState } from 'react'
import Table, { type ColumnDef, type EditCellProps, type SortState } from '@/components/Table'
import Pagination from '@/components/Pagination'
import { useCustomerList } from '@/features/customers/hooks/useCustomerList'
import type { Customer } from '@/features/customers/api'
import styles from './CustomersPage.module.css'

function formatDate(raw: string) {
  if (!raw || raw.length < 8) return '-'
  return `${raw.slice(0, 4)}.${raw.slice(4, 6)}.${raw.slice(6, 8)}`
}

const COLUMNS: ColumnDef<Customer>[] = [
  { key: 'CUSTOMER_ID', label: '고객 ID', sortable: true, width: '10%',
    render: (c) => <span className={styles.cellId}>{c.CUSTOMER_ID}</span> },
  { key: 'CUSTOMER_NAME', label: '고객명', editable: true, sortable: true, insertable: true, width: '18%',
    render: (c) => <span className={styles.cellName}>{c.CUSTOMER_NAME.trim() || '-'}</span> },
  { key: 'CEO_NAME', label: '대표자', editable: true, sortable: true, insertable: true, width: '10%',
    render: (c) => c.CEO_NAME || '-' },
  { key: 'CORP_NO', label: '사업자번호', sortable: true, insertable: true, width: '11%',
    render: (c) => <span className={styles.cellMono}>{c.CORP_NO || '-'}</span> },
  { key: 'CUSTOMER_DOMAIN', label: '도메인', sortable: true, insertable: true, width: '12%',
    render: (c) => c.CUSTOMER_DOMAIN_YN === 'Y' && c.CUSTOMER_DOMAIN
      ? <span className={styles.domainBadge}>{c.CUSTOMER_DOMAIN}</span>
      : <span className={styles.cellEmpty}>-</span> },
  { key: 'CUSTOMER_ST', label: '상태', sortable: true, width: '7%',
    render: (c) => (
      <span className={c.CUSTOMER_ST === '00' ? styles.stActive : styles.stInactive}>
        {c.CUSTOMER_ST === '00' ? '활성' : c.CUSTOMER_ST}
      </span>
    )},
  { key: 'ADMIN_ID', label: '담당자', sortable: true, width: '10%',
    render: (c) => c.ADMIN_ID || <span className={styles.cellEmpty}>-</span> },
  { key: 'REG_DT', label: '등록일', sortable: true, width: '10%',
    render: (c) => <span className={styles.cellMono}>{formatDate(c.REG_DT)}</span> },
]

export default function CustomersPage() {
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<SortState | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const { data, isLoading, error } = useCustomerList({ page })

  const totalPages = data ? Math.ceil(data.total / data.page_size) : 0

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>고객 목록</h1>
        {data && <span className={styles.pageCount}>총 {data.total.toLocaleString()}건</span>}
        <button type="button" className={styles.addBtn} onClick={() => setIsAdding(true)} disabled={isAdding}>
          추가
        </button>
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={() => {
            if (selectedKeys.length === 0) return
            console.log('삭제:', selectedKeys)
            // TODO: API 호출
            setSelectedKeys([])
          }}
          disabled={selectedKeys.length === 0}
        >
          삭제{selectedKeys.length > 0 && ` (${selectedKeys.length})`}
        </button>
      </div>

      {isLoading && <div>데이터 불러오는 중...</div>}
      {error && <div>API 연결 실패: {error.message}</div>}
      {!isLoading && !error && (
        <Table
          columns={COLUMNS}
          data={data?.customers ?? []}
          rowKey={(c) => c.CUSTOMER_ID}
          classNames={{
            wrap: styles.tableWrap,
            table: styles.table,
            th: styles.th,
            tr: styles.tr,
            td: styles.td,
            checkbox: styles.checkbox,
            checkboxChecked: styles.checkboxChecked,
          }}
          selectable
          selectedKeys={selectedKeys}
          onSelectedKeysChange={setSelectedKeys}
          sort={sort}
          onSortChange={setSort}
          onCellChange={(rowKey, colKey, value) => {
            console.log('수정:', { rowKey, colKey, value })
            // TODO: API 호출
          }}
          addingRow={isAdding}
          onRowAdd={(values) => {
            console.log('추가:', values)
            // TODO: API 호출
            setIsAdding(false)
          }}
          onAddingRowCancel={() => setIsAdding(false)}
          deletable
          onRowDelete={(key) => {
            console.log('삭제:', key)
            // TODO: API 호출
          }}
          renderEditCell={({ value, onChange, onSave, onCancel }: EditCellProps) => (
            <span className={styles.editWrap}>
              <input
                className={styles.editInput}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSave()
                  if (e.key === 'Escape') onCancel()
                }}
                autoFocus
              />
              <button type="button" className={styles.editSaveBtn} onClick={onSave} aria-label="저장">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
              <button type="button" className={styles.editCancelBtn} onClick={onCancel} aria-label="취소">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </span>
          )}
        />
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  )
}
