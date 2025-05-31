import {Byte} from '../types'

const CONSTANT_VOLUME = 0x10
const ENVELOPE_LOOP = 0x20

export class Envelope {
  private divider = 0
  private decayLevel = 0
  private reset = false
  private reg: Byte = 0

  public clear(): void {
    this.divider = this.decayLevel = 0
  }

  public resetClock(): void {
    this.reset = true
  }

  public write(value: Byte): void {
    this.reg = value
    if ((value & CONSTANT_VOLUME) === 0) {
      this.divider = value & 0x0f
      // this.counter = 0x0f
    }
  }

  public getVolume(): number {
    const v = (this.reg & CONSTANT_VOLUME) !== 0 ? this.reg & 15 : this.decayLevel
    return v * (1.0 / 15)
  }

  public update(): void {
    for (let i = 0; i < 4; ++i) {
      if (this.reset) {
        this.reset = false
        this.decayLevel = 0x0f
      } else if (this.divider > 0) {
        --this.divider
        continue
      } else if (this.decayLevel > 0) {
        --this.decayLevel
      } else if ((this.reg & ENVELOPE_LOOP) !== 0) {
        this.decayLevel = 0x0f
      }
      this.divider = this.reg & 0x0f
    }
  }
}
