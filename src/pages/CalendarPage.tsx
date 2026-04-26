import { useState } from 'react'
import { Calendar, type CalendarClassNames } from '@mycrm-ui/components'
import styles from './CalendarPage.module.css'

const YEAR_OPTIONS = Array.from({ length: 11 }, (_, index) => 2021 + index)
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1)
const DISABLED_DATE_KEYS = new Set(['2026-04-08', '2026-04-14', '2026-04-23', '2026-05-01'])

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
  todayDay: styles.calendarTodayDay,
  currentMonthDay: styles.calendarCurrentMonthDay,
  adjacentMonthDay: styles.calendarAdjacentMonthDay,
}

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function CalendarPage() {
  const [selectedYear, setSelectedYear] = useState(2026)
  const [selectedMonth, setSelectedMonth] = useState(4)
  const [selectedDate, setSelectedDate] = useState<Date | string | null>('2026-04-22')
  const [rangeStart, setRangeStart] = useState<Date | string | null>(null)
  const [rangeEnd, setRangeEnd] = useState<Date | string | null>(null)
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)

  const selectedDateLabel = selectedDate
    ? selectedDate instanceof Date
      ? `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`
      : selectedDate
    : '선택된 날짜가 없습니다.'
  const rangeStartLabel = rangeStart instanceof Date
    ? `${rangeStart.getFullYear()}년 ${rangeStart.getMonth() + 1}월 ${rangeStart.getDate()}일`
    : rangeStart ?? '시작일이 없습니다.'
  const rangeEndLabel = rangeEnd instanceof Date
    ? `${rangeEnd.getFullYear()}년 ${rangeEnd.getMonth() + 1}월 ${rangeEnd.getDate()}일`
    : rangeEnd ?? '종료일이 없습니다.'
  const hoveredDateLabel = hoveredDate
    ? `${hoveredDate.getFullYear()}년 ${hoveredDate.getMonth() + 1}월 ${hoveredDate.getDate()}일`
    : 'hover 중인 날짜가 없습니다.'

  const handleRangeDateSelect = (date: Date | string) => {
    if (!rangeStart || rangeEnd) {
      setRangeStart(date)
      setRangeEnd(null)
      return
    }

    setRangeEnd(date)
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
              <span className={styles.selectedDateLabel}>선택한 날짜</span>
              <strong className={styles.selectedDateValue}>{selectedDateLabel}</strong>
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
              dateSelectValueType="yyyy-MM-dd"
              isDateDisabled={(date) => DISABLED_DATE_KEYS.has(formatDateKey(date))}
              onDateSelect={setSelectedDate}
            />
          </section>

          <section className={styles.demoSection}>
            <h2 className={styles.demoTitle}>Range Select</h2>
            <div className={styles.selectedDatePanel}>
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
              dateSelectValueType="yyyy-MM-dd"
              isDateDisabled={(date) => DISABLED_DATE_KEYS.has(formatDateKey(date))}
              onDateSelect={handleRangeDateSelect}
              onHoverDateChange={setHoveredDate}
            />
          </section>
        </div>
      </div>
    </section>
  )
}
