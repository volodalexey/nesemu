import * as Pubsub from '../util/pubsub'
import {Wnd} from '../wnd/wnd'

export const enum AppEventType {
  UPDATE = 1,
  RENDER,
  RUN,
  PAUSE,
  STEP,
  RESET,
  BREAK_POINT,
  START_CALC,
  END_CALC,
  PAUSE_APP,
  RESUME_APP,
  CLOSE_WND,
  ENABLE_AUDIO_CHANNEL,
  DISABLE_AUDIO_CHANNEL,
}

export class AppStream extends Pubsub.Subject<AppEventType> {
  public triggerUpdate(elapsed: number): void {
    this.next(AppEventType.UPDATE, elapsed)
  }
  public triggerRender(): void {
    this.next(AppEventType.RENDER)
  }
  public triggerRun(): void {
    this.next(AppEventType.RUN)
  }
  public triggerPause(): void {
    this.next(AppEventType.PAUSE)
  }
  public triggerStep(): void {
    this.next(AppEventType.STEP)
  }
  public triggerReset(): void {
    this.next(AppEventType.RESET)
  }
  public triggerBreakPoint(): void {
    this.next(AppEventType.BREAK_POINT)
  }

  public triggerStartCalc(): void {
    this.next(AppEventType.START_CALC)
  }
  public triggerEndCalc(): void {
    this.next(AppEventType.END_CALC)
  }
  public triggerPauseApp(): void {
    this.next(AppEventType.PAUSE_APP)
  }
  public triggerResumeApp(): void {
    this.next(AppEventType.RESUME_APP)
  }
  public triggerCloseWnd(wnd: Wnd): void {
    this.next(AppEventType.CLOSE_WND, wnd)
  }
  public triggerEnableAudioChannel(ch: number, enable: boolean): void {
    this.next(enable ? AppEventType.ENABLE_AUDIO_CHANNEL : AppEventType.DISABLE_AUDIO_CHANNEL, ch)
  }
}
