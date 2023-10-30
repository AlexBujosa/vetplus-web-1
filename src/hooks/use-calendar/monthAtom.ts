import { currentMonthIndex, getMonth } from '@/utils'
import { atomWithStorage } from 'jotai/utils'
import { type Dayjs } from 'dayjs'

export const monthAtom = atomWithStorage<number>(
  'monthIndex',
  currentMonthIndex()
)

export const currentMonthAtom = atomWithStorage<Dayjs[][]>(
  'month',
  getMonth(currentMonthIndex())
)
