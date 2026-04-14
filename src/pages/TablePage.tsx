import { useState, useMemo } from 'react'
import { Table, type ColumnDef, type ExpandDef, type EditCellProps, type SortState } from '@mycrm-ui/react-table'
import { useCustomerInfiniteList } from '@/features/customers/hooks/useCustomerInfiniteList'
import { useCustomerList } from '@/features/customers/hooks/useCustomerList'
import Pagination from '@/components/Pagination'
import type { Customer } from '@/features/customers/api'
import styles from './TablePage.module.css'
import _groupedData from './groupedCustomers.json'

function formatDate(raw: string) {
  if (!raw || raw.length < 8) return '-'
  return `${raw.slice(0, 4)}.${raw.slice(4, 6)}.${raw.slice(6, 8)}`
}

function formatNumber(n: number | null) {
  if (n == null) return '-'
  return n.toLocaleString()
}

function validateCustomerName(v: string): string | null {
  if (!v.trim()) return '고객명을 입력해주세요'
  if (v.trim().length < 2) return '고객명은 2글자 이상 입력해주세요'
  return null
}

const COLUMNS: ColumnDef<Customer>[] = [
  { key: 'CUSTOMER_ID', label: '고객 ID', sortable: true, width: '100px', filterType: 'text',
    render: (c) => <span className={styles.cellId}>{c.CUSTOMER_ID}</span> },
  { key: 'CUSTOMER_NAME', label: '고객명', editable: true, sortable: true, insertable: true, width: '180px', filterType: 'text',
    render: (c) => <span className={styles.cellName}>{c.CUSTOMER_NAME.trim() || '-'}</span>,
    validate: validateCustomerName,
    onValidationError: (err) => alert(err) },
  { key: 'CEO_NAME', label: '대표자', editable: true, sortable: true, insertable: true, width: '100px', filterType: 'text',
    render: (c) => c.CEO_NAME || '-',
    validate: (v) => v.trim() ? null : '대표자를 입력해주세요' },
  { key: 'CORP_NO', label: '사업자번호', sortable: true, insertable: true, width: '130px', filterType: 'text',
    render: (c) => <span className={styles.cellMono}>{c.CORP_NO || '-'}</span> },
  { key: 'CUSTOMER_DOMAIN', label: '도메인', sortable: true, insertable: true, width: '160px', filterType: 'text', copyable: true,
    render: (c) => c.CUSTOMER_DOMAIN_YN === 'Y' && c.CUSTOMER_DOMAIN
      ? <span className={styles.domainBadge}>{c.CUSTOMER_DOMAIN}</span>
      : <span className={styles.cellEmpty}>-</span> },
  { key: 'CUSTOMER_DOMAIN_YN', label: '도메인 여부', sortable: true, width: '90px', align: 'center',
    filterType: 'select', filterOptions: [{ label: 'Y', value: 'Y' }, { label: 'N', value: 'N' }],
    render: (c) => (
      <span className={c.CUSTOMER_DOMAIN_YN === 'Y' ? styles.badgeY : styles.badgeN}>
        {c.CUSTOMER_DOMAIN_YN}
      </span>
    )},
  { key: 'CUSTOMER_ST', label: '상태', sortable: true, width: '80px',
    filterType: 'select', filterOptions: [{ label: '활성', value: '00' }, { label: '비활성', value: '01' }],
    render: (c) => (
      <span className={c.CUSTOMER_ST === '00' ? styles.stActive : styles.stInactive}>
        {c.CUSTOMER_ST === '00' ? '활성' : '비활성'}
      </span>
    )},
  { key: 'MAIN_CUSTOMER_ID', label: '상위고객', sortable: true, width: '100px', filterType: 'text',
    render: (c) => c.MAIN_CUSTOMER_ID
      ? <span className={styles.cellId}>{c.MAIN_CUSTOMER_ID}</span>
      : <span className={styles.cellEmpty}>-</span> },
  { key: 'CUSTOMER_TYPE', label: '고객유형', sortable: true, width: '100px',
    filterType: 'select', filterOptions: [
      { label: '대기업', value: '대기업' }, { label: '중견기업', value: '중견기업' },
      { label: '중소기업', value: '중소기업' }, { label: '스타트업', value: '스타트업' },
    ],
    render: (c) => c.CUSTOMER_TYPE || <span className={styles.cellEmpty}>-</span> },
  { key: 'INDUSTRY', label: '업종', sortable: true, width: '120px', filterType: 'text',
    render: (c) => c.INDUSTRY || <span className={styles.cellEmpty}>-</span> },
  { key: 'EMPLOYEE_CNT', label: '직원 수', sortable: true, width: '100px', filterType: 'text',
    render: (c) => <span className={styles.cellMono}>{formatNumber(c.EMPLOYEE_CNT)}</span> },
  { key: 'ANNUAL_REVENUE', label: '연매출(억)', sortable: true, width: '110px', filterType: 'text',
    render: (c) => <span className={styles.cellMono}>{formatNumber(c.ANNUAL_REVENUE)}</span> },
  { key: 'PHONE_NO', label: '전화번호', sortable: true, width: '130px', filterType: 'text',
    render: (c) => <span className={styles.cellMono}>{c.PHONE_NO || '-'}</span> },
  { key: 'EMAIL', label: '이메일', sortable: true, width: '180px', filterType: 'text',
    render: (c) => c.EMAIL
      ? <span className={styles.cellEmail}>{c.EMAIL}</span>
      : <span className={styles.cellEmpty}>-</span> },
  { key: 'ADDRESS', label: '주소', sortable: true, width: '250px', filterType: 'text',
    render: (c) => c.ADDRESS || <span className={styles.cellEmpty}>-</span> },
  { key: 'CITY', label: '도시', sortable: true, width: '80px', filterType: 'text',
    render: (c) => c.CITY || <span className={styles.cellEmpty}>-</span> },
  { key: 'CUSTOMER_GRADE', label: '등급', sortable: true, width: '70px',
    filterType: 'select', filterOptions: [
      { label: 'A', value: 'A' }, { label: 'B', value: 'B' },
      { label: 'C', value: 'C' }, { label: 'D', value: 'D' },
    ],
    render: (c) => c.CUSTOMER_GRADE
      ? <span className={styles[`grade${c.CUSTOMER_GRADE}` as keyof typeof styles]}>{c.CUSTOMER_GRADE}</span>
      : <span className={styles.cellEmpty}>-</span> },
  { key: 'CONTRACT_ST', label: '계약상태', sortable: true, width: '100px',
    filterType: 'select', filterOptions: [
      { label: '계약중', value: '계약중' }, { label: '계약만료', value: '계약만료' },
      { label: '협의중', value: '협의중' }, { label: '없음', value: '없음' },
    ],
    render: (c) => c.CONTRACT_ST
      ? <span className={styles[`contract${c.CONTRACT_ST}` as keyof typeof styles] || ''}>{c.CONTRACT_ST}</span>
      : <span className={styles.cellEmpty}>-</span> },
  { key: 'CONTRACT_DT', label: '계약시작일', sortable: true, width: '110px', filterType: 'dateRange',
    render: (c) => <span className={styles.cellMono}>{formatDate(c.CONTRACT_DT ?? '')}</span> },
  { key: 'CONTRACT_END_DT', label: '계약종료일', sortable: true, width: '110px', filterType: 'dateRange',
    render: (c) => <span className={styles.cellMono}>{formatDate(c.CONTRACT_END_DT ?? '')}</span> },
  { key: 'LAST_CONTACT_DT', label: '최근접촉일', sortable: true, width: '110px', filterType: 'dateRange',
    render: (c) => <span className={styles.cellMono}>{formatDate(c.LAST_CONTACT_DT ?? '')}</span> },
  { key: 'STOCK_YN', label: '상장', sortable: true, width: '70px',
    filterType: 'select', filterOptions: [{ label: 'Y', value: 'Y' }, { label: 'N', value: 'N' }],
    render: (c) => (
      <span className={c.STOCK_YN === 'Y' ? styles.badgeY : styles.badgeN}>
        {c.STOCK_YN}
      </span>
    )},
  { key: 'ADMIN_ID', label: '담당자', sortable: true, width: '90px',
    filterType: 'select', filterOptions: [{ label: '김철수', value: '김철수' }, { label: '박영희', value: '박영희' }, { label: '이민호', value: '이민호' }],
    render: (c) => c.ADMIN_ID || <span className={styles.cellEmpty}>-</span> },
  { key: 'REG_DT', label: '등록일', sortable: true, width: '110px', filterType: 'dateRange',
    render: (c) => <span className={styles.cellMono}>{formatDate(c.REG_DT)}</span> },
  { key: 'MEMO', label: '메모', width: '250px', editable: true, insertable: true,
    render: (c) => c.MEMO
      ? <span>{c.MEMO}</span>
      : <span className={styles.cellEmpty}>-</span>,
    renderEditCell: ({ value, onChange, onSave, onCancel }) => (
      <div className={styles.memoEditWrap}>
        <textarea
          className={styles.editTextarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onCancel()
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) onSave()
          }}
          autoFocus
          rows={3}
        />
        <span className={styles.memoEditActions}>
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
      </div>
    ) },
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
  columnManagerBackdrop: styles.columnManagerBackdrop,
  columnManager: styles.columnManager,
  columnManagerHeader: styles.columnManagerHeader,
  columnManagerTitle: styles.columnManagerTitle,
  columnManagerSelectAllBtn: styles.columnManagerSelectAllBtn,
  columnManagerDeselectAllBtn: styles.columnManagerDeselectAllBtn,
  columnManagerCloseBtn: styles.columnManagerCloseBtn,
  columnManagerBody: styles.columnManagerBody,
  columnToggle: styles.columnToggle,
  columnToggleActive: styles.columnToggleActive,
  columnToggleCheckbox: styles.columnToggleCheckbox,
  contextMenu: styles.contextMenu,
  contextMenuItem: styles.contextMenuItem,
  cellCopyMenu: styles.cellCopyMenu,
  cellCopyMenuItem: styles.cellCopyMenuItem,
  tooltip: styles.tooltip,
}

