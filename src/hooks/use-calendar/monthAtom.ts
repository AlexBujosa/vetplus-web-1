import { currentMonthIndex, getMonth } from '@/utils'
import { atomWithStorage } from 'jotai/utils'
import dayjs, { type Dayjs } from 'dayjs'

export const monthAtom = atomWithStorage<number>(
  'monthIndex',
  currentMonthIndex()
)

export const weekAtom = atomWithStorage<Dayjs>('week', dayjs())

export const currentMonthAtom = atomWithStorage<Dayjs[][]>(
  'month',
  getMonth(currentMonthIndex())
)
