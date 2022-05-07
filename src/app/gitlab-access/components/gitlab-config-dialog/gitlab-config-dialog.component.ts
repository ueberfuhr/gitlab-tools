import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GitlabConfigDialogInput, GitlabConfigDialogResult} from '../../models/gitlab-config-dialog-models';

@Component({
  templateUrl: './gitlab-config-dialog.component.html',
  styleUrls: ['./gitlab-config-dialog.component.scss']
})
export class GitlabConfigDialogComponent {

  hidePassword = true;
  lastCheckSuccessful = true;
  readonly config = Object.assign({}, this.data.config);

  constructor(private readonly dialogRef: MatDialogRef<GitlabConfigDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public readonly data: GitlabConfigDialogInput) {
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close({
      config: this.config,
      successful: true
    } as GitlabConfigDialogResult);
  }

  checkValidity() {
    if (this.data.connectionTester) {
      this.data.connectionTester.testConnection(this.config).subscribe(success => {
        this.lastCheckSuccessful = success;
      });
    }
  }
}
