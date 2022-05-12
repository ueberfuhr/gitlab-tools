import {ProgressDialogHandle} from './progress.service';
import {catchError, finalize, MonoTypeOperatorFunction, ObservableInput, ObservedValueOf, OperatorFunction, throwError} from 'rxjs';

/**
 * Use this RxJS operator to finish the progress when the observable completes.
 * @param handle the progress handle
 */
export function finishProgress<T>(handle: ProgressDialogHandle): MonoTypeOperatorFunction<T> {
  return finalize(() => handle.finish());
}

/**
 * Use this RxJS operator to finish the progress if any error occurs.
 * @param handle the progress handle
 */
export function finishProgressOnError<T, O extends ObservableInput<any>>(handle: ProgressDialogHandle): OperatorFunction<T, T | ObservedValueOf<O>> {
  return catchError(err => {
    handle.finish();
    return throwError(() => err);
  })
}

/**
 * Used to provide a calculation for displaying the progress when finishing a single step.
 * This is necessary because the calling function knows the total count while the called function knows the progress.
 */
export class ProgressHandler {

  private count = 0;

  constructor(private readonly total: number,
              private readonly factor: number,
              private readonly offset: number,
              private readonly handle: ProgressDialogHandle,
              private readonly getLabel: (progress: number, count: number) => string) {
  }

  /**
   * Invoked when a single step is done.
   * @return the corresponding progress (in%)
   */
  done(): void {
    this.count++;
    const progress = 100 * (this.total === 0 ? 1 : this.offset + this.count * this.factor);
    this.handle.submit({
      progress,
      description: this.getLabel(progress, this.count)
    });
  }

}
