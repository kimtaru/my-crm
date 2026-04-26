import { useState } from 'react'
import { Calendar, type CalendarClassNames } from '@mycrm-ui/components'
import styles from './CalendarPage.module.css'

const YEAR_OPTIONS = Array.from({ length: 11 }, (_, index) => 2021 + index)
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1)
const SELECTABLE_START_DATE = '2026-01-01'
const SELECTABLE_END_DATE = '2026-05-01'
const SELECTABLE_PERIOD_LABEL = '2026년 1월 1일 ~ 2026년 5월 1일'

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
              <span className={styles.selectedDateLabel}>선택 가능 기간</span>
              <strong className={styles.selectedDateValue}>{SELECTABLE_PERIOD_LABEL}</strong>
              <p className={styles.helperText}>
                기간 안의 날짜만 선택할 수 있고, 그 이전/이후 날짜는 선택할 수 없습니다.
              </p>
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
              selectableStartDate={SELECTABLE_START_DATE}
              selectableEndDate={SELECTABLE_END_DATE}
              dateSelectValueType="yyyy-MM-dd"
              onDateSelect={setSelectedDate}
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
                현재 데모는 `rangeStartDay`, `rangeEndDay`, `rangeInsideDay`, `rangePreviewDay`,
                `rangeSingleDay` className을 사용해 범위 스타일을 커스텀하고 있습니다.
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
              selectableStartDate={SELECTABLE_START_DATE}
              selectableEndDate={SELECTABLE_END_DATE}
              dateSelectValueType="yyyy-MM-dd"
              onDateSelect={handleRangeDateSelect}
              onHoverDateChange={setHoveredDate}
            />
          </section>
        </div>
      </div>
    </section>
  )
}
