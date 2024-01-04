import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

export const queueAtom = atomFamily((param: string) => atom<string>(param))
