import dayjs, { type Dayjs } from 'dayjs'

export function currentMonthIndex(): number {
  const monthIndex = dayjs().month()
  return monthIndex
}

export function getWeekdayInLocale(date: Dayjs) {
  const weekday = dayjs(date).format('dddd')

  return weekday
}

export function getMonth(month: number = dayjs().month()) {
  month = Math.floor(month)
  const year = dayjs().year()
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day()
  let currentMonthCount = 0 - firstDayOfTheMonth
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++
      return dayjs(new Date(year, month, currentMonthCount))
    })
  })
  return daysMatrix
}
