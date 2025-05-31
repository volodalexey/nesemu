// Instruction definitions

export const enum Addressing {
  UNKNOWN,
  IMPLIED,
  ACCUMULATOR,
  IMMEDIATE,
  IMMEDIATE16,
  ZEROPAGE,
  ZEROPAGE_X,
  ZEROPAGE_Y,
  ABSOLUTE,
  ABSOLUTE_X,
  ABSOLUTE_Y,
  INDIRECT,
  INDIRECT_X,
  INDIRECT_Y,
  RELATIVE,
}

export const enum OpType {
  UNKNOWN,

  NOP,
  LDA,
  STA,
  LDX,
  STX,
  LDY,
  STY,
  TAX,
  TAY,
  TXA,
  TYA,
  TXS,
  TSX,

  ADC,
  SBC,
  INX,
  INY,
  INC,
  DEX,
  DEY,
  DEC,
  AND,
  ORA,
  EOR,
  ROL,
  ROR,
  ASL,
  LSR,
  BIT,
  CMP,
  CPX,
  CPY,

  JMP,
  JSR,
  RTS,
  RTI,
  BCC,
  BCS,
  BPL,
  BMI,
  BNE,
  BEQ,
  BVC,
  BVS,

  PHA,
  PHP,
  PLA,
  PLP,

  CLC,
  SEC,
  SEI,
  CLI,
  CLV,
  SED,
  CLD,
  BRK,

  // Unofficial
  LAX, // LDA-LDX
  SAX, // AND-STA
  ISB, // INC-SBC
  DCP, // DEC-CMP
  RLA, // ROL-AND
  RRA, // ROR-ADC
  SLO, // ASL-ORA
  SRE, // LSR-EOR
  IGN = NOP,
  SKB = NOP,
}

export interface Instruction {
  opType: OpType
  addressing: Addressing
  bytes: number
  cycle: number
  read: boolean
  write: boolean
}

const enum OpAccess {
  NO,
  RD,
  WT,
  RW,
}

