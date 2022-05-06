import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface GitlabAccessTokenDialogInput {
  token?: string,
  message?: string
}

@Component({
  selector: 'app-gitlab-access-token-dialog',
  templateUrl: './gitlab-access-token-dialog.component.html',
  styleUrls: ['./gitlab-access-token-dialog.component.scss']
})
export class GitlabAccessTokenDialogComponent {

  hidePassword = true;

  constructor(private readonly dialogRef: MatDialogRef<GitlabAccessTokenDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public readonly data: GitlabAccessTokenDialogInput) {
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.data.token);
  }
}
