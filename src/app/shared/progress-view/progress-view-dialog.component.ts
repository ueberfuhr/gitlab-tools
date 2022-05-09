import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProgressStatus} from './progress.service';
import {Observable, Subscription} from 'rxjs';

/**
 * The input for the dialog.
 */
export interface ProgressViewDialogInput {
  status: Observable<ProgressStatus>,
  title?: string,
  mode?: 'determinate' | 'indeterminate'
}

@Component({
  selector: 'app-progress-view-dialog',
  templateUrl: './progress-view-dialog.component.html',
  styleUrls: ['./progress-view-dialog.component.scss']
})
export class ProgressViewDialogComponent implements OnInit, OnDestroy{

  public currentStatus?: ProgressStatus;
  private subscription?: Subscription;

  constructor(private readonly dialogRef: MatDialogRef<ProgressViewDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public readonly data: ProgressViewDialogInput) {
  }

  ngOnInit(): void {
    this.subscription = this.data.status.subscribe(status => {
      this.currentStatus = status;
      if(status.progress>=100) {
        this.dialogRef.close();
      }
    });

  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

}