const kTable = [
  [0xea, OpType.NOP, Addressing.IMPLIED, 1, 2, OpAccess.NO],
  // LDA
  [0xa9, OpType.LDA, Addressing.IMMEDIATE, 2, 2, OpAccess.RD],
  [0xa5, OpType.LDA, Addressing.ZEROPAGE, 2, 3, OpAccess.RD],
  [0xb5, OpType.LDA, Addressing.ZEROPAGE_X, 2, 4, OpAccess.RD],
  [0xad, OpType.LDA, Addressing.ABSOLUTE, 3, 4, OpAccess.RD],
  [0xbd, OpType.LDA, Addressing.ABSOLUTE_X, 3, 4, OpAccess.RD],
  [0xb9, OpType.LDA, Addressing.ABSOLUTE_Y, 3, 4, OpAccess.RD],
  [0xa1, OpType.LDA, Addressing.INDIRECT_X, 2, 6, OpAccess.RD],
  [0xb1, OpType.LDA, Addressing.INDIRECT_Y, 2, 5, OpAccess.RD],
  // STA
  [0x85, OpType.STA, Addressing.ZEROPAGE, 2, 3, OpAccess.WT],
  [0x95, OpType.STA, Addressing.ZEROPAGE_X, 2, 4, OpAccess.WT],
  [0x8d, OpType.STA, Addressing.ABSOLUTE, 3, 4, OpAccess.WT],
  [0x9d, OpType.STA, Addressing.ABSOLUTE_X, 3, 5, OpAccess.WT],
  [0x99, OpType.STA, Addressing.ABSOLUTE_Y, 3, 5, OpAccess.WT],
  [0x95, OpType.STA, Addressing.ZEROPAGE_X, 2, 4, OpAccess.WT],
  [0x81, OpType.STA, Addressing.INDIRECT_X, 2, 6, OpAccess.WT],
  [0x91, OpType.STA, Addressing.INDIRECT_Y, 2, 6, OpAccess.WT],
  // LDX
  [0xa2, OpType.LDX, Addressing.IMMEDIATE, 2, 2, OpAccess.RD],
  [0xa6, OpType.LDX, Addressing.ZEROPAGE, 2, 3, OpAccess.RD],
  [0xb6, OpType.LDX, Addressing.ZEROPAGE_Y, 2, 4, OpAccess.RD],
  [0xae, OpType.LDX, Addressing.ABSOLUTE, 3, 4, OpAccess.RD],
  [0xbe, OpType.LDX, Addressing.ABSOLUTE_Y, 3, 4, OpAccess.RD],
  // STX
  [0x86, OpType.STX, Addressing.ZEROPAGE, 2, 3],
  [0x96, OpType.STX, Addressing.ZEROPAGE_Y, 2, 4],
  [0x8e, OpType.STX, Addressing.ABSOLUTE, 3, 4],
  // LDY
  [0xa0, OpType.LDY, Addressing.IMMEDIATE, 2, 2, OpAccess.RD],
  [0xa4, OpType.LDY, Addressing.ZEROPAGE, 2, 3, OpAccess.RD],
  [0xb4, OpType.LDY, Addressing.ZEROPAGE_X, 2, 4, OpAccess.RD],
  [0xac, OpType.LDY, Addressing.ABSOLUTE, 3, 4, OpAccess.RD],
  [0xbc, OpType.LDY, Addressing.ABSOLUTE_X, 3, 4, OpAccess.RD],
  // STY
  [0x84, OpType.STY, Addressing.ZEROPAGE, 2, 3],
  [0x94, OpType.STY, Addressing.ZEROPAGE_X, 2, 4],
  [0x8c, OpType.STY, Addressing.ABSOLUTE, 3, 4],
  //// T??
  [0xaa, OpType.TAX, Addressing.IMPLIED, 1, 2],
  [0xa8, OpType.TAY, Addressing.IMPLIED, 1, 2],
  [0x8a, OpType.TXA, Addressing.IMPLIED, 1, 2],
  [0x98, OpType.TYA, Addressing.IMPLIED, 1, 2],
  [0x9a, OpType.TXS, Addressing.IMPLIED, 1, 2],
  [0xba, OpType.TSX, Addressing.IMPLIED, 1, 2],

  // ADC
  [0x69, OpType.ADC, Addressing.IMMEDIATE, 2, 2, OpAccess.RD],
  [0x65, OpType.ADC, Addressing.ZEROPAGE, 2, 3, OpAccess.RD],
  [0x75, OpType.ADC, Addressing.ZEROPAGE_X, 2, 4, OpAccess.RD],
  [0x6d, OpType.ADC, Addressing.ABSOLUTE, 3, 4, OpAccess.RD],
  [0x7d, OpType.ADC, Addressing.ABSOLUTE_X, 3, 4, OpAccess.RD],
  [0x79, OpType.ADC, Addressing.ABSOLUTE_Y, 3, 4, OpAccess.RD],
  [0x61, OpType.ADC, Addressing.INDIRECT_X, 2, 6, OpAccess.RD],
  [0x71, OpType.ADC, Addressing.INDIRECT_Y, 2, 5, OpAccess.RD],
  // SBC
  [0xe9, OpType.SBC, Addressing.IMMEDIATE, 2, 2, OpAccess.RD],
  [0xe5, OpType.SBC, Addressing.ZEROPAGE, 2, 3, OpAccess.RD],
  [0xf5, OpType.SBC, Addressing.ZEROPAGE_X, 2, 4, OpAccess.RD],
  [0xed, OpType.SBC, Addressing.ABSOLUTE, 3, 4, OpAccess.RD],
  [0xfd, OpType.SBC, Addressing.ABSOLUTE_X, 3, 4, OpAccess.RD],
  [0xf9, OpType.SBC, Addressing.ABSOLUTE_Y, 3, 4, OpAccess.RD],
  [0xe1, OpType.SBC, Addressing.INDIRECT_X, 2, 6, OpAccess.RD],
  [0xf1, OpType.SBC, Addressing.INDIRECT_Y, 2, 5, OpAccess.RD],

  // CMP
  [0xc9, OpType.CMP, Addressing.IMMEDIATE, 2, 2, OpAccess.RD],
  [0xc5, OpType.CMP, Addressing.ZEROPAGE, 2, 3, OpAccess.RD],
  [0xd5, OpType.CMP, Addressing.ZEROPAGE_X, 2, 4, OpAccess.RD],
  [0xcd, OpType.CMP, Addressing.ABSOLUTE, 3, 4, OpAccess.RD],
  [0xdd, OpType.CMP, Addressing.ABSOLUTE_X, 3, 4, OpAccess.RD],
  [0xd9, OpType.CMP, Addressing.ABSOLUTE_Y, 3, 4, OpAccess.RD],
  [0xc1, OpType.CMP, Addressing.INDIRECT_X, 2, 6, OpAccess.RD],
  [0xd1, OpType.CMP, Addressing.INDIRECT_Y, 2, 5, OpAccess.RD],
  // CPX
  [0xe0, OpType.CPX, Addressing.IMMEDIATE, 2, 2, OpAccess.RD],
  [0xe4, OpType.CPX, Addressing.ZEROPAGE, 2, 3, OpAccess.RD],
  [0xec, OpType.CPX, Addressing.ABSOLUTE, 3, 4, OpAccess.RD],
  // CPY
  [0xc0, OpType.CPY, Addressing.IMMEDIATE, 2, 2, OpAccess.RD],
  [0xc4, OpType.CPY, Addressing.ZEROPAGE, 2, 3, OpAccess.RD],
  [0xcc, OpType.CPY, Addressing.ABSOLUTE, 3, 4, OpAccess.RD],
  // INX
  [0xe8, OpType.INX, Addressing.IMPLIED, 1, 2],
  // INY
  [0xc8, OpType.INY, Addressing.IMPLIED, 1, 2],
  // INC
  [0xe6, OpType.INC, Addressing.ZEROPAGE, 2, 5, OpAccess.RW],
  [0xf6, OpType.INC, Addressing.ZEROPAGE_X, 2, 6, OpAccess.RW],
  [0xee, OpType.INC, Addressing.ABSOLUTE, 3, 6, OpAccess.RW],
  [0xfe, OpType.INC, Addressing.ABSOLUTE_X, 3, 7, OpAccess.RW],

  // DEX
  [0xca, OpType.DEX, Addressing.IMPLIED, 1, 2],
  // DEY
  [0x88, OpType.DEY, Addressing.IMPLIED, 1, 2],
  // DEC
  [0xc6, OpType.DEC, Addressing.ZEROPAGE, 2, 5, OpAccess.RW],
  [0xd6, OpType.DEC, Addressing.ZEROPAGE_X, 2, 6, OpAccess.RW],
  [0xce, OpType.DEC, Addressing.ABSOLUTE, 3, 6, OpAccess.RW],
  [0xde, OpType.DEC, Addressing.ABSOLUTE_X, 3, 7, OpAccess.RW],

  // AND
  [0x29, OpType.AND, Addressing.IMMEDIATE, 2, 2, OpAccess.RD],
  [0x25, OpType.AND, Addressing.ZEROPAGE, 2, 3, OpAccess.RD],
  [0x35, OpType.AND, Addressing.ZEROPAGE_X, 2, 4, OpAccess.RD],
  [0x2d, OpType.AND, Addressing.ABSOLUTE, 3, 4, OpAccess.RD],
  [0x3d, OpType.AND, Addressing.ABSOLUTE_X, 3, 4, OpAccess.RD],
  [0x39, OpType.AND, Addressing.ABSOLUTE_Y, 3, 4, OpAccess.RD],
  [0x21, OpType.AND, Addressing.INDIRECT_X, 2, 6, OpAccess.RD],
  [0x31, OpType.AND, Addressing.INDIRECT_Y, 2, 5, OpAccess.RD],
  // ORA
  [0x09, OpType.ORA, Addressing.IMMEDIATE, 2, 2, OpAccess.RD],
  [0x05, OpType.ORA, Addressing.ZEROPAGE, 2, 3, OpAccess.RD],
  [0x15, OpType.ORA, Addressing.ZEROPAGE_X, 2, 4, OpAccess.RD],
  [0x0d, OpType.ORA, Addressing.ABSOLUTE, 3, 4, OpAccess.RD],
  [0x1d, OpType.ORA, Addressing.ABSOLUTE_X, 3, 4, OpAccess.RD],
  [0x19, OpType.ORA, Addressing.ABSOLUTE_Y, 3, 4, OpAccess.RD],
  [0x01, OpType.ORA, Addressing.INDIRECT_X, 2, 6, OpAccess.RD],
  [0x11, OpType.ORA, Addressing.INDIRECT_Y, 2, 5, OpAccess.RD],
  // EOR
  [0x49, OpType.EOR, Addressing.IMMEDIATE, 2, 2, OpAccess.RD],
  [0x45, OpType.EOR, Addressing.ZEROPAGE, 2, 3, OpAccess.RD],
  [0x55, OpType.EOR, Addressing.ZEROPAGE_X, 2, 4, OpAccess.RD],
  [0x4d, OpType.EOR, Addressing.ABSOLUTE, 3, 4, OpAccess.RD],
  [0x5d, OpType.EOR, Addressing.ABSOLUTE_X, 3, 4, OpAccess.RD],
  [0x59, OpType.EOR, Addressing.ABSOLUTE_Y, 3, 4, OpAccess.RD],
  [0x41, OpType.EOR, Addressing.INDIRECT_X, 2, 6, OpAccess.RD],
  [0x51, OpType.EOR, Addressing.INDIRECT_Y, 2, 5, OpAccess.RD],
  // ROL
  [0x2a, OpType.ROL, Addressing.ACCUMULATOR, 1, 2, OpAccess.RD],
  [0x26, OpType.ROL, Addressing.ZEROPAGE, 2, 5, OpAccess.RW],
  [0x36, OpType.ROL, Addressing.ZEROPAGE_X, 2, 6, OpAccess.RW],
  [0x2e, OpType.ROL, Addressing.ABSOLUTE, 3, 6, OpAccess.RW],
  [0x3e, OpType.ROL, Addressing.ABSOLUTE_X, 3, 7, OpAccess.RW],
  // ROR
  [0x6a, OpType.ROR, Addressing.ACCUMULATOR, 1, 2, OpAccess.RD],
  [0x66, OpType.ROR, Addressing.ZEROPAGE, 2, 5, OpAccess.RW],
  [0x76, OpType.ROR, Addressing.ZEROPAGE_X, 2, 6, OpAccess.RW],
  [0x6e, OpType.ROR, Addressing.ABSOLUTE, 3, 6, OpAccess.RW],
  [0x7e, OpType.ROR, Addressing.ABSOLUTE_X, 3, 7, OpAccess.RW],
  // ASL
  [0x0a, OpType.ASL, Addressing.ACCUMULATOR, 1, 2, OpAccess.RD],
  [0x06, OpType.ASL, Addressing.ZEROPAGE, 2, 5, OpAccess.RW],
  [0x16, OpType.ASL, Addressing.ZEROPAGE_X, 2, 6, OpAccess.RW],
  [0x0e, OpType.ASL, Addressing.ABSOLUTE, 3, 6, OpAccess.RW],
  [0x1e, OpType.ASL, Addressing.ABSOLUTE_X, 3, 7, OpAccess.RW],
  // LSR
  [0x4a, OpType.LSR, Addressing.ACCUMULATOR, 1, 2, OpAccess.RD],
  [0x46, OpType.LSR, Addressing.ZEROPAGE, 2, 5, OpAccess.RW],
  [0x56, OpType.LSR, Addressing.ZEROPAGE_X, 2, 6, OpAccess.RW],
  [0x4e, OpType.LSR, Addressing.ABSOLUTE, 3, 6, OpAccess.RW],
  [0x5e, OpType.LSR, Addressing.ABSOLUTE_X, 3, 7, OpAccess.RW],
  // BIT
  [0x24, OpType.BIT, Addressing.ZEROPAGE, 2, 3, OpAccess.RD],
  [0x2c, OpType.BIT, Addressing.ABSOLUTE, 3, 4, OpAccess.RD],

  // JMP
  [0x4c, OpType.JMP, Addressing.ABSOLUTE, 3, 3],
  [0x6c, OpType.JMP, Addressing.INDIRECT, 3, 5],
  // JSR
  [0x20, OpType.JSR, Addressing.ABSOLUTE, 3, 6],
  // RTS
  [0x60, OpType.RTS, Addressing.IMPLIED, 1, 6],
  // RTI
  [0x40, OpType.RTI, Addressing.IMPLIED, 1, 6],
  // Branch
  [0x90, OpType.BCC, Addressing.RELATIVE, 2, 2],
  [0xb0, OpType.BCS, Addressing.RELATIVE, 2, 2],
  [0x10, OpType.BPL, Addressing.RELATIVE, 2, 2],
  [0x30, OpType.BMI, Addressing.RELATIVE, 2, 2],
  [0xd0, OpType.BNE, Addressing.RELATIVE, 2, 2],
  [0xf0, OpType.BEQ, Addressing.RELATIVE, 2, 2],
  [0x50, OpType.BVC, Addressing.RELATIVE, 2, 2],
  [0x70, OpType.BVS, Addressing.RELATIVE, 2, 2],

  // Push, Pop
  [0x48, OpType.PHA, Addressing.IMPLIED, 1, 3],
  [0x08, OpType.PHP, Addressing.IMPLIED, 1, 3],
  [0x68, OpType.PLA, Addressing.IMPLIED, 1, 4],
  [0x28, OpType.PLP, Addressing.IMPLIED, 1, 4],

  [0x18, OpType.CLC, Addressing.IMPLIED, 1, 2],
  [0x38, OpType.SEC, Addressing.IMPLIED, 1, 2],

  [0x78, OpType.SEI, Addressing.IMPLIED, 1, 2],
  [0x58, OpType.CLI, Addressing.IMPLIED, 1, 2],
  [0xb8, OpType.CLV, Addressing.IMPLIED, 1, 2],
  [0xf8, OpType.SED, Addressing.IMPLIED, 1, 2],
  [0xd8, OpType.CLD, Addressing.IMPLIED, 1, 2],

  [0x00, OpType.BRK, Addressing.IMPLIED, 1, 7],

  // Unofficial
  [0x1a, OpType.IGN, Addressing.IMPLIED, 1, 2],
  [0x3a, OpType.IGN, Addressing.IMPLIED, 1, 2],
  [0x5a, OpType.IGN, Addressing.IMPLIED, 1, 2],
  [0x7a, OpType.IGN, Addressing.IMPLIED, 1, 2],
  [0xda, OpType.IGN, Addressing.IMPLIED, 1, 2],
  [0xfa, OpType.IGN, Addressing.IMPLIED, 1, 2],
  [0x04, OpType.IGN, Addressing.IMPLIED, 2, 3],
  [0x44, OpType.IGN, Addressing.IMPLIED, 2, 3],
  [0x64, OpType.IGN, Addressing.IMPLIED, 2, 3],
  [0x14, OpType.IGN, Addressing.IMPLIED, 2, 4],
  [0x34, OpType.IGN, Addressing.IMPLIED, 2, 4],
  [0x54, OpType.IGN, Addressing.IMPLIED, 2, 4],
  [0x74, OpType.IGN, Addressing.IMPLIED, 2, 4],
  [0xd4, OpType.IGN, Addressing.IMPLIED, 2, 4],
  [0xf4, OpType.IGN, Addressing.IMPLIED, 2, 4],
  [0x0c, OpType.IGN, Addressing.IMPLIED, 3, 4],
  [0x1c, OpType.IGN, Addressing.IMPLIED, 3, 4],
  [0x3c, OpType.IGN, Addressing.IMPLIED, 3, 4],
  [0x5c, OpType.IGN, Addressing.IMPLIED, 3, 4],
  [0x7c, OpType.IGN, Addressing.IMPLIED, 3, 4],
  [0xdc, OpType.IGN, Addressing.IMPLIED, 3, 4],
  [0xfc, OpType.IGN, Addressing.IMPLIED, 3, 5],
  [0x80, OpType.SKB, Addressing.IMPLIED, 2, 2],
  [0x82, OpType.SKB, Addressing.IMPLIED, 2, 2],
  [0x89, OpType.SKB, Addressing.IMPLIED, 2, 2],
  [0xc2, OpType.SKB, Addressing.IMPLIED, 2, 2],
  [0xe2, OpType.SKB, Addressing.IMPLIED, 2, 2],

  [0xeb, OpType.SBC, Addressing.IMMEDIATE, 2, 2],

  [0xa3, OpType.LAX, Addressing.INDIRECT_X, 2, 6],
  [0xb3, OpType.LAX, Addressing.INDIRECT_Y, 2, 5],
  [0xa7, OpType.LAX, Addressing.ZEROPAGE, 2, 3],
  [0xb7, OpType.LAX, Addressing.ZEROPAGE_Y, 2, 4],
  [0xaf, OpType.LAX, Addressing.ABSOLUTE, 3, 4],
  [0xbf, OpType.LAX, Addressing.ABSOLUTE_Y, 3, 4],

  [0x87, OpType.SAX, Addressing.ZEROPAGE, 2, 6],
  [0x97, OpType.SAX, Addressing.ZEROPAGE_Y, 2, 3],
  [0x8f, OpType.SAX, Addressing.ABSOLUTE, 3, 4],
  [0x83, OpType.SAX, Addressing.INDIRECT_X, 3, 4],

  [0xe7, OpType.ISB, Addressing.ZEROPAGE, 2, 5],
  [0xf7, OpType.ISB, Addressing.ZEROPAGE_X, 2, 6],
  [0xe3, OpType.ISB, Addressing.INDIRECT_X, 2, 8],
  [0xf3, OpType.ISB, Addressing.INDIRECT_Y, 2, 8],
  [0xef, OpType.ISB, Addressing.ABSOLUTE, 3, 6],
  [0xff, OpType.ISB, Addressing.ABSOLUTE_X, 3, 7],
  [0xfb, OpType.ISB, Addressing.ABSOLUTE_Y, 3, 7],

  [0xc7, OpType.DCP, Addressing.ZEROPAGE, 2, 5],
  [0xd7, OpType.DCP, Addressing.ZEROPAGE_X, 2, 6],
  [0xc3, OpType.DCP, Addressing.INDIRECT_X, 2, 8],
  [0xd3, OpType.DCP, Addressing.INDIRECT_Y, 2, 8],
  [0xcf, OpType.DCP, Addressing.ABSOLUTE, 3, 6],
  [0xdf, OpType.DCP, Addressing.ABSOLUTE_X, 3, 7],
  [0xdb, OpType.DCP, Addressing.ABSOLUTE_Y, 3, 7],

  [0x27, OpType.RLA, Addressing.ZEROPAGE, 2, 5],
  [0x37, OpType.RLA, Addressing.ZEROPAGE_X, 2, 6],
  [0x23, OpType.RLA, Addressing.INDIRECT_X, 2, 8],
  [0x33, OpType.RLA, Addressing.INDIRECT_Y, 2, 8],
  [0x2f, OpType.RLA, Addressing.ABSOLUTE, 3, 6],
  [0x3f, OpType.RLA, Addressing.ABSOLUTE_X, 3, 7],
  [0x3b, OpType.RLA, Addressing.ABSOLUTE_Y, 3, 7],

  [0x67, OpType.RRA, Addressing.ZEROPAGE, 2, 5],
  [0x77, OpType.RRA, Addressing.ZEROPAGE_X, 2, 6],
  [0x63, OpType.RRA, Addressing.INDIRECT_X, 2, 8],
  [0x73, OpType.RRA, Addressing.INDIRECT_Y, 2, 8],
  [0x6f, OpType.RRA, Addressing.ABSOLUTE, 3, 6],
  [0x7f, OpType.RRA, Addressing.ABSOLUTE_X, 3, 7],
  [0x7b, OpType.RRA, Addressing.ABSOLUTE_Y, 3, 7],

  [0x03, OpType.SLO, Addressing.INDIRECT_X, 2, 6],
  [0x13, OpType.SLO, Addressing.INDIRECT_Y, 2, 5],
  [0x07, OpType.SLO, Addressing.ZEROPAGE, 2, 3],
  [0x17, OpType.SLO, Addressing.ZEROPAGE_X, 2, 4],
  [0x0f, OpType.SLO, Addressing.ABSOLUTE, 3, 4],
  [0x1f, OpType.SLO, Addressing.ABSOLUTE_X, 3, 4],
  [0x1b, OpType.SLO, Addressing.ABSOLUTE_Y, 3, 4],

  [0x47, OpType.SRE, Addressing.ZEROPAGE, 2, 5],
  [0x57, OpType.SRE, Addressing.ZEROPAGE_X, 2, 6],
  [0x43, OpType.SRE, Addressing.INDIRECT_X, 2, 8],
  [0x53, OpType.SRE, Addressing.INDIRECT_Y, 2, 8],
  [0x4f, OpType.SRE, Addressing.ABSOLUTE, 3, 6],
  [0x5f, OpType.SRE, Addressing.ABSOLUTE_X, 3, 7],
  [0x5b, OpType.SRE, Addressing.ABSOLUTE_Y, 3, 7],
]

export const kIllegalInstruction: Instruction = {
  opType: OpType.UNKNOWN,
  addressing: Addressing.UNKNOWN,
  bytes: 1,
  cycle: 0,
  read: false,
  write: false,
}

export const kInstTable: Instruction[] = (() => {
  const table = new Array<Instruction>(256)
  table.fill(kIllegalInstruction)
  kTable.forEach(inst => {
    const [code, opType, addressing, bytes, cycle, access] = inst
    const read = access === OpAccess.RD || access === OpAccess.RW
    const write = access === OpAccess.WT || access === OpAccess.RW
    table[code] = {opType, addressing, bytes, cycle, read, write}
  })
  return table
})()
