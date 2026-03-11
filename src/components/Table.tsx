import { useMemo, useState } from 'react'

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
}

export interface TableClassNames {
  wrap?: string
  table?: string
  thead?: string
  th?: string
  tbody?: string
  tr?: string
  td?: string
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
  deletable?: boolean
  onRowDelete?: (rowKey: string) => void
  deleteIcon?: React.ReactNode
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

export default function Table<T>({ columns, data, rowKey, classNames, onCellChange, editIcon, renderEditCell, sort, onSortChange, sortIcons, deletable, onRowDelete, deleteIcon }: TableProps<T>) {
  const icons = { ...DEFAULT_SORT_ICONS, ...sortIcons }
  const [editingCell, setEditingCell] = useState<{ rowKey: string; colKey: string } | null>(null)
  const [editValue, setEditValue] = useState('')

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

  return (
    <div className={classNames?.wrap}>
      <table className={classNames?.table}>
        <thead className={classNames?.thead}>
          <tr>
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
            {deletable && <th className={classNames?.th} />}
          </tr>
        </thead>
        <tbody className={classNames?.tbody}>
          {sortedData.map((row) => {
            const rk = rowKey(row)
            return (
              <tr key={rk} className={classNames?.tr}>
                {columns.map((col) => (
                  <td key={col.key} className={classNames?.td}>
                    {renderCell(row, col, rk)}
                  </td>
                ))}
                {deletable && (
                  <td className={classNames?.td} style={{ textAlign: 'center' }}>
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
