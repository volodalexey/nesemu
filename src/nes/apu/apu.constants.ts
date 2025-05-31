export const enum Reg {
  STATUS = 0,
  SWEEP = 1,
  TIMER_L = 2,
  TIMER_H = 3,

  // DMC
  DIRECT_LOAD = 1, // eslint-disable-line @typescript-eslint/no-duplicate-enum-values
  SAMPLE_ADDRESS = 2, // eslint-disable-line @typescript-eslint/no-duplicate-enum-values
  SAMPLE_LENGTH = 3, // eslint-disable-line @typescript-eslint/no-duplicate-enum-values
}

export const enum PadBit {
  A = 0,
  B = 1,
  SELECT = 2,
  START = 3,
  U = 4,
  D = 5,
  L = 6,
  R = 7,

  REPEAT_A = 8,
  REPEAT_B = 9,
}

export const enum PadValue {
  A = 1 << PadBit.A,
  B = 1 << PadBit.B,
  SELECT = 1 << PadBit.SELECT,
  START = 1 << PadBit.START,
  U = 1 << PadBit.U,
  D = 1 << PadBit.D,
  L = 1 << PadBit.L,
  R = 1 << PadBit.R,

  REPEAT_A = 1 << PadBit.REPEAT_A,
  REPEAT_B = 1 << PadBit.REPEAT_B,
}

export const enum WaveType {
  PULSE,
  TRIANGLE,
  NOISE,
  DMC, // Delta Modulation Channel
  SAWTOOTH,
}

export const BASE = 0x4000
export const STATUS_REG = 0x15
export const PAD1_REG = 0x16
export const PAD2_REG = 0x17
export const FRAME_COUNTER = 0x17
export const IRQ_INHIBIT = 1 << 6
export const SEQUENCER_MODE = 1 << 7

export const LENGTH_COUNTER_HALT = 0x20
export const LENGTH_COUNTER_HALT_TRI = 0x80

export const DMC_LOOP_ENABLE = 0x40
export const DMC_IRQ_ENABLE = 0x80

export const kLengthTable = [
  0x0a, 0xfe, 0x14, 0x02, 0x28, 0x04, 0x50, 0x06, 0xa0, 0x08, 0x3c, 0x0a, 0x0e, 0x0c, 0x1a, 0x0e,
  0x0c, 0x10, 0x18, 0x12, 0x30, 0x14, 0x60, 0x16, 0xc0, 0x18, 0x48, 0x1a, 0x10, 0x1c, 0x20, 0x1e,
]

export const kPulseDutyRatio = [0.125, 0.25, 0.5, 0.75]

export const kNoiseFrequencies = [
  4, 8, 16, 32, 64, 96, 128, 160, 202, 254, 380, 508, 762, 1016, 2034, 4068,
]
