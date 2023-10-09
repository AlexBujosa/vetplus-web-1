import { useAtom } from 'jotai'
import { monthAtom } from './monthAtom'
import { currentMonthIndex } from '@/utils'
import dayjs from 'dayjs'

function useCalendar() {
  const [monthIndex, setMonthIndex] = useAtom(monthAtom)

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1)
  }

  function handleNextMonth() {
    setMonthIndex(monthIndex + 1)
  }

  function handleReset() {
    const currentMonth = currentMonthIndex()
    setMonthIndex(currentMonth)
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
    handleReset,
    getDateString,
  }
}

export default useCalendar
