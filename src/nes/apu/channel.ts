import {Byte} from '../types'
import {Reg} from './apu.constants'

// Sound channel
export interface IChannel {
  getVolume(): number
  getFrequency(): number
  setEnable(value: boolean, channel: number): void
  isEnabled(): boolean
}

export abstract class ChannelBase implements IChannel {
  protected regs = new Uint8Array(4)
  protected enabled = false
  protected stopped = true
  protected channel!: number

  public reset(): void {
    this.regs.fill(0)
    this.enabled = false
    this.stopped = true
  }

  public write(reg: Reg, value: Byte): void {
    this.regs[reg] = value
  }

  public getVolume(): number {
    return 0
  }

  public getFrequency(): number {
    return 1
  }

  public setEnable(value: boolean, channel: number): void {
    this.enabled = value
    this.channel = channel
    if (!value) this.stopped = true
  }
  public update(): void {}

  public isEnabled(): boolean {
    return this.enabled
  }

  public isPlaying(): boolean {
    return !this.stopped
  }
}
