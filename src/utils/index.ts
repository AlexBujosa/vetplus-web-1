import dayjs, { type Dayjs } from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { useTranslation } from 'react-i18next'

dayjs.extend(localizedFormat)

export function currentMonthIndex(): number {
  const monthIndex = dayjs().month()
  return monthIndex
}

export function getWeekdayInLocale(date: Dayjs) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language

  dayjs.locale(currentLanguage)
  const weekday = dayjs(date).format('dddd')

  return weekday
}
