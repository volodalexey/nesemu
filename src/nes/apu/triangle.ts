import {CPU_HZ} from '../const'
import {Byte} from '../types'
import {kLengthTable, LENGTH_COUNTER_HALT_TRI, Reg} from './apu.constants'
import {ChannelBase} from './channel'

export class TriangleChannel extends ChannelBase {
  private lengthCounter = 0
  private linearCounter = 0
  private linearReload = false

  public write(reg: Reg, value: Byte): void {
    super.write(reg, value)

    switch (reg) {
      case Reg.TIMER_H:
        this.lengthCounter = kLengthTable[value >> 3]
        this.stopped = false
        this.linearReload = true
        break
      default:
        break
    }
  }

  public getVolume(): number {
    if (this.stopped || this.linearCounter <= 0) return 0
    return 1
  }

  public getFrequency(): number {
    const value = this.regs[Reg.TIMER_L] + ((this.regs[Reg.TIMER_H] & 7) << 8)
    return (CPU_HZ / 32 / (value + 1)) | 0
  }

  public update(): void {
    if (this.stopped) return

    this.updateLinear()
    this.updateLength()
  }

  private updateLinear(): void {
    for (let i = 0; i < 4; ++i) {
      if (this.linearReload) {
        this.linearCounter = this.regs[Reg.STATUS] & 0x7f
      } else if (this.linearCounter > 0) {
        --this.linearCounter
      } else {
        this.stopped = true
      }

      if ((this.regs[Reg.STATUS] & LENGTH_COUNTER_HALT_TRI) === 0) this.linearReload = false
    }
  }

  private updateLength(): void {
    if (this.lengthCounter >= 2) {
      this.lengthCounter -= 2
    } else {
      this.lengthCounter = 0
      if ((this.regs[Reg.STATUS] & LENGTH_COUNTER_HALT_TRI) === 0) {
        this.stopped = true
      }
    }
  }
}
