import { useState } from 'react'
import { Table, type ColumnDef, type EditCellProps, type SortState } from 'mycrm'
// import Pagination from '@/components/Pagination'
// import { useCustomerList } from '@/features/customers/hooks/useCustomerList'
import type { Customer } from '@/features/customers/api'
import styles from './CustomersPage.module.css'

function formatDate(raw: string) {
  if (!raw || raw.length < 8) return '-'
  return `${raw.slice(0, 4)}.${raw.slice(4, 6)}.${raw.slice(6, 8)}`
}

function formatMarketCap(val: number | null | undefined) {
  if (val == null) return '-'
  if (val >= 10000) return `${(val / 10000).toFixed(1)}조`
  return `${val.toLocaleString()}억`
}

const COLUMNS: ColumnDef<Customer>[] = [
  { key: 'CUSTOMER_ID', label: '고객 ID', sortable: true, width: '10%', filterType: 'text',
    render: (c) => <span className={styles.cellId}>{c.CUSTOMER_ID}</span> },
  { key: 'CUSTOMER_NAME', label: '고객명', editable: true, sortable: true, insertable: true, width: '18%', filterType: 'text',
    render: (c) => <span className={styles.cellName}>{c.CUSTOMER_NAME.trim() || '-'}</span> },
  { key: 'CEO_NAME', label: '대표자', editable: true, sortable: true, insertable: true, width: '10%', filterType: 'text',
    render: (c) => c.CEO_NAME || '-' },
  { key: 'CORP_NO', label: '사업자번호', sortable: true, insertable: true, width: '11%', filterType: 'text',
    render: (c) => <span className={styles.cellMono}>{c.CORP_NO || '-'}</span> },
  { key: 'CUSTOMER_DOMAIN', label: '도메인', sortable: true, insertable: true, width: '12%', filterType: 'text',
    render: (c) => c.CUSTOMER_DOMAIN_YN === 'Y' && c.CUSTOMER_DOMAIN
      ? <span className={styles.domainBadge}>{c.CUSTOMER_DOMAIN}</span>
      : <span className={styles.cellEmpty}>-</span> },
  { key: 'CUSTOMER_ST', label: '상태', sortable: true, width: '7%',
    filterType: 'select', filterOptions: [{ label: '활성', value: '00' }, { label: '비활성', value: '01' }],
    render: (c) => (
      <span className={c.CUSTOMER_ST === '00' ? styles.stActive : styles.stInactive}>
        {c.CUSTOMER_ST === '00' ? '활성' : '비활성'}
      </span>
    )},
  { key: 'ADMIN_ID', label: '담당자', sortable: true, width: '10%',
    filterType: 'select', filterOptions: [{ label: '김철수', value: '김철수' }, { label: '박영희', value: '박영희' }, { label: '이민호', value: '이민호' }],
    render: (c) => c.ADMIN_ID || <span className={styles.cellEmpty}>-</span> },
  { key: 'MARKET_CAP', label: '시가총액(억)', sortable: true, width: '10%', filterType: 'numberRange', filterPlaceholder: '최소~최대',
    render: (c) => <span className={styles.cellMono}>{formatMarketCap(c.MARKET_CAP)}</span> },
  { key: 'REG_DT', label: '등록일', sortable: true, width: '12%', filterType: 'dateRange',
    render: (c) => <span className={styles.cellMono}>{formatDate(c.REG_DT)}</span> },
]

