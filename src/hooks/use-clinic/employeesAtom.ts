import { Score } from '@/types/clinic'
import { Role } from '@/types/role'
import { atomWithStorage } from 'jotai/utils'

export type Employee = {
  id: string
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
  role: Role
  VeterinarianSummaryScore: Score
  VeterinariaSpecialties: {
    specialties: string
  }
}

export const employeesAtom = atomWithStorage<Employee[] | undefined>(
  'employees',
  undefined
)
