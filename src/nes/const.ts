export const NesConst = {
  WIDTH: 256,
  HEIGHT: 240,
} as const

export const CPU_HZ = 1789773

export const enum VBlank {
  START = 240,
  NMI = 241,
  END = 261,
  VRETURN = 262,
}
