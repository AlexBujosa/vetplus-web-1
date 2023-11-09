import { Score } from '@/types/clinic'
import { atomWithStorage } from 'jotai/utils'

export type Employee = {
  fullName: string
  names: string
  surnames: string
  email: string
  specialty: string
  address: string
  telephone_number: string
  status: boolean
  score: number
  image: string
  VeterinarianSummaryScore: Score
  VeterinariaSpecialties: {
    specialties: string
  }
}

export const employeesAtom = atomWithStorage<Employee[] | undefined>(
  'employees',
  undefined
)
