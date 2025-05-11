declare const sampleRate: number

import {NoiseSampler} from './util/audio/noise_sampler'

class NoiseChannelProcessor extends AudioWorkletProcessor {
  private sampler: NoiseSampler
  private stopped = false

  constructor() {
    super()

    this.sampler = new NoiseSampler(sampleRate)

    this.port.onmessage = ev => {
      switch (ev.data.action) {
        case 'stop':
          this.stopped = true
          break
        case 'enable':
          this.sampler.setEnable(ev.data.value)
          break
        case 'volume':
          this.sampler.setVolume(ev.data.value)
          break
        case 'period':
          this.sampler.setPeriod(ev.data.period, ev.data.mode)
          break
      }
    }
  }

  public process(
    _inputs: Float32Array[][],
    outputs: Float32Array[][],
    _parameters: Record<string, Float32Array>,
  ): boolean {
    if (this.stopped) return false

    const output = outputs[0]
    const numberOfChannels = output.length

    let first: Float32Array | null = null
    for (let channel = 0; channel < numberOfChannels; ++channel) {
      const ch = output[channel]
      if (first == null) {
        first = ch
        this.sampler.fillBuffer(ch)
      } else {
        ch.set(first)
      }
    }

    return true
  }
}

registerProcessor('noise_worklet', NoiseChannelProcessor)
