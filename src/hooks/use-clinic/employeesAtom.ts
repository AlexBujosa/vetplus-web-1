import { atomWithStorage } from 'jotai/utils'

export type Employee = {
  fullName: string
  email: string
  specialty: string
  address: string
  telephoneNumber: string
  status: boolean
  score: number
}

export const employeesAtom = atomWithStorage<Employee[] | undefined>(
  'employees',
  undefined
)
