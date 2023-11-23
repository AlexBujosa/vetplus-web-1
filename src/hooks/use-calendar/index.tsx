import { useAtom } from 'jotai'
import { currentMonthAtom, monthAtom, weekAtom } from './monthAtom'
import { currentMonthIndex, getMonth } from '@/utils'
import dayjs from 'dayjs'

function useCalendar() {
  const [monthIndex, setMonthIndex] = useAtom(monthAtom)
  const [currentMonth, setCurrentMonth] = useAtom(currentMonthAtom)
  const [week, setWeek] = useAtom(weekAtom)

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1)
    setCurrentMonth(getMonth(monthIndex - 1))
  }

  function handleNextMonth() {
    setMonthIndex(monthIndex + 1)
    setCurrentMonth(getMonth(monthIndex + 1))
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
      handlePrevMonth()
    }
  }

  function handleReset() {
    const currentMonth = currentMonthIndex()
    setMonthIndex(currentMonth)
    setWeek(dayjs())
  }

  function getDateString(): string {
    const dateFormat = 'MMMM YYYY'
    const currentMonth = new Date(dayjs().year(), monthIndex)
    const dateString = dayjs(currentMonth).format(dateFormat)

    return dateString
  }

  return {
    handlePrevMonth,
    handleNextMonth,
    handlePrevWeek,
    handleNextWeek,
    handleReset,
    getDateString,
  }
}

export default useCalendar