// TODO: 멀티소트 테스트용 더미 데이터 — 확인 후 제거
const DUMMY_CUSTOMERS: Customer[] = [
  { CUSTOMER_ID: 'C001', CUSTOMER_NAME: '삼성전자', CEO_NAME: '한종희', CORP_NO: '124-81-00998', CUSTOMER_DOMAIN: 'samsung.com', CUSTOMER_DOMAIN_YN: 'Y', CUSTOMER_ST: '00', MAIN_CUSTOMER_ID: null, REG_DT: '20240115', ADMIN_ID: '김철수', MARKET_CAP: 35000 },
  { CUSTOMER_ID: 'C002', CUSTOMER_NAME: 'LG전자', CEO_NAME: '조주완', CORP_NO: '107-86-14075', CUSTOMER_DOMAIN: 'lge.com', CUSTOMER_DOMAIN_YN: 'Y', CUSTOMER_ST: '00', MAIN_CUSTOMER_ID: null, REG_DT: '20240220', ADMIN_ID: '김철수', MARKET_CAP: 1800 },
  { CUSTOMER_ID: 'C003', CUSTOMER_NAME: 'SK하이닉스', CEO_NAME: '곽노정', CORP_NO: '203-81-24695', CUSTOMER_DOMAIN: 'skhynix.com', CUSTOMER_DOMAIN_YN: 'Y', CUSTOMER_ST: '00', MAIN_CUSTOMER_ID: null, REG_DT: '20240115', ADMIN_ID: '박영희', MARKET_CAP: 12000 },
  { CUSTOMER_ID: 'C004', CUSTOMER_NAME: '현대자동차', CEO_NAME: '장재훈', CORP_NO: '101-81-05765', CUSTOMER_DOMAIN: 'hyundai.com', CUSTOMER_DOMAIN_YN: 'Y', CUSTOMER_ST: '01', MAIN_CUSTOMER_ID: null, REG_DT: '20240310', ADMIN_ID: '박영희', MARKET_CAP: 4200 },
  { CUSTOMER_ID: 'C005', CUSTOMER_NAME: '네이버', CEO_NAME: '최수연', CORP_NO: '220-81-62517', CUSTOMER_DOMAIN: 'naver.com', CUSTOMER_DOMAIN_YN: 'Y', CUSTOMER_ST: '00', MAIN_CUSTOMER_ID: null, REG_DT: '20240220', ADMIN_ID: '이민호', MARKET_CAP: 3500 },
  { CUSTOMER_ID: 'C006', CUSTOMER_NAME: '카카오', CEO_NAME: '홍은택', CORP_NO: '120-81-47521', CUSTOMER_DOMAIN: 'kakaocorp.com', CUSTOMER_DOMAIN_YN: 'Y', CUSTOMER_ST: '01', MAIN_CUSTOMER_ID: null, REG_DT: '20240310', ADMIN_ID: '이민호', MARKET_CAP: 1500 },
  { CUSTOMER_ID: 'C007', CUSTOMER_NAME: '쿠팡', CEO_NAME: '강한승', CORP_NO: '120-87-65141', CUSTOMER_DOMAIN: 'coupang.com', CUSTOMER_DOMAIN_YN: 'Y', CUSTOMER_ST: '00', MAIN_CUSTOMER_ID: null, REG_DT: '20240115', ADMIN_ID: '김철수', MARKET_CAP: 5500 },
  { CUSTOMER_ID: 'C008', CUSTOMER_NAME: '배달의민족', CEO_NAME: '김봉진', CORP_NO: '120-87-89234', CUSTOMER_DOMAIN: 'baemin.com', CUSTOMER_DOMAIN_YN: 'Y', CUSTOMER_ST: '01', MAIN_CUSTOMER_ID: null, REG_DT: '20240220', ADMIN_ID: '박영희', MARKET_CAP: 800 },
  { CUSTOMER_ID: 'C009', CUSTOMER_NAME: '토스', CEO_NAME: '이승건', CORP_NO: '250-87-01280', CUSTOMER_DOMAIN: 'toss.im', CUSTOMER_DOMAIN_YN: 'Y', CUSTOMER_ST: '00', MAIN_CUSTOMER_ID: null, REG_DT: '20240310', ADMIN_ID: '김철수', MARKET_CAP: 1600 },
  { CUSTOMER_ID: 'C010', CUSTOMER_NAME: '당근마켓', CEO_NAME: '김용현', CORP_NO: '783-81-00370', CUSTOMER_DOMAIN: 'daangn.com', CUSTOMER_DOMAIN_YN: 'Y', CUSTOMER_ST: '00', MAIN_CUSTOMER_ID: null, REG_DT: '20240115', ADMIN_ID: '이민호', MARKET_CAP: 350 },
  { CUSTOMER_ID: 'C011', CUSTOMER_NAME: '라인', CEO_NAME: '출자와 아키라', CORP_NO: '220-88-53384', CUSTOMER_DOMAIN: 'linecorp.com', CUSTOMER_DOMAIN_YN: 'Y', CUSTOMER_ST: '01', MAIN_CUSTOMER_ID: null, REG_DT: '20240220', ADMIN_ID: '이민호', MARKET_CAP: 2800 },
  { CUSTOMER_ID: 'C012', CUSTOMER_NAME: '크래프톤', CEO_NAME: '김창한', CORP_NO: '894-81-00440', CUSTOMER_DOMAIN: 'krafton.com', CUSTOMER_DOMAIN_YN: 'Y', CUSTOMER_ST: '00', MAIN_CUSTOMER_ID: null, REG_DT: '20240310', ADMIN_ID: '박영희', MARKET_CAP: 2200 },
]

