import {Component, Inject} from '@angular/core';
import {GitlabIssuesStatistics} from '../../models/gitlab-issue.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IssueImportOptions} from '../../services/issue-import.service';

@Component({
  selector: 'app-issue-import-options-dialog',
  templateUrl: './issue-import-options-dialog.component.html',
  styleUrls: ['./issue-import-options-dialog.component.scss']
})
export class IssueImportOptionsDialogComponent {

  readonly options: IssueImportOptions = {
    deleteOpenIssues: false,
    deleteClosedIssues: false,
    deleteUnusedLabels: false
  }

  constructor(private readonly dialogRef: MatDialogRef<IssueImportOptionsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public readonly data: GitlabIssuesStatistics) {
  }

  close() {
    this.dialogRef.close();
  }

  ok() {
    this.dialogRef.close(this.options);
  }

}
