import { useState } from 'react'
import { Calendar, type CalendarClassNames } from '@mycrm-ui/components'
import styles from './CalendarPage.module.css'

const YEAR_OPTIONS = Array.from({ length: 11 }, (_, index) => 2021 + index)
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1)

const CALENDAR_CLASS_NAMES: CalendarClassNames = {
  weekday: styles.calendarWeekday,
  weekdaySun: styles.calendarWeekdaySun,
  weekdaySat: styles.calendarWeekdaySat,
  day: styles.calendarDay,
  dayHover: styles.calendarDayHover,
  daySun: styles.calendarDaySun,
  daySat: styles.calendarDaySat,
  selectedDay: styles.calendarSelectedDay,
  todayDay: styles.calendarTodayDay,
  currentMonthDay: styles.calendarCurrentMonthDay,
  adjacentMonthDay: styles.calendarAdjacentMonthDay,
}

export default function CalendarPage() {
  const [selectedYear, setSelectedYear] = useState(2026)
  const [selectedMonth, setSelectedMonth] = useState(4)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const selectedDateLabel = selectedDate
    ? `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`
    : '선택된 날짜가 없습니다.'

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Calendar</h1>
        <p className={styles.description}>
          mycrm-ui 캘린더 컴포넌트 신규 개발을 위한 테스트 화면입니다.
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
          onDateSelect={setSelectedDate}
        />
      </div>
    </section>
  )
}
