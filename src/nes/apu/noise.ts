import {Byte} from '../types'
import {kLengthTable, kNoiseFrequencies, LENGTH_COUNTER_HALT, Reg} from './apu.constants'
import {ChannelBase} from './channel'
import {Envelope} from './envelope'

export interface INoiseChannel {
  getNoisePeriod(): ReadonlyArray<number>
}

export class NoiseChannel extends ChannelBase implements INoiseChannel {
  private lengthCounter = 0
  private envelope = new Envelope()
  private noisePeriod = [0, 0]

  public reset(): void {
    super.reset()
    this.envelope.clear()
  }

  public write(reg: Reg, value: Byte): void {
    super.write(reg, value)

    switch (reg) {
      case Reg.STATUS:
        this.stopped = false
        this.envelope.write(value)
        break
      case Reg.TIMER_L:
        {
          const val = this.regs[Reg.TIMER_L]
          this.noisePeriod[0] = kNoiseFrequencies[val & 15]
          this.noisePeriod[1] = (val >> 7) & 1
        }
        break
      case Reg.TIMER_H: // Set length.
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
    throw new Error('Invalid call')
  }

  public getNoisePeriod(): ReadonlyArray<number> {
    return this.noisePeriod
  }

  public update(): void {
    if (this.stopped) return

    this.updateLength()
    this.envelope.update()
  }

  private updateLength(): void {
    const v = this.regs[Reg.STATUS]
    if ((v & LENGTH_COUNTER_HALT) !== 0) return
    let l = this.lengthCounter
    if (l <= 0) {
      l = 0
      if ((this.regs[2] & 0x80) === 0) {
        this.stopped = true
      }
    } else {
      l -= 2
      if (l < 0) l = 0
    }
    this.lengthCounter = l
  }
}
