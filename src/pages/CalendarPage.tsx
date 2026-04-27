import { useState } from 'react'
import {
  Calendar,
  type CalendarClassNames,
  type CalendarMarker,
  type CalendarRangeDraftValue,
  type CalendarRangeSelectValue,
} from '@mycrm-ui/components'
import styles from './CalendarPage.module.css'

const YEAR_OPTIONS = Array.from({ length: 11 }, (_, index) => 2021 + index)
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1)
const SELECTABLE_START_DATE = '2026-01-01'
const SELECTABLE_END_DATE = '2026-05-01'
const SELECTABLE_PERIOD_LABEL = '2026년 1월 1일 ~ 2026년 5월 1일'
const MULTIPLE_MAX_SELECTION = 3
const MARKED_DATES: CalendarMarker[] = [
  { date: '2026-04-03', color: '#facc15', meta: '창립기념일' },
  { date: '2026-04-10', color: '#fb7185', meta: '정기 점검' },
  { date: '2026-04-10', color: '#38bdf8', meta: '출시일' },
  { date: '2026-04-10', color: '#facc15', meta: '고객 행사' },
  { date: '2026-04-10', color: '#22c55e', meta: '사내 교육' },
  { date: '2026-04-10', color: '#a78bfa', meta: '프로모션' },
  { date: '2026-04-10', color: '#f97316', meta: '캠페인 오픈' },
  { date: '2026-04-10', color: '#14b8a6', meta: '파트너 미팅' },
  { date: '2026-04-10', color: '#e879f9', meta: '채용 설명회' },
  { date: '2026-04-10', color: '#84cc16', meta: '성과 공유회' },
  { date: '2026-04-10', color: '#06b6d4', meta: 'QA 점검' },
  { date: '2026-04-10', color: '#ef4444', meta: '긴급 공지' },
  { date: '2026-04-10', color: '#8b5cf6', meta: '브랜드 리뷰' },
  { date: '2026-04-10', color: '#10b981', meta: '오프사이트' },
  { date: '2026-04-10', color: '#f59e0b', meta: '실적 마감' },
  { date: '2026-04-18', color: '#22c55e', meta: '복지데이' },
  { date: '2026-04-27', color: '#38bdf8', meta: '월말 마감' },
]

const formatDateLabel = (value: Date | string | null) => {
  if (!value) {
    return null
  }

  if (value instanceof Date) {
    return `${value.getFullYear()}년 ${value.getMonth() + 1}월 ${value.getDate()}일`
  }

  return value
}