export default function CustomersPage() {
  const [sorts, setSorts] = useState<SortState[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [showFilter, setShowFilter] = useState(false)

  const filteredCustomers = DUMMY_CUSTOMERS.filter((c) => {
    for (const [key, val] of Object.entries(filters)) {
      if (!val) continue
      const cellVal = String((c as unknown as Record<string, unknown>)[key] ?? '')
      if (key === 'CUSTOMER_ST' || key === 'ADMIN_ID') {
        if (cellVal !== val) return false
      } else if (val.includes('~')) {
        const [from, to] = val.split('~')
        const col = COLUMNS.find((col) => col.key === key)
        if (col?.filterType === 'numberRange') {
          const num = Number(cellVal)
          if (from && num < Number(from)) return false
          if (to && num > Number(to)) return false
        } else {
          const normalized = cellVal.replace(/-/g, '')
          if (from && normalized < from.replace(/-/g, '')) return false
          if (to && normalized > to.replace(/-/g, '')) return false
        }
      } else {
        if (!cellVal.toLowerCase().includes(val.toLowerCase())) return false
      }
    }
    return true
  })

  // TODO: 더미 데이터 사용 중 — API 복원 시 아래 주석 해제
  // const [page, setPage] = useState(1)
  // const { data, isLoading: queryLoading, error } = useCustomerList({ page })
  // const totalPages = data ? Math.ceil(data.total / data.page_size) : 0

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>고객 목록</h1>
        <span className={styles.pageCount}>총 {filteredCustomers.length}건 (더미)</span>
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

      <Table
          columns={COLUMNS}
          data={filteredCustomers}
          filterable={showFilter}
          filters={filters}
          onFilterChange={(key, val) => setFilters((prev) => ({ ...prev, [key]: val }))}
          filterDebounce={300}
          headerMenuItems={[
            { label: showFilter ? '필터 숨기기' : '필터', onClick: () => setShowFilter((v) => !v) },
            { label: '필터 초기화', onClick: () => setFilters({}) },
            { label: '정렬 초기화', onClick: () => setSorts([]) },
          ]}
          rowKey={(c) => c.CUSTOMER_ID}
          classNames={{
            wrap: styles.tableWrap,
            table: styles.table,
            th: styles.th,
            tr: styles.tr,
            td: styles.td,
            checkbox: styles.checkbox,
            checkboxChecked: styles.checkboxChecked,
            filterRow: styles.filterRow,
            filterCell: styles.filterCell,
            filterInput: styles.filterInput,
            filterSelect: styles.filterSelect,
            headerMenuBtn: styles.headerMenuBtn,
            headerMenuDropdown: styles.headerMenuDropdown,
            headerMenuItem: styles.headerMenuItem,
          }}
          resizable
          columnWidths={columnWidths}
          onColumnWidthChange={(key, width) => setColumnWidths((prev) => ({ ...prev, [key]: width }))}
          selectable
          selectedKeys={selectedKeys}
          onSelectedKeysChange={setSelectedKeys}
          sorts={sorts}
          onSortsChange={setSorts}
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
    </div>
  )
}
