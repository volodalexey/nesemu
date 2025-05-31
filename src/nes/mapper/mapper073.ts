// VRC3
// http://wiki.nesdev.com/w/index.php/VRC3

import {IrqType} from '../cpu/cpu'
import {Mapper, MapperOptions} from './mapper'

export class Mapper073 extends Mapper {
  private prgBank = 0
  private irqEnable: boolean
  private irqValue: number
  private irqCounter: number

  public static create(options: MapperOptions): Mapper {
    return new Mapper073(options)
  }

  constructor(options: MapperOptions) {
    super(options, 0x2000)

    this.irqEnable = false
    this.irqValue = this.irqCounter = -1

    const BANK_BIT = 14
    const prgCount = options.cartridge!.prgRom.byteLength >> BANK_BIT
    this.options.setPrgBank(0, 0)
    this.options.setPrgBank(1, 1)
    this.setPrgBank((prgCount - 1) * 2)

    // PRG ROM bank
    this.options.setWriteMemory(0xf000, 0xffff, (_adr, value) => {
      this.setPrgBank(value << 1)
    })

    // IRQ Latch 0, 1
    this.options.setWriteMemory(0x8000, 0x9fff, (adr, value) => {
      if (adr < 0x9000) this.irqValue = (this.irqValue & 0xfff0) | (value & 0x0f)
      else this.irqValue = (this.irqValue & 0xff0f) | ((value & 0x0f) << 4)
    })
    // IRQ Latch 2, 3
    this.options.setWriteMemory(0xa000, 0xbfff, (adr, value) => {
      if (adr < 0xb000) this.irqValue = (this.irqValue & 0xf0ff) | ((value & 0x0f) << 8)
      else this.irqValue = (this.irqValue & 0x0fff) | ((value & 0x0f) << 12)
    })

    this.options.setWriteMemory(0xc000, 0xdfff, (adr, value) => {
      if (adr < 0xd000) {
        // IRQ Control
        this.enableIrq((value & 2) !== 0)
        this.irqCounter = this.irqValue
      } else {
        // IRQ Acknowledge
      }
    })
  }

  public reset(): void {
    this.irqEnable = false
    this.irqValue = this.irqCounter = -1
  }

  public save(): object {
    return super.save({
      prgBank: this.prgBank,
      irqEnable: this.irqEnable,
      irqValue: this.irqValue,
      irqCounter: this.irqCounter,
    })
  }

  public load(saveData: any): void {
    super.load(saveData)
    // this.prgBank = saveData.prgBank
    this.irqEnable = saveData.irqEnable
    this.irqValue = saveData.irqValue
    this.irqCounter = saveData.irqCounter

    this.setPrgBank(saveData.prgBank)
  }

  public onHblank(_hcount: number): void {
    if (this.irqEnable && this.irqCounter > 0) {
      this.irqCounter -= 185 // TODO: Calculate.
      if (this.irqCounter < 0) {
        this.irqCounter = 0
        this.options.requestIrq(IrqType.EXTERNAL)
      }
    }
  }

  private setPrgBank(prgBank: number): void {
    this.prgBank = prgBank
    this.options.setPrgBank(0, prgBank)
    this.options.setPrgBank(1, prgBank + 1)
  }

  private enableIrq(value: boolean): void {
    this.irqEnable = value
  }
}
