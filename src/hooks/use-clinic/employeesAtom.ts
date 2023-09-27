import { atomWithStorage } from 'jotai/utils'

export type Employee = {
  fullName: string
  names: string
  surnames: string
  email: string
  specialty: string
  address: string
  telephoneNumber: string
  status: boolean
  score: number
  image: string
}

export const employeesAtom = atomWithStorage<Employee[] | undefined>(
  'employees',
  undefined
)
