import { useCallback, useMemo, useState } from 'react'

export type SortDirection = 'asc' | 'desc'

export interface SortState {
  key: string
  direction: SortDirection
}

export interface ColumnDef<T> {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
  editable?: boolean
  sortable?: boolean
  insertable?: boolean
  width?: string
}

export interface TableClassNames {
  wrap?: string
  table?: string
  thead?: string
  th?: string
  tbody?: string
  tr?: string
  td?: string
  checkbox?: string
  checkboxChecked?: string
}

interface TableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  rowKey: (row: T) => string
  classNames?: TableClassNames
  onCellChange?: (rowKey: string, columnKey: string, value: string) => void
  editIcon?: React.ReactNode
  renderEditCell?: (props: EditCellProps) => React.ReactNode
  sort?: SortState | null
  onSortChange?: (sort: SortState | null) => void
  sortIcons?: SortIcons
  selectable?: boolean
  selectedKeys?: string[]
  onSelectedKeysChange?: (keys: string[]) => void
  deletable?: boolean
  onRowDelete?: (rowKey: string) => void
  deleteIcon?: React.ReactNode
  addingRow?: boolean
  onRowAdd?: (values: Record<string, string>) => void
  onAddingRowCancel?: () => void
  addIcon?: React.ReactNode
}

export interface SortIcons {
  none?: React.ReactNode
  asc?: React.ReactNode
  desc?: React.ReactNode
}

export interface EditCellProps {
  value: string
  onChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
}

/**
 * 제네릭 데이터 테이블 컴포넌트
 *
 * @example
 * ```tsx
 * import Table, { type ColumnDef } from '@/components/Table'
 *
 * interface User { id: number; name: string; email: string }
 *
 * const COLUMNS: ColumnDef<User>[] = [
 *   { key: 'id',    label: 'ID' },
 *   { key: 'name',  label: '이름' },
 *   { key: 'email', label: '이메일', render: (row) => <a href={`mailto:${row.email}`}>{row.email}</a> },
 * ]
 *
 * <Table
 *   columns={COLUMNS}
 *   data={users}
 *   rowKey={(row) => String(row.id)}
 *   classNames={{ wrap: styles.wrap, table: styles.table, th: styles.th }}
 * />
 * ```
 *
 * @param columns    컬럼 정의 배열. render 미지정 시 key에 해당하는 값을 문자열로 출력
 * @param data       렌더링할 데이터 배열
 * @param rowKey     각 행의 고유 key를 반환하는 함수 (React key로 사용)
 * @param classNames 각 요소에 적용할 className 객체
 */
const DEFAULT_SORT_ICONS: Required<SortIcons> = {
  none: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
      <path d="M7 15l5 5 5-5" /><path d="M7 9l5-5 5 5" />
    </svg>
  ),
  asc: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5" /><path d="M5 12l7-7 7 7" />
    </svg>
  ),
  desc: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" /><path d="M19 12l-7 7-7-7" />
    </svg>
  ),
}