function renderEditCellUI({ value, onChange, onSave, onCancel, error }: EditCellProps) {
  return (
    <span className={styles.editWrap} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <input
          className={styles.editInput}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave()
            if (e.key === 'Escape') onCancel()
          }}
          autoFocus
          style={error ? { borderColor: '#e53e3e', outlineColor: '#e53e3e' } : undefined}
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
      {error && <span style={{ color: '#e53e3e', fontSize: '12px', marginTop: 2, whiteSpace: 'normal', wordBreak: 'keep-all' }}>{error}</span>}
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
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([])
  const [columnOrder, setColumnOrder] = useState(() => COLUMNS.map((c) => c.key))
  const [pinnedKeys, setPinnedKeys] = useState<{ left?: string[]; right?: string[] }>({})

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
        rowKey={(c) => c.CUSTOMER_ID}
        classNames={TABLE_CLASS_NAMES}
        loading={{ enabled: isLoading }}
        scroll={{
          stickyHeader: true,
          virtual: true,
          rowHeight: 44,
          onLoadMore: () => fetchNextPage(),
          hasMore: !!hasNextPage,
          loadingMore: isFetchingNextPage,
        }}
        columnManager={{
          hiddenKeys,
          onHiddenKeysChange: setHiddenKeys,
          order: columnOrder,
          onOrderChange: setColumnOrder,
          pinned: pinnedKeys,
          onPinnedChange: setPinnedKeys,
          pinnedBg: { header: '#1e293b', body: '#0f172a' },
          resizable: true,
          widths: columnWidths,
          onWidthChange: (key, width) => setColumnWidths((prev) => ({ ...prev, [key]: width })),
        }}
        filter={{
          enabled: showFilter,
          values: filters,
          onChange: (key, val) => setFilters((prev) => ({ ...prev, [key]: val })),
          debounce: 300,
        }}
        headerMenuItems={[
          { label: showFilter ? '필터 숨기기' : '필터', onClick: () => setShowFilter((v) => !v) },
          { label: '필터 초기화', onClick: () => setFilters({}) },
          { label: '정렬 초기화', onClick: () => setSorts([]) },
        ]}
        selection={{ enabled: true, keys: selectedKeys, onChange: setSelectedKeys }}
        sorting={{ sorts, onSortsChange: setSorts }}
        editing={{
          onCellChange: (rowKey, colKey, value) => console.log('수정:', { rowKey, colKey, value }),
          renderCell: renderEditCellUI,
        }}
        rowActions={{
          adding: isAdding,
          onAdd: (values) => { console.log('추가:', values); setIsAdding(false) },
          onAddCancel: () => setIsAdding(false),
          deletable: true,
          onDelete: (key) => console.log('삭제:', key),
        }}
        onRowClick={(_row, _rk, _e) => console.log('[Click]', JSON.stringify(_row, null, 2))}
        onRowDoubleClick={(_row, _rk, _e) => console.log('[DblClick]', JSON.stringify(_row, null, 2))}
        rowClassName={(row) => (row as any).EMPLOYEE_CNT <= 10000 ? styles.smallCompanyRow : undefined}
        tooltip
        onCellCopy={() => alert('복사되었습니다.')}
        cellContextMenuItems={[
          { label: '테스트_구현중', onClick: () => alert('구현중') },
        ]}
        keyboardNavigation
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
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([])
  const [columnOrder, setColumnOrder] = useState(() => COLUMNS.map((c) => c.key))
  const [pinnedKeys, setPinnedKeys] = useState<{ left?: string[]; right?: string[] }>({})

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
        rowKey={(c) => c.CUSTOMER_ID}
        classNames={TABLE_CLASS_NAMES}
        loading={{ enabled: isLoading }}
        columnManager={{
          hiddenKeys,
          onHiddenKeysChange: setHiddenKeys,
          order: columnOrder,
          onOrderChange: setColumnOrder,
          pinned: pinnedKeys,
          onPinnedChange: setPinnedKeys,
          pinnedBg: { header: '#1e293b', body: '#0f172a' },
          resizable: true,
          widths: columnWidths,
          onWidthChange: (key, width) => setColumnWidths((prev) => ({ ...prev, [key]: width })),
        }}
        filter={{
          enabled: showFilter,
          values: filters,
          onChange: (key, val) => setFilters((prev) => ({ ...prev, [key]: val })),
          debounce: 300,
        }}
        headerMenuItems={[
          { label: showFilter ? '필터 숨기기' : '필터', onClick: () => setShowFilter((v) => !v) },
          { label: '필터 초기화', onClick: () => setFilters({}) },
          { label: '정렬 초기화', onClick: () => setSorts([]) },
        ]}
        selection={{ enabled: true, keys: selectedKeys, onChange: setSelectedKeys }}
        sorting={{ sorts, onSortsChange: setSorts }}
        editing={{
          onCellChange: (rowKey, colKey, value) => console.log('수정:', { rowKey, colKey, value }),
          renderCell: renderEditCellUI,
        }}
        rowActions={{
          adding: isAdding,
          onAdd: (values) => { console.log('추가:', values); setIsAdding(false) },
          onAddCancel: () => setIsAdding(false),
          deletable: true,
          onDelete: (key) => console.log('삭제:', key),
        }}
        onRowClick={(_row, _rk, _e) => console.log('[Click]', JSON.stringify(_row, null, 2))}
        onRowDoubleClick={(_row, _rk, _e) => console.log('[DblClick]', JSON.stringify(_row, null, 2))}
        rowClassName={(row) => (row as any).EMPLOYEE_CNT <= 10000 ? styles.smallCompanyRow : undefined}
        onCellCopy={() => alert('복사되었습니다.')}
        cellContextMenuItems={[
          { label: '테스트_구현중', onClick: () => alert('구현중') },
        ]}
        keyboardNavigation
      />
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </section>
  )
}

