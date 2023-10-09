import { currentMonthIndex } from '@/utils'
import { atomWithStorage } from 'jotai/utils'

export const monthAtom = atomWithStorage<number>(
  'monthIndex',
  currentMonthIndex()
)
