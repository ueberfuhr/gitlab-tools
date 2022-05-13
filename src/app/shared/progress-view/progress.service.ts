import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ProgressViewDialogComponent, ProgressViewDialogInput} from './progress-view-dialog.component';
import {BehaviorSubject, defer, of, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  constructor(private readonly dialog: MatDialog) {
  }

  start(options?: {
    title?: string,
    mode?: 'determinate' | 'indeterminate'
  }): ProgressDialogHandle {
    // defer opening the status dialog in case of quick operations
    const deferMS = 500;
    let lastSubmittedStatus: ProgressStatus;
    const subject = new BehaviorSubject<ProgressStatus>({
      progress: 0
    });
    const status$ = subject.asObservable();
    const subscription = status$.subscribe(status => {
      lastSubmittedStatus = status;
    })
    setTimeout(() => {
      if (!lastSubmittedStatus || lastSubmittedStatus.progress < 100) {
        this.dialog.open<ProgressViewDialogComponent, ProgressViewDialogInput, void>(ProgressViewDialogComponent, {
          data: {
            status: status$,
            title: options?.title,
            mode: options?.mode
          },
          disableClose: true
        });
      }
      subscription.unsubscribe();
    }, deferMS);
    return {
      submit: status => {
        subject.next(status);
      },
      finish: () => subject.next(QUIT_STATUS)
    }
  }

  startAsObservable(options?: {
    title?: string,
    mode?: 'determinate' | 'indeterminate'
    initialProgress?: ProgressStatus
  }) {
    return defer(() => of(this.start({
        title: options?.title,
        mode: options?.mode
      })).pipe(
        tap(handle => {
          if (options?.initialProgress) {
            handle.submit(options.initialProgress)
          }
        }))
    );
  }

}

/**
 * A single progress status.
 */
export interface ProgressStatus {
  /**
   * A value between 0 and 100. When reaching 100, the dialog is closed.
   * @see QUIT_STATUS
   */
  progress: number,
  description?: string
}

/**
 * You can send this status to indicate that the progress is finished.
 */
export const QUIT_STATUS: ProgressStatus = {progress: 100};

/**
 * A handle for the dialog.
 */
export interface ProgressDialogHandle {
  /**
   * Submit a new status to the dialog.
   * @param status the status
   */
  submit(status: ProgressStatus): void;

  /**
   * Submit the final status.
   */
  finish(): void;
}
