import { useAtom, useSetAtom } from 'jotai'
import { currentMonthAtom, monthAtom, weekAtom } from './monthAtom'
import { currentMonthIndex, getMonth } from '@/utils'
import dayjs, { Dayjs } from 'dayjs'

function useCalendar() {
  const [monthIndex, setMonthIndex] = useAtom(monthAtom)
  const setCurrentMonth = useSetAtom(currentMonthAtom)
  const [week, setWeek] = useAtom(weekAtom)

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1)
    setCurrentMonth(getMonth(monthIndex - 1))

    const previousMonthWeek = dayjs(week).subtract(1, 'month')

    setWeek(previousMonthWeek)
  }

  function handleNextMonth() {
    setMonthIndex(monthIndex + 1)
    setCurrentMonth(getMonth(monthIndex + 1))

    const nextMonthWeek = dayjs(week).add(1, 'month')

    setWeek(nextMonthWeek)
  }

  function handlePrevWeek() {
    const previousWeek = dayjs(week).subtract(7, 'days')
    setWeek(previousWeek)

    // Check if the previous week is in a different month
    if (previousWeek.month() !== dayjs(week).month()) {
      handlePrevMonth()
    }
  }

  function handleNextWeek() {
    const nextWeek = dayjs(week).add(7, 'days')
    setWeek(nextWeek)

    if (nextWeek.month() !== dayjs(week).month()) {
      handleNextMonth()
    }
  }

  function handleReset() {
    const currentMonth = currentMonthIndex()
    setMonthIndex(currentMonth)
    setCurrentMonth(getMonth(currentMonth))
    setWeek(dayjs())
  }

  function getDateString(): string {
    const dateFormat = 'MMMM YYYY'
    const currentMonth = new Date(dayjs().year(), monthIndex)
    const dateString = dayjs(currentMonth).format(dateFormat)

    return dateString
  }

  function handleDateClick(selectedDate: Dayjs) {
    const clickedWeek = dayjs(selectedDate).startOf('week')
    setWeek(clickedWeek)

    if (clickedWeek.month() !== dayjs(clickedWeek).month()) {
      setMonthIndex(clickedWeek.month)
    }
  }

  return {
    handleDateClick,
    handlePrevMonth,
    handleNextMonth,
    handlePrevWeek,
    handleNextWeek,
    handleReset,
    getDateString,
  }
}

export default useCalendar