export default function Table<T>({ columns, data, rowKey, classNames, onCellChange, editIcon, renderEditCell, sort, onSortChange, sortIcons, selectable, selectedKeys, onSelectedKeysChange, deletable, onRowDelete, deleteIcon, addingRow, onRowAdd, onAddingRowCancel, addIcon }: TableProps<T>) {
  const icons = { ...DEFAULT_SORT_ICONS, ...sortIcons }
  const [editingCell, setEditingCell] = useState<{ rowKey: string; colKey: string } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [addValues, setAddValues] = useState<Record<string, string>>({})

  const selected = selectedKeys ?? []
  const allKeys = useMemo(() => data.map((row) => rowKey(row)), [data, rowKey])
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selected.includes(k))

  const toggleOne = useCallback((key: string) => {
    const next = selected.includes(key)
      ? selected.filter((k) => k !== key)
      : [...selected, key]
    onSelectedKeysChange?.(next)
  }, [selected, onSelectedKeysChange])

  const toggleAll = useCallback(() => {
    onSelectedKeysChange?.(allSelected ? [] : allKeys)
  }, [allSelected, allKeys, onSelectedKeysChange])

  const startEdit = (rk: string, colKey: string, currentValue: string) => {
    setEditingCell({ rowKey: rk, colKey })
    setEditValue(currentValue)
  }

  const commitEdit = () => {
    if (editingCell && onCellChange) {
      onCellChange(editingCell.rowKey, editingCell.colKey, editValue)
    }
    setEditingCell(null)
  }

  const cancelEdit = () => {
    setEditingCell(null)
  }

  const renderCell = (row: T, col: ColumnDef<T>, rk: string) => {
    const isEditing = editingCell?.rowKey === rk && editingCell?.colKey === col.key

    if (col.editable && isEditing) {
      const editCellProps: EditCellProps = {
        value: editValue,
        onChange: setEditValue,
        onSave: commitEdit,
        onCancel: cancelEdit,
      }

      if (renderEditCell) {
        return renderEditCell(editCellProps)
      }

      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitEdit()
              if (e.key === 'Escape') cancelEdit()
            }}
            autoFocus
            style={{ padding: '4px 8px' }}
          />
          <button type="button" onClick={commitEdit} style={{ padding: '4px 8px', cursor: 'pointer' }}>
            저장
          </button>
          <button type="button" onClick={cancelEdit} style={{ padding: '4px 8px', cursor: 'pointer' }}>
            취소
          </button>
        </span>
      )
    }

    const display = col.render
      ? col.render(row)
      : String((row as Record<string, unknown>)[col.key] ?? '-')

    if (col.editable) {
      const rawValue = String((row as Record<string, unknown>)[col.key] ?? '')
      return (
        <span
          onDoubleClick={() => startEdit(rk, col.key, rawValue)}
          style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          {display}
          {editIcon ?? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4, flexShrink: 0 }}>
              <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          )}
        </span>
      )
    }

    return display
  }

  const sortedData = useMemo(() => {
    if (!sort) return data
    return [...data].sort((a, b) => {
      const aVal = String((a as Record<string, unknown>)[sort.key] ?? '')
      const bVal = String((b as Record<string, unknown>)[sort.key] ?? '')
      const cmp = aVal.localeCompare(bVal, 'ko')
      return sort.direction === 'asc' ? cmp : -cmp
    })
  }, [data, sort])

  const confirmAdd = () => {
    onRowAdd?.(addValues)
    setAddValues({})
  }

  const cancelAdd = () => {
    onAddingRowCancel?.()
    setAddValues({})
  }

  const hasActionColumn = deletable || addingRow

  const checkboxStyle: React.CSSProperties = { width: 16, height: 16, cursor: 'pointer', accentColor: '#4f46e5' }

  return (
    <div className={classNames?.wrap}>
      <table className={classNames?.table} style={{ tableLayout: 'fixed' }}>
        <colgroup>
          {selectable && <col style={{ width: '40px' }} />}
          {columns.map((col) => (
            <col key={col.key} style={col.width ? { width: col.width } : undefined} />
          ))}
          {hasActionColumn && <col style={{ width: '48px' }} />}
        </colgroup>
        <thead className={classNames?.thead}>
          <tr>
            {selectable && (
              <th className={classNames?.th} style={{ textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className={`${classNames?.checkbox ?? ''} ${allSelected ? classNames?.checkboxChecked ?? '' : ''}`.trim() || undefined}
                  style={checkboxStyle}
                  aria-label="전체 선택"
                />
              </th>
            )}
            {columns.map((col) => {
              const isSorted = sort?.key === col.key
              const direction = isSorted ? sort.direction : null

              const handleSort = () => {
                if (!col.sortable || !onSortChange) return
                if (!direction) {
                  onSortChange({ key: col.key, direction: 'asc' })
                } else if (direction === 'asc') {
                  onSortChange({ key: col.key, direction: 'desc' })
                } else {
                  onSortChange(null)
                }
              }

              return (
                <th
                  key={col.key}
                  className={classNames?.th}
                  onClick={col.sortable ? handleSort : undefined}
                  style={col.sortable ? { cursor: 'pointer', userSelect: 'none' } : undefined}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    {col.sortable && (
                      direction === 'asc' ? icons.asc
                        : direction === 'desc' ? icons.desc
                        : icons.none
                    )}
                  </span>
                </th>
              )
            })}
            {hasActionColumn && <th className={classNames?.th} />}
          </tr>
        </thead>
        <tbody className={classNames?.tbody}>
          {addingRow && (
            <tr className={classNames?.tr}>
              {selectable && <td className={classNames?.td} />}
              {columns.map((col) => (
                <td key={col.key} className={classNames?.td}>
                  {col.insertable ? (
                    <input
                      placeholder={col.label}
                      value={addValues[col.key] ?? ''}
                      onChange={(e) => setAddValues((prev) => ({ ...prev, [col.key]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') confirmAdd()
                        if (e.key === 'Escape') cancelAdd()
                      }}
                      style={{ padding: '4px 8px', width: '100%', boxSizing: 'border-box' }}
                    />
                  ) : null}
                </td>
              ))}
              <td className={classNames?.td} style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={confirmAdd}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'inherit' }}
                  aria-label="추가"
                >
                  {addIcon ?? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  )}
                </button>
              </td>
            </tr>
          )}
          {sortedData.map((row) => {
            const rk = rowKey(row)
            const isChecked = selected.includes(rk)
            return (
              <tr key={rk} className={classNames?.tr}>
                {selectable && (
                  <td className={classNames?.td} style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleOne(rk)}
                      className={`${classNames?.checkbox ?? ''} ${isChecked ? classNames?.checkboxChecked ?? '' : ''}`.trim() || undefined}
                      style={checkboxStyle}
                      aria-label="행 선택"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className={classNames?.td}>
                    {renderCell(row, col, rk)}
                  </td>
                ))}
                {hasActionColumn && (
                  <td className={classNames?.td} style={{ textAlign: 'center' }}>
                    {deletable && (
                      <button
                        type="button"
                        onClick={() => onRowDelete?.(rk)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'inherit', opacity: 0.4 }}
                        aria-label="삭제"
                      >
                        {deleteIcon ?? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          </svg>
                        )}
                      </button>
                    )}
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
