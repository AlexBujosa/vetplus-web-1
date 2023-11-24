import { Appointment } from '@/types/clinic'
import { atomWithStorage } from 'jotai/utils'

export const appointmentsAtom = atomWithStorage<Appointment[] | undefined>(
  'appointments',
  undefined
)
