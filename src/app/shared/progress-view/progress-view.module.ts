import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressViewDialogComponent } from './progress-view-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    ProgressViewDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ]
})
export class ProgressViewModule { }
