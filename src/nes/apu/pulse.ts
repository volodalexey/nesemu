import {CPU_HZ} from '../const'
import {Byte} from '../types'
import {kLengthTable, kPulseDutyRatio, LENGTH_COUNTER_HALT, Reg} from './apu.constants'
import {ChannelBase} from './channel'
import {Envelope} from './envelope'

export interface IPulseChannel {
  getDutyRatio(): number
}

export class PulseChannel extends ChannelBase implements IPulseChannel {
  private lengthCounter = 0
  private sweepCounter = 0
  private envelope = new Envelope()

  public reset(): void {
    super.reset()
    this.sweepCounter = 0
    this.envelope.clear()
  }

  public write(reg: Reg, value: Byte): void {
    super.write(reg, value)

    switch (reg) {
      case Reg.STATUS:
        this.stopped = false
        this.envelope.write(value)
        break
      case Reg.SWEEP:
        this.sweepCounter = (value >> 4) & 7
        break
      case Reg.TIMER_H:
        this.lengthCounter = kLengthTable[value >> 3]
        this.stopped = false
        this.envelope.resetClock()
        break
      default:
        break
    }
  }

  public getVolume(): number {
    if (this.stopped) return 0
    return this.envelope.getVolume()
  }

  public getFrequency(): number {
    const value = this.regs[Reg.TIMER_L] + ((this.regs[Reg.TIMER_H] & 7) << 8)
    return (CPU_HZ / 16 / (value + 1)) | 0
  }

  public getDutyRatio(): number {
    return kPulseDutyRatio[(this.regs[Reg.STATUS] >> 6) & 3]
  }

  public update(): void {
    if (this.stopped) return

    this.updateLength()
    this.envelope.update()
    this.sweep()
  }

  private updateLength(): void {
    const v = this.regs[Reg.STATUS]
    if ((v & LENGTH_COUNTER_HALT) !== 0) return
    let l = this.lengthCounter
    if (l <= 0) {
      l = 0
      this.stopped = true
    } else {
      l -= 2
      if (l < 0) l = 0
    }
    this.lengthCounter = l
  }

  // APU Sweep: http://wiki.nesdev.com/w/index.php/APU_Sweep
  private sweep(): void {
    const sweep = this.regs[Reg.SWEEP]
    if ((sweep & 0x80) === 0)
      // Not enabled.
      return

    let c = this.sweepCounter
    c += 2 // 2 sequences per frame.
    const count = (sweep >> 4) & 7
    if (c >= count) {
      c -= count

      let freq = this.regs[Reg.TIMER_L] + ((this.regs[Reg.TIMER_H] & 7) << 8)
      const shift = sweep & 7
      if (shift > 0) {
        const add = freq >> shift
        if ((sweep & 0x08) === 0) {
          freq += add
          if (freq > 0x07ff) this.stopped = true
        } else {
          freq -= add
          if (freq < 8) this.stopped = true
        }
        this.regs[Reg.TIMER_L] = freq & 0xff
        this.regs[Reg.TIMER_H] = (this.regs[Reg.TIMER_H] & ~7) | ((freq & 0x0700) >> 8)
      }

      c -= 2 // 2 sequences per frame
      if (c <= 0) {
        this.sweepCounter = ((sweep >> 4) & 7) + c
      }
    }
    this.sweepCounter = c
  }
}
