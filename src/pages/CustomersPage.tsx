import { useState, useMemo } from 'react'
import { Table, type ColumnDef, type EditCellProps, type SortState } from 'mycrm'
import { useCustomerInfiniteList } from '@/features/customers/hooks/useCustomerInfiniteList'
import { useCustomerList } from '@/features/customers/hooks/useCustomerList'
import Pagination from '@/components/Pagination'
import type { Customer } from '@/features/customers/api'
import styles from './CustomersPage.module.css'

function formatDate(raw: string) {
  if (!raw || raw.length < 8) return '-'
  return `${raw.slice(0, 4)}.${raw.slice(4, 6)}.${raw.slice(6, 8)}`
}

const COLUMNS: ColumnDef<Customer>[] = [
  { key: 'CUSTOMER_ID', label: '고객 ID', sortable: true, width: '10%', filterType: 'text',
    render: (c) => <span className={styles.cellId}>{c.CUSTOMER_ID}</span> },
  { key: 'CUSTOMER_NAME', label: '고객명', editable: true, sortable: true, insertable: true, width: '22%', filterType: 'text',
    render: (c) => <span className={styles.cellName}>{c.CUSTOMER_NAME.trim() || '-'}</span> },
  { key: 'CEO_NAME', label: '대표자', editable: true, sortable: true, insertable: true, width: '12%', filterType: 'text',
    render: (c) => c.CEO_NAME || '-' },
  { key: 'CORP_NO', label: '사업자번호', sortable: true, insertable: true, width: '13%', filterType: 'text',
    render: (c) => <span className={styles.cellMono}>{c.CORP_NO || '-'}</span> },
  { key: 'CUSTOMER_DOMAIN', label: '도메인', sortable: true, insertable: true, width: '14%', filterType: 'text',
    render: (c) => c.CUSTOMER_DOMAIN_YN === 'Y' && c.CUSTOMER_DOMAIN
      ? <span className={styles.domainBadge}>{c.CUSTOMER_DOMAIN}</span>
      : <span className={styles.cellEmpty}>-</span> },
  { key: 'CUSTOMER_ST', label: '상태', sortable: true, width: '8%',
    filterType: 'select', filterOptions: [{ label: '활성', value: '00' }, { label: '비활성', value: '01' }],
    render: (c) => (
      <span className={c.CUSTOMER_ST === '00' ? styles.stActive : styles.stInactive}>
        {c.CUSTOMER_ST === '00' ? '활성' : '비활성'}
      </span>
    )},
  { key: 'ADMIN_ID', label: '담당자', sortable: true, width: '10%',
    filterType: 'select', filterOptions: [{ label: '김철수', value: '김철수' }, { label: '박영희', value: '박영희' }, { label: '이민호', value: '이민호' }],
    render: (c) => c.ADMIN_ID || <span className={styles.cellEmpty}>-</span> },
  { key: 'REG_DT', label: '등록일', sortable: true, width: '11%', filterType: 'dateRange',
    render: (c) => <span className={styles.cellMono}>{formatDate(c.REG_DT)}</span> },
]

const TABLE_CLASS_NAMES = {
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
  addRow: styles.addRow,
  addInput: styles.addInput,
  addConfirmBtn: styles.addConfirmBtn,
  addCancelBtn: styles.addCancelBtn,
}

function renderEditCellUI({ value, onChange, onSave, onCancel }: EditCellProps) {
  return (
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
  )
}

/* ── 인피니트 스크롤 테이블 ── */
function InfiniteScrollTable() {
  const [sorts, setSorts] = useState<SortState[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [showFilter, setShowFilter] = useState(false)

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useCustomerInfiniteList()

  const customers = useMemo(
    () => data?.pages.flatMap((p) => p.customers) ?? [],
    [data],
  )
  const total = data?.pages[0]?.total ?? 0

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>인피니트 스크롤</h2>
        <span className={styles.pageCount}>총 {total}건 (현재 {customers.length}건 로드)</span>
        <div className={styles.actionBar}>
          <button type="button" className={styles.addBtn} onClick={() => setIsAdding(true)} disabled={isAdding}>추가</button>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={() => { if (selectedKeys.length > 0) { console.log('삭제:', selectedKeys); setSelectedKeys([]) } }}
            disabled={selectedKeys.length === 0}
          >
            삭제{selectedKeys.length > 0 && ` (${selectedKeys.length})`}
          </button>
        </div>
      </div>
      <Table
        columns={COLUMNS}
        data={customers}
        loading={isLoading}
        stickyHeader
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
        classNames={TABLE_CLASS_NAMES}
        resizable
        columnWidths={columnWidths}
        onColumnWidthChange={(key, width) => setColumnWidths((prev) => ({ ...prev, [key]: width }))}
        selectable
        selectedKeys={selectedKeys}
        onSelectedKeysChange={setSelectedKeys}
        sorts={sorts}
        onSortsChange={setSorts}
        onCellChange={(rowKey, colKey, value) => console.log('수정:', { rowKey, colKey, value })}
        addingRow={isAdding}
        onRowAdd={(values) => { console.log('추가:', values); setIsAdding(false) }}
        onAddingRowCancel={() => setIsAdding(false)}
        deletable
        onRowDelete={(key) => console.log('삭제:', key)}
        onLoadMore={() => fetchNextPage()}
        hasMore={!!hasNextPage}
        loadingMore={isFetchingNextPage}
        renderEditCell={renderEditCellUI}
      />
    </section>
  )
}

/* ── 페이지네이션 테이블 ── */
function PaginationTable() {
  const [page, setPage] = useState(1)
  const [sorts, setSorts] = useState<SortState[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [showFilter, setShowFilter] = useState(false)

  const { data, isLoading } = useCustomerList({ page })
  const customers = data?.customers ?? []
  const total = data?.total ?? 0
  const totalPages = data ? Math.ceil(data.total / data.page_size) : 0

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>페이지네이션</h2>
        <span className={styles.pageCount}>총 {total}건</span>
        <div className={styles.actionBar}>
          <button type="button" className={styles.addBtn} onClick={() => setIsAdding(true)} disabled={isAdding}>추가</button>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={() => { if (selectedKeys.length > 0) { console.log('삭제:', selectedKeys); setSelectedKeys([]) } }}
            disabled={selectedKeys.length === 0}
          >
            삭제{selectedKeys.length > 0 && ` (${selectedKeys.length})`}
          </button>
        </div>
      </div>
      <Table
        columns={COLUMNS}
        data={customers}
        loading={isLoading}
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
        classNames={TABLE_CLASS_NAMES}
        resizable
        columnWidths={columnWidths}
        onColumnWidthChange={(key, width) => setColumnWidths((prev) => ({ ...prev, [key]: width }))}
        selectable
        selectedKeys={selectedKeys}
        onSelectedKeysChange={setSelectedKeys}
        sorts={sorts}
        onSortsChange={setSorts}
        onCellChange={(rowKey, colKey, value) => console.log('수정:', { rowKey, colKey, value })}
        addingRow={isAdding}
        onRowAdd={(values) => { console.log('추가:', values); setIsAdding(false) }}
        onAddingRowCancel={() => setIsAdding(false)}
        deletable
        onRowDelete={(key) => console.log('삭제:', key)}
        renderEditCell={renderEditCellUI}
      />
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </section>
  )
}

/* ── 메인 페이지 ── */
export default function CustomersPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle} style={{ marginBottom: 20 }}>고객 목록</h1>
      <InfiniteScrollTable />
      <PaginationTable />
    </div>
  )
}
