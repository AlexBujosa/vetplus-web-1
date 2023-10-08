import { Role } from '@/types/role'
import { atomWithStorage } from 'jotai/utils'

export const roleAtom = atomWithStorage<Role | undefined>('role', undefined)
