// APU: Audio Processing Unit

import {Address, Byte} from '../types'
import {Util} from '../../util/util'
import {VBlank} from '../const'
import {
  BASE,
  FRAME_COUNTER,
  IRQ_INHIBIT,
  PAD1_REG,
  PAD2_REG,
  PadValue,
  SEQUENCER_MODE,
  STATUS_REG,
  WaveType,
} from './apu.constants'
import {ChannelBase} from './channel'
import {PulseChannel} from './pulse'
import {TriangleChannel} from './triangle'
import {NoiseChannel} from './noise'
import {DeltaModulationChannel} from './dmc'

const CHANNEL_COUNT = 5
const enum ApuChannel {
  PULSE1 = 0,
  PULSE2 = 1,
  TRIANGLE = 2,
  NOISE = 3,
  DMC = 4,
}

export const kWaveTypes: WaveType[] = [
  WaveType.PULSE,
  WaveType.PULSE,
  WaveType.TRIANGLE,
  WaveType.NOISE,
  WaveType.DMC,
]

// ================================================================
// GamePad
export class GamePad {
  private status = 0
  private tmp = 0

  public setStatus(status: Byte): void {
    // Prevent simultaneous pressing on LR and UD.
    const LR = PadValue.L | PadValue.R,
      UD = PadValue.U | PadValue.D
    if ((status & LR) === LR) status &= ~LR
    if ((status & UD) === UD) status &= ~UD
    this.status = status & 0xff
  }

  public latch(): void {
    this.tmp = this.status
  }

  public shift(): number {
    const value = this.tmp
    this.tmp = value >> 1
    return value & 1
  }
}

export type APUSaveData = {
  regs: string
}

// Apu
export class Apu {
  private regs = new Uint8Array(0x20)
  private channels: Array<ChannelBase>
  private frameInterrupt = 0 // 0=not occurred, 0x40=occurred
  private dmcInterrupt = 0x80 // 0=not occurred, 0x80=occurred

  constructor(
    private gamePads: GamePad[],
    private triggerIrq: () => void,
  ) {
    this.regs.fill(0)
    this.regs[FRAME_COUNTER] = IRQ_INHIBIT

    this.channels = kWaveTypes.map((t: WaveType): ChannelBase => {
      switch (t) {
        case WaveType.PULSE:
          return new PulseChannel()
        case WaveType.TRIANGLE:
          return new TriangleChannel()
        case WaveType.NOISE:
          return new NoiseChannel()
        case WaveType.DMC:
          return new DeltaModulationChannel(triggerIrq)
        default:
          throw new Error('Illegal wave type')
      }
    })
  }

  public getWaveTypes(): WaveType[] {
    return kWaveTypes
  }

  public getChannel(ch: number): ChannelBase {
    return this.channels[ch]
  }

  public reset(): void {
    this.frameInterrupt = 0
    this.dmcInterrupt = 0x80 // TODO: Implement
    this.channels.forEach(channel => {
      channel.reset()
    })
  }

  public save(): APUSaveData {
    return {
      regs: Util.convertUint8ArrayToBase64String(this.regs),
    }
  }

  public load(saveData: APUSaveData): void {
    const regs = Util.convertBase64StringToUint8Array(saveData.regs)
    for (let i = 0; i < regs.length; ++i) this.write(i + BASE, regs[i])
  }

  public read(adr: Address): Byte {
    const reg = adr - BASE
    switch (reg) {
      case STATUS_REG: {
        let result = this.dmcInterrupt | this.frameInterrupt
        for (let ch = 0; ch < CHANNEL_COUNT; ++ch) {
          if ((this.regs[STATUS_REG] & (1 << ch)) !== 0 && this.channels[ch].isPlaying())
            result |= 1 << ch
        }

        // Reading this register clears the frame interrupt flag (but not the DMC interrupt flag).
        this.frameInterrupt = 0
        return result
      }
      case PAD1_REG:
      case PAD2_REG:
        return this.gamePads[reg - PAD1_REG].shift()
      default:
        return 0
    }
  }

  public write(adr: Address, value: Byte): void {
    const reg = adr - BASE
    if (reg >= 0x20) return

    this.regs[reg] = value

    if (reg < 0x14) {
      // Sound
      const ch = reg >> 2
      const r = reg & 3
      this.channels[ch].write(r, value, adr)
    }

    switch (reg) {
      case STATUS_REG:
        this.dmcInterrupt = 0 // Writing to this register clears the DMC interrupt flag.
        for (let ch = 0; ch < CHANNEL_COUNT; ++ch)
          this.channels[ch].setEnable((value & (1 << ch)) !== 0, ch, adr)
        break
      case PAD1_REG: // Pad status. bit0 = Controller shift register strobe
        if ((value & 1) === 0) {
          for (const pad of this.gamePads) pad.latch()
        }
        break
      default:
        break
    }
  }

  public onHblank(hcount: number): void {
    ;(this.channels[ApuChannel.DMC] as DeltaModulationChannel).onHblank(hcount)

    switch (hcount) {
      case VBlank.NMI:
        this.channels.forEach(channel => channel.update())
        if (this.isIrqEnabled()) {
          this.frameInterrupt = 0x40
          this.triggerIrq()
        }
        break
      default:
        break
    }
  }

  private isIrqEnabled(): boolean {
    // http://wiki.nesdev.com/w/index.php/IRQ
    // Enable: $4017 write with bits 7-6 = 00
    return (this.regs[FRAME_COUNTER] & (IRQ_INHIBIT | SEQUENCER_MODE)) === 0
  }
}
