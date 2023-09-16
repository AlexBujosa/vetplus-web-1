import { atomWithStorage } from "jotai/utils";

export const employeesAtom = atomWithStorage<any[] | undefined>(
  "employees",
  undefined
);