/* ── 지역별 그룹 테이블 ── */
interface CustomerTypeGroup {
  type: string
  customers: Customer[]
}

interface CustomerAreaGroup {
  area: string
  typeGroups: CustomerTypeGroup[]
}

const GROUPED_DUMMY_DATA = _groupedData as CustomerAreaGroup[]

const CHILD_COLUMNS: ColumnDef<Customer>[] = [
  { key: 'CUSTOMER_ID', label: '고객 ID', width: '100px', sortable: true, filterType: 'text',
    render: (c) => <span className={styles.cellId}>{c.CUSTOMER_ID}</span> },
  { key: 'CUSTOMER_NAME', label: '고객명', width: '180px', editable: true, sortable: true, filterType: 'text',
    render: (c) => <span className={styles.cellName}>{c.CUSTOMER_NAME.trim() || '-'}</span>,
    validate: validateCustomerName,
    onValidationError: (err) => alert(err) },
  { key: 'CEO_NAME', label: '대표자', width: '100px', editable: true, sortable: true, filterType: 'text',
    render: (c) => c.CEO_NAME || '-',
    validate: (v) => v.trim() ? null : '대표자를 입력해주세요' },
  { key: 'CORP_NO', label: '사업자번호', width: '130px', filterType: 'text',
    render: (c) => <span className={styles.cellMono}>{c.CORP_NO || '-'}</span> },
  { key: 'CUSTOMER_TYPE', label: '고객유형', width: '100px', sortable: true,
    filterType: 'select', filterOptions: [
      { label: '대기업', value: '대기업' }, { label: '중견기업', value: '중견기업' },
      { label: '중소기업', value: '중소기업' }, { label: '스타트업', value: '스타트업' },
    ],
    render: (c) => c.CUSTOMER_TYPE || <span className={styles.cellEmpty}>-</span> },
  { key: 'INDUSTRY', label: '업종', width: '120px', sortable: true, filterType: 'text',
    render: (c) => c.INDUSTRY || <span className={styles.cellEmpty}>-</span> },
  { key: 'CUSTOMER_ST', label: '상태', width: '80px', sortable: true,
    filterType: 'select', filterOptions: [{ label: '활성', value: '00' }, { label: '비활성', value: '01' }],
    render: (c) => (
      <span className={c.CUSTOMER_ST === '00' ? styles.stActive : styles.stInactive}>
        {c.CUSTOMER_ST === '00' ? '활성' : '비활성'}
      </span>
    )},
  { key: 'CUSTOMER_GRADE', label: '등급', width: '70px', sortable: true,
    filterType: 'select', filterOptions: [
      { label: 'A', value: 'A' }, { label: 'B', value: 'B' },
      { label: 'C', value: 'C' }, { label: 'D', value: 'D' },
    ],
    render: (c) => c.CUSTOMER_GRADE
      ? <span className={styles[`grade${c.CUSTOMER_GRADE}` as keyof typeof styles]}>{c.CUSTOMER_GRADE}</span>
      : <span className={styles.cellEmpty}>-</span> },
  { key: 'EMPLOYEE_CNT', label: '직원 수', width: '100px', sortable: true, filterType: 'text',
    render: (c) => <span className={styles.cellMono}>{formatNumber(c.EMPLOYEE_CNT)}</span> },
  { key: 'ANNUAL_REVENUE', label: '연매출(억)', width: '110px', sortable: true, filterType: 'text',
    render: (c) => <span className={styles.cellMono}>{formatNumber(c.ANNUAL_REVENUE)}</span> },
  { key: 'PHONE_NO', label: '전화번호', width: '130px', filterType: 'text',
    render: (c) => <span className={styles.cellMono}>{c.PHONE_NO || '-'}</span> },
  { key: 'EMAIL', label: '이메일', width: '180px', filterType: 'text',
    render: (c) => c.EMAIL
      ? <span className={styles.cellEmail}>{c.EMAIL}</span>
      : <span className={styles.cellEmpty}>-</span> },
  { key: 'CITY', label: '도시', width: '80px', filterType: 'text',
    render: (c) => c.CITY || '-' },
  { key: 'CONTRACT_ST', label: '계약상태', width: '100px', sortable: true,
    filterType: 'select', filterOptions: [
      { label: '계약중', value: '계약중' }, { label: '계약만료', value: '계약만료' },
      { label: '협의중', value: '협의중' }, { label: '없음', value: '없음' },
    ],
    render: (c) => c.CONTRACT_ST
      ? <span className={styles[`contract${c.CONTRACT_ST}` as keyof typeof styles] || ''}>{c.CONTRACT_ST}</span>
      : <span className={styles.cellEmpty}>-</span> },
  { key: 'ADMIN_ID', label: '담당자', width: '90px', sortable: true,
    filterType: 'select', filterOptions: [{ label: '김철수', value: '김철수' }, { label: '박영희', value: '박영희' }, { label: '이민호', value: '이민호' }],
    render: (c) => c.ADMIN_ID || <span className={styles.cellEmpty}>-</span> },
  { key: 'MEMO', label: '메모', width: '200px',
    render: (c) => c.MEMO || <span className={styles.cellEmpty}>-</span> },
]

