import {VBlank} from '../const'
import {Byte} from '../types'
import {DMC_IRQ_ENABLE, DMC_LOOP_ENABLE, Reg} from './apu.constants'
import {ChannelBase} from './channel'

export interface IDeltaModulationChannel {
  getWriteBuf(): ReadonlyArray<number>
}

// DMC
export class DeltaModulationChannel extends ChannelBase implements IDeltaModulationChannel {
  private regsLengthCounter = 1
  private dmaLengthCounter = 0

  private currWriteBuf: number[] = []
  private prevWriteBuf: number[] = []

  public constructor(private triggerIrq: () => void) {
    super()
  }

  public setEnable(value: boolean): void {
    this.enabled = value
    this.stopped = !value
    if (value) {
      if (this.dmaLengthCounter === 0) {
        this.dmaLengthCounter = this.regsLengthCounter
      }
    } else {
      this.dmaLengthCounter = 0
    }

    // Put enable setting to command buffer.
    this.currWriteBuf.push((0xff << 8) | (value ? 1 : 0))
  }

  public write(reg: Reg, value: Byte): void {
    super.write(reg, value)
    this.currWriteBuf.push((reg << 8) | value)

    switch (reg) {
      case Reg.TIMER_H: // Set length.
        this.regsLengthCounter = ((value << 4) + 1) * 8
        break
      default:
        break
    }
  }

  public getWriteBuf(): ReadonlyArray<number> {
    return this.prevWriteBuf
  }

  public getVolume(): number {
    return this.stopped ? 0 : 1
  }

  public getFrequency(): number {
    throw new Error('Invalid call')
  }

  public onHblank(hcount: number): void {
    this.updateLength()

    if (hcount === VBlank.NMI) {
      // Swap buffers
      const tmp = this.currWriteBuf
      this.currWriteBuf = this.prevWriteBuf
      this.prevWriteBuf = tmp
      this.currWriteBuf.length = 0
    }
  }

  private updateLength(): void {
    if (this.stopped) return

    let l = this.dmaLengthCounter
    if (l <= 0) {
      l = 0
      if ((this.regs[0] & DMC_LOOP_ENABLE) === 0) {
        this.stopped = true
        if ((this.regs[0] & DMC_IRQ_ENABLE) !== 0) this.triggerIrq()
      } else {
        l = this.regsLengthCounter
      }
    } else {
      l -= 1
      if (l < 0) l = 0
    }
    this.dmaLengthCounter = l
  }
}
