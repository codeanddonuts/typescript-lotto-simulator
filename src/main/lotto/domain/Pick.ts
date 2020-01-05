import { UserInputError } from "apollo-server-koa"

export const enum PICK_RANGE {
  MIN = 1,
  MAX = 45
}

export type PickedNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13
                          | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24
                          | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35
                          | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45

export const PickedNumber = (n: number): PickedNumber | never => {
  if (PICK_RANGE.MIN <= n && n <= PICK_RANGE.MAX) {
    return n as PickedNumber
  }
  throw new UserInputError("1에서 45 범위의 숫자를 입력해주시기 바랍니다.")
}
