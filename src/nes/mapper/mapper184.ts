// Sunsoft-1 mapper

import {Mapper, MapperOptions} from './mapper'

export class Mapper184 extends Mapper {
  public static create(options: MapperOptions): Mapper {
    return new Mapper184(options)
  }

  constructor(options: MapperOptions) {
    super(options)

    // CHR ROM bank
    this.options.setWriteMemory(0x6000, 0x7fff, (_adr, value) => {
      const hi = ((value >> (4 - 2)) & (7 << 2)) + (4 << 2)
      const lo = (value & 7) << 2
      for (let i = 0; i < 4; ++i) this.options.setChrBankOffset(i + 4, hi + i)
      for (let i = 0; i < 4; ++i) this.options.setChrBankOffset(i, lo + i)
    })
  }
}