const toDateKey = (value: Date | string) => {
  if (value instanceof Date) {
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  return value.replaceAll('.', '-')
}

const CALENDAR_CLASS_NAMES: CalendarClassNames = {
  weekday: styles.calendarWeekday,
  weekdaySun: styles.calendarWeekdaySun,
  weekdaySat: styles.calendarWeekdaySat,
  day: styles.calendarDay,
  dayHover: styles.calendarDayHover,
  daySun: styles.calendarDaySun,
  daySat: styles.calendarDaySat,
  disabledDay: styles.calendarDisabledDay,
  selectedDay: styles.calendarSelectedDay,
  rangeStartDay: styles.calendarRangeStartDay,
  rangeEndDay: styles.calendarRangeEndDay,
  rangeInsideDay: styles.calendarRangeInsideDay,
  rangePreviewDay: styles.calendarRangePreviewDay,
  rangeSingleDay: styles.calendarRangeSingleDay,
  todayDay: styles.calendarTodayDay,
  currentMonthDay: styles.calendarCurrentMonthDay,
  adjacentMonthDay: styles.calendarAdjacentMonthDay,
  dayMarker: styles.calendarDayMarker,
}

export default function CalendarPage() {
  const [selectedYear, setSelectedYear] = useState(2026)
  const [selectedMonth, setSelectedMonth] = useState(4)
  const [selectedDate, setSelectedDate] = useState<Date | string | null>('2026-04-22')
  const [selectedDateMarkers, setSelectedDateMarkers] = useState<CalendarMarker[]>([])
  const [rangeStart, setRangeStart] = useState<Date | string | null>(null)
  const [rangeEnd, setRangeEnd] = useState<Date | string | null>(null)
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  const [selectedDates, setSelectedDates] = useState<Array<Date | string>>([
    '2026-04-08',
    '2026-04-15',
    '2026-04-22',
  ])

  const selectedDateLabel = formatDateLabel(selectedDate) ?? '선택된 날짜가 없습니다.'
  const rangeStartLabel = formatDateLabel(rangeStart) ?? '시작일이 없습니다.'
  const rangeEndLabel = formatDateLabel(rangeEnd) ?? '종료일이 없습니다.'
  const hoveredDateLabel = hoveredDate
    ? `${hoveredDate.getFullYear()}년 ${hoveredDate.getMonth() + 1}월 ${hoveredDate.getDate()}일`
    : 'hover 중인 날짜가 없습니다.'
  const selectedDatesLabels = selectedDates.map((value) => formatDateLabel(value) ?? '')
  const selectedDateMarkersJson = JSON.stringify(selectedDateMarkers, null, 2)

  const handleRangeDraftChange = (range: CalendarRangeDraftValue) => {
    setRangeStart(range.startDate)
    setRangeEnd(range.endDate)
  }

  const handleRangeSelect = (range: CalendarRangeSelectValue) => {
    setRangeStart(range.startDate)
    setRangeEnd(range.endDate)
  }

  const handleMultipleDateSelect = (date: Date | string) => {
    const clickedDateKey = toDateKey(date)

    setSelectedDates((currentDates) => {
      const nextDates = currentDates.filter((currentDate) => toDateKey(currentDate) !== clickedDateKey)

      if (nextDates.length !== currentDates.length) {
        return nextDates
      }

      return [...currentDates, date]
    })
  }

  const handleSingleDateSelect = (date: Date | string, markers: CalendarMarker[]) => {
    setSelectedDate(date)
    setSelectedDateMarkers(markers)
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Calendar</h1>
        <p className={styles.description}>
          mycrm-ui Calendar 컴포넌트 테스트 화면입니다.
        </p>
      </div>

      <div className={styles.calendarWrap}>
        <div className={styles.controls}>
          <label className={styles.controlField}>
            <span className={styles.controlLabel}>연도</span>
            <select
              className={styles.controlSelect}
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
            >
              {YEAR_OPTIONS.map((year) => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </select>
          </label>

          <label className={styles.controlField}>
            <span className={styles.controlLabel}>월</span>
            <select
              className={styles.controlSelect}
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(Number(event.target.value))}
            >
              {MONTH_OPTIONS.map((month) => (
                <option key={month} value={month}>
                  {month}월
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.demoGrid}>
          <section className={styles.demoSection}>
            <h2 className={styles.demoTitle}>Single Select</h2>
            <div className={styles.selectedDatePanel}>
              <span className={styles.selectedDateLabel}>선택 가능 기간</span>
              <strong className={styles.selectedDateValue}>{SELECTABLE_PERIOD_LABEL}</strong>
              <p className={styles.helperText}>
                기간 안의 날짜만 선택할 수 있고, 그 이전/이후 날짜는 선택할 수 없습니다.
              </p>
              <p className={styles.helperText}>
                `markedDates` item은 `date`, `color`, `meta`를 가질 수 있고, 같은 날짜가 여러 번 들어오면 dot도 여러 개 노출됩니다.
              </p>
              <span className={styles.selectedDateLabel}>선택한 날짜</span>
              <strong className={styles.selectedDateValue}>{selectedDateLabel}</strong>
              {selectedDateMarkers.length > 0 ? (
                <>
                  <span className={styles.selectedDateLabel}>선택한 날짜 마커 데이터</span>
                  <pre className={styles.markerMetaJson}>{selectedDateMarkersJson}</pre>
                </>
              ) : null}
            </div>

            <Calendar
              year={selectedYear}
              month={selectedMonth}
              weekdayLabelType="ko"
              classNames={CALENDAR_CLASS_NAMES}
              showAdjacentMonthDays={true}
              showToday={true}
              showHover={true}
              selectionMode="single"
              selectedDate={selectedDate}
              markedDates={MARKED_DATES}
              selectableStartDate={SELECTABLE_START_DATE}
              selectableEndDate={SELECTABLE_END_DATE}
              dateSelectValueType="yyyy-MM-dd"
              onDateSelect={handleSingleDateSelect}
            />
          </section>

          <section className={styles.demoSection}>
            <h2 className={styles.demoTitle}>Range Select</h2>
            <div className={styles.selectedDatePanel}>
              <span className={styles.selectedDateLabel}>선택 가능 기간</span>
              <strong className={styles.selectedDateValue}>{SELECTABLE_PERIOD_LABEL}</strong>
              <p className={styles.helperText}>
                Range 선택도 동일하게 기간 안에서만 시작일과 종료일을 고를 수 있습니다.
              </p>
              <p className={styles.helperText}>
                두 번째 클릭으로 범위가 완성될 때 정규화된 시작일/종료일이 반환됩니다.
              </p>
              <p className={styles.helperText}>
                현재 데모는 `rangeStartDay`, `rangeEndDay`, `rangeInsideDay`, `rangePreviewDay`,
                `rangeSingleDay` className을 사용해 범위 스타일을 커스텀하고 있습니다.
              </p>
              <p className={styles.helperText}>
                마킹된 날짜는 range 상태와 함께 유지됩니다.
              </p>
              <span className={styles.selectedDateLabel}>Range 시작일</span>
              <strong className={styles.selectedDateValue}>{rangeStartLabel}</strong>
              <span className={styles.selectedDateLabel}>Range 종료일</span>
              <strong className={styles.selectedDateValue}>{rangeEndLabel}</strong>
              <span className={styles.selectedDateLabel}>Hover 날짜</span>
              <strong className={styles.selectedDateValue}>{hoveredDateLabel}</strong>
            </div>

            <Calendar
              year={selectedYear}
              month={selectedMonth}
              weekdayLabelType="ko"
              classNames={CALENDAR_CLASS_NAMES}
              showAdjacentMonthDays={true}
              showToday={true}
              showHover={true}
              selectionMode="range"
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              hoveredDate={hoveredDate}
              markedDates={MARKED_DATES}
              selectableStartDate={SELECTABLE_START_DATE}
              selectableEndDate={SELECTABLE_END_DATE}
              dateSelectValueType="yyyy-MM-dd"
              onRangeDraftChange={handleRangeDraftChange}
              onRangeSelect={handleRangeSelect}
              onHoverDateChange={setHoveredDate}
            />
          </section>

          <section className={styles.demoSection}>
            <h2 className={styles.demoTitle}>Multiple Select</h2>
            <div className={styles.selectedDatePanel}>
              <span className={styles.selectedDateLabel}>선택 가능 기간</span>
              <strong className={styles.selectedDateValue}>{SELECTABLE_PERIOD_LABEL}</strong>
              <p className={styles.helperText}>
                여러 날짜를 각각 토글 선택할 수 있고, 기간 밖 날짜는 기존 데모 정책처럼 선택할 수 없습니다.
              </p>
              <p className={styles.helperText}>
                최대 {MULTIPLE_MAX_SELECTION}개까지만 선택할 수 있고, 이미 선택된 날짜는 다시 눌러 해제할 수 있습니다.
              </p>
              <p className={styles.helperText}>
                아래 예제에서도 동일한 날짜 마커를 공유합니다.
              </p>
              <span className={styles.selectedDateLabel}>선택된 날짜 목록</span>
              <div className={styles.selectedDatesList}>
                {selectedDatesLabels.length > 0 ? (
                  selectedDatesLabels.map((label) => (
                    <span key={label} className={styles.selectedDateChip}>
                      {label}
                    </span>
                  ))
                ) : (
                  <strong className={styles.selectedDateValue}>선택된 날짜가 없습니다.</strong>
                )}
              </div>
            </div>

            <Calendar
              year={selectedYear}
              month={selectedMonth}
              weekdayLabelType="ko"
              classNames={CALENDAR_CLASS_NAMES}
              showAdjacentMonthDays={true}
              showToday={true}
              showHover={true}
              selectionMode="multiple"
              selectedDates={selectedDates}
              markedDates={MARKED_DATES}
              selectableStartDate={SELECTABLE_START_DATE}
              selectableEndDate={SELECTABLE_END_DATE}
              maxSelectedDates={MULTIPLE_MAX_SELECTION}
              dateSelectValueType="yyyy-MM-dd"
              onDateSelect={handleMultipleDateSelect}
            />
          </section>
        </div>
      </div>
    </section>
  )
}
