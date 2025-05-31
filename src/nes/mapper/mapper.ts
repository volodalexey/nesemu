import {Reader, Writer} from '../bus'
import {IrqType} from '../cpu/cpu'
import {MirrorMode} from '../ppu/types'
import {Address, Byte} from '../types'
import {ICartridge} from '../cartridge'
import {Util} from '../../util/util'
import {WaveType} from '../apu/apu.constants'
import {IChannel} from '../apu/channel'

export interface MapperOptions {
  cartridge: ICartridge | null
  // CPU
  setReadMemory(start: Address, end: Address, reader: Reader): void
  setWriteMemory(start: Address, end: Address, writer: Writer): void
  setPrgBank(bank: number, page: number): void
  requestIrq(type: IrqType): void
  clearIrqRequest(type: IrqType): void
  // PPU
  setChrBank(value: number): void
  setChrBankOffset(bank: number, value: number): void
  setMirrorMode(mode: MirrorMode): void
  setMirrorModeBit(bit: Byte): void
  getPpuRegs(): Readonly<Uint8Array>
  setChrData(chrData: Uint8Array): void
  writePpuDirect(addr: Address, value: Byte): void
  // Peripheral
  setPeripheral(ioMap: Map<number, (adr: Address, value?: Byte) => unknown>): void
}

export type MapperSaveData = {
  regs: string
  sram: string
  bankSelect: number
  irqHlineEnable: boolean
  irqHlineValue: number
  irqHlineCounter: number
  irqLatch: number
}

export class Mapper {
  protected sram: Uint8Array

  constructor(
    protected options: MapperOptions,
    mapperRamSize?: number,
  ) {
    let ramSize = mapperRamSize || 0
    if (ramSize <= 0 && this.options.cartridge != null) ramSize = options.cartridge!.ramSize()
    if (ramSize > 0) {
      // Battery backup is done only if cartridge has a flag.
      this.sram = new Uint8Array(ramSize)
      this.sram.fill(0xbf)
      this.options.setReadMemory(0x6000, 0x7fff, adr => this.sram[adr & 0x1fff])
      this.options.setWriteMemory(0x6000, 0x7fff, (adr, value) => {
        this.sram[adr & 0x1fff] = value
      })
    }
  }

  public reset(): void {}

  public onHblank(_hcount: number): void {}

  public getSram(): Uint8Array | null {
    return this.sram
  }

  public save(result: MapperSaveData = {} as MapperSaveData): MapperSaveData {
    if (this.sram != null) {
      result.sram = Util.convertUint8ArrayToBase64String(this.sram)
    }
    return result
  }

  public load(saveData: MapperSaveData | null): void {
    if (saveData && saveData.sram != null) {
      const sram = Util.convertBase64StringToUint8Array(saveData.sram)
      this.sram = sram
    }
  }

  public saveSram(): object | null {
    if (this.sram == null) return null
    return {sram: Util.convertUint8ArrayToBase64String(this.sram)}
  }

  public loadSram(saveData: MapperSaveData): void {
    const ram = Util.convertBase64StringToUint8Array(saveData.sram)
    this.sram = ram
  }

  public getExtraChannelWaveTypes(): WaveType[] | null {
    return null
  }

  public getSoundChannel(_ch: number): IChannel {
    throw new Error('Invalid call')
  }
}
