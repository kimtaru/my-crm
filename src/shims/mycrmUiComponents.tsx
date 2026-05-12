import type { ReactNode } from 'react'

export interface CalendarMarker {
  date: string
  color: string
  meta?: string
}

export interface CalendarMonthChangeValue {
  year: number
  month: number
}

export interface CalendarRangeDraftValue {
  startDate: Date | string | null
  endDate: Date | string | null
}

export interface CalendarRangeSelectValue {
  startDate: Date | string | null
  endDate: Date | string | null
}

export type CalendarClassNames = Partial<Record<
  | 'weekday'
  | 'weekdaySun'
  | 'weekdaySat'
  | 'day'
  | 'dayHover'
  | 'daySun'
  | 'daySat'
  | 'disabledDay'
  | 'selectedDay'
  | 'rangeStartDay'
  | 'rangeEndDay'
  | 'rangeInsideDay'
  | 'rangePreviewDay'
  | 'rangeSingleDay'
  | 'todayDay'
  | 'currentMonthDay'
  | 'adjacentMonthDay'
  | 'dayMarker',
  string
>>

interface CalendarProps {
  year: number
  month: number
  selectionMode?: 'single' | 'range' | 'multiple'
  classNames?: CalendarClassNames
  weekdayLabelType?: string
  weekStartsOn?: number
  showAdjacentMonthDays?: boolean
  showToday?: boolean
  showHover?: boolean
  selectedDate?: Date | string | null
  selectedDates?: Array<Date | string>
  rangeStart?: Date | string | null
  rangeEnd?: Date | string | null
  hoveredDate?: Date | null
  markedDates?: CalendarMarker[]
  pending?: boolean
  selectableStartDate?: string
  selectableEndDate?: string
  maxSelectedDates?: number
  dateSelectValueType?: string
  isDateDisabled?: (date: Date) => boolean
  getDayClassName?: (date: Date) => string | undefined
  onMonthChange?: (value: CalendarMonthChangeValue) => void
  onDateSelect?: ((date: Date | string, markers: CalendarMarker[]) => void) | ((date: Date | string) => void)
  onRangeDraftChange?: (value: CalendarRangeDraftValue) => void
  onRangeSelect?: (value: CalendarRangeSelectValue) => void
  onHoverDateChange?: (date: Date | null) => void
}

export function Calendar({
  year,
  month,
  selectionMode = 'single',
  pending = false,
}: CalendarProps) {
  return (
    <div
      style={{
        minHeight: 280,
        border: '1px dashed #475569',
        borderRadius: 12,
        background: 'rgba(15, 23, 42, 0.35)',
        color: '#cbd5e1',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      <strong style={{ fontSize: 16 }}>Calendar 미리보기 대체 컴포넌트</strong>
      <span style={{ color: '#94a3b8', fontSize: 13 }}>
        현재 워크스페이스에는 `@mycrm-ui/components` 패키지가 없어 `my-crm` 빌드를 위해 임시 shim을 사용 중입니다.
      </span>
      <span style={{ color: '#94a3b8', fontSize: 13 }}>
        표시 월: {year}.{String(month).padStart(2, '0')} / 모드: {selectionMode} / 상태: {pending ? 'loading' : 'ready'}
      </span>
    </div>
  )
}

export type { ReactNode }
