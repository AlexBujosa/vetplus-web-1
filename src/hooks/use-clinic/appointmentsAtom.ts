import { Appointment } from '@/types/clinic'
import { atom } from 'jotai'

export const appointmentsAtom = atom<Appointment[] | undefined>(undefined)
