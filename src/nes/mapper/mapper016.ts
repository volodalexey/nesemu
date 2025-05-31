// Bandai FCG board

import {IrqType} from '../cpu/cpu'
import {Mapper, MapperOptions} from './mapper'
import {MirrorMode} from '../ppu/types'
import {Util} from '../../util/util'

const kMirrorTable = [MirrorMode.VERT, MirrorMode.HORZ, MirrorMode.SINGLE0, MirrorMode.SINGLE1]

export class Mapper016 extends Mapper {
  private prgBank = 0
  private chrBank = new Uint8Array(8)
  private irqEnable = false
  private irqValue = 0
  private irqCounter = 0

  public static create(options: MapperOptions): Mapper {
    return new Mapper016(options)
  }

  constructor(options: MapperOptions) {
    super(options)

    const BANK_BIT = 14
    const BANK_SIZE = 1 << BANK_BIT
    const size = options.cartridge!.prgRom.byteLength
    const count = size / BANK_SIZE

    this.options.setPrgBank(2, count * 2 - 2)
    this.options.setPrgBank(3, count * 2 - 1)
    this.setPrgBank(0)

    this.options.setWriteMemory(0x6000, 0xffff, (adr, value) => {
      const a = adr & 0x0f
      switch (a) {
        // CHR-ROM bank select.
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          this.chrBank[a] = value
          this.setChrBank(a, value)
          break
        case 8: // PRG-ROM bank select.
          this.prgBank = value & (count - 1)
          this.setPrgBank(this.prgBank)
          break
        case 9: // Nametable mirroring type select.
          this.options.setMirrorMode(kMirrorTable[value & 3])
          break
        case 0x0a: // IRQ Control.
          this.irqEnable = (value & 1) !== 0
          break
        case 0x0b:
        case 0x0c: // IRQ latch/counter.
          {
            const shift = (a - 0x0b) * 8
            this.irqValue = (this.irqValue & (0xff00 >> shift)) | (value << shift)
            this.irqCounter = this.irqValue
          }
          break
        default:
          console.log(`Write ${Util.hex(adr, 4)}, ${Util.hex(value, 2)}`)
          break
      }
    })
  }

  public reset(): void {
    this.irqEnable = false
    this.irqValue = this.irqCounter = 0
  }

  public save(): object {
    return super.save({
      prgBank: this.prgBank,
      chrBank: Util.convertUint8ArrayToBase64String(this.chrBank),
      irqEnable: this.irqEnable,
      irqValue: this.irqValue,
      irqCounter: this.irqCounter,
    })
  }

  public load(saveData: any): void {
    super.load(saveData)
    this.prgBank = saveData.prgBank
    this.chrBank = Util.convertBase64StringToUint8Array(saveData.chrBank)
    this.irqEnable = saveData.irqEnable
    this.irqValue = saveData.irqValue
    this.irqCounter = saveData.irqCounter

    this.setPrgBank(this.prgBank)
    for (let i = 0; i < this.chrBank.length; ++i) this.setChrBank(i, this.chrBank[i])
  }

  public onHblank(_hcount: number): void {
    if (this.irqEnable) {
      this.irqCounter -= 115
      if (this.irqCounter <= 0) {
        this.irqCounter += this.irqValue
        this.options.requestIrq(IrqType.EXTERNAL)
      }
    }
  }

  private setPrgBank(bank: number): void {
    this.options.setPrgBank(0, bank * 2)
    this.options.setPrgBank(1, bank * 2 + 1)
  }

  private setChrBank(bank: number, value: number): void {
    this.options.setChrBankOffset(bank, value)
  }
}
