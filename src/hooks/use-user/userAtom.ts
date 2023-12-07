import { Role } from '@/types/role'
import { atomWithStorage } from 'jotai/utils'

type User = {
  names: string
  surnames: string
  fullName: string
  email: string
  image: string
  role: Role
}

export const userAtom = atomWithStorage<User | undefined>('user', undefined)
