import { atomWithStorage } from 'jotai/utils';

type User = {
  names: string;
  surnames: string;
  email: string;
  image: string;
};

export const userAtom = atomWithStorage<User | undefined>('user', undefined);