const TYPE_EXPAND_DEF: ExpandDef<CustomerTypeGroup, Customer> = {
  children: (g) => g.customers,
  childRowKey: (c) => c.CUSTOMER_ID,
  childColumns: CHILD_COLUMNS,
  renderGroupLabel: (g) => <><strong>{g.type}</strong> <span style={{ opacity: 0.5, fontSize: 12 }}>({g.customers.length}건)</span></>,
}

const AREA_EXPAND_DEF: ExpandDef<CustomerAreaGroup, CustomerTypeGroup> = {
  children: (g) => g.typeGroups,
  childRowKey: (g) => g.type,
  childColumns: [] as ColumnDef<CustomerTypeGroup>[],
  renderGroupLabel: (g) => {
    const total = g.typeGroups.reduce((sum, tg) => sum + tg.customers.length, 0)
    return <><strong>{g.area}</strong> <span style={{ opacity: 0.5, fontSize: 12 }}>({total}건)</span></>
  },
  childExpandDef: TYPE_EXPAND_DEF,
}


function GroupedTable() {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  const [childSelectedKeys, setChildSelectedKeys] = useState<string[]>([])
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [showFilter, setShowFilter] = useState(false)
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([])
  const [columnOrder, setColumnOrder] = useState(() => CHILD_COLUMNS.map((c) => c.key))

  const totalCustomers = GROUPED_DUMMY_DATA.reduce((sum, g) => g.typeGroups.reduce((s, tg) => s + tg.customers.length, sum), 0)

  const expandAll = () => {
    const keys: string[] = []
    GROUPED_DUMMY_DATA.forEach((g) => {
      keys.push(g.area)
      g.typeGroups.forEach((tg) => {
        keys.push(`${g.area}::${tg.type}`)
      })
    })
    setExpandedKeys(keys)
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>지역별 그룹</h2>
        <span className={styles.pageCount}>{GROUPED_DUMMY_DATA.length}개 지역 · 총 {totalCustomers}건</span>
      </div>
      <Table<CustomerAreaGroup>
        columns={[] as ColumnDef<CustomerAreaGroup>[]}
        data={GROUPED_DUMMY_DATA}
        rowKey={(g) => g.area}
        classNames={TABLE_CLASS_NAMES}
        expand={{
          def: AREA_EXPAND_DEF,
          keys: expandedKeys,
          onKeysChange: setExpandedKeys,
          childSelection: {
            enabled: true,
            keys: childSelectedKeys,
            onChange: setChildSelectedKeys,
          },
          childDeletable: true,
          onChildDelete: (gk, ck) => console.log('그룹 삭제:', gk, ck),
        }}
        editing={{
          onCellChange: (rowKey, colKey, value) => console.log('수정:', { rowKey, colKey, value }),
          renderCell: renderEditCellUI,
        }}
        filter={{
          enabled: showFilter,
          values: filters,
          onChange: (key, val) => setFilters((prev) => ({ ...prev, [key]: val })),
          debounce: 300,
        }}
        columnManager={{
          hiddenKeys,
          onHiddenKeysChange: setHiddenKeys,
          order: columnOrder,
          onOrderChange: setColumnOrder,
        }}
        headerMenuItems={[
          { label: '전체 펼치기', onClick: expandAll },
          { label: '전체 접기', onClick: () => setExpandedKeys([]) },
          { label: showFilter ? '필터 숨기기' : '필터', onClick: () => setShowFilter((v) => !v) },
          { label: '필터 초기화', onClick: () => setFilters({}) },
        ]}
        onRowClick={(_row, _rk, _e) => console.log('[Click]', JSON.stringify(_row, null, 2))}
        onRowDoubleClick={(_row, _rk, _e) => console.log('[DblClick]', JSON.stringify(_row, null, 2))}
        rowClassName={(row) => (row as any).EMPLOYEE_CNT <= 10000 ? styles.smallCompanyRow : undefined}
        tooltip
        onCellCopy={() => alert('복사되었습니다.')}
      />
    </section>
  )
}

/* ── 메인 페이지 ── */
export default function TablePage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle} style={{ marginBottom: 20 }}>테이블</h1>
      <GroupedTable />
      <InfiniteScrollTable />
      <PaginationTable />
    </div>
  )
}
