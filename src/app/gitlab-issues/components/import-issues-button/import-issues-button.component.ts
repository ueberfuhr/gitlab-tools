import {Component, Input} from '@angular/core';
import {GitlabProject} from '../../../gitlab-projects/models/project.model';
import {IssueExchangeModel} from '../../models/exchange.model';
import {IssueImportService} from '../../services/issue-import.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-import-issues-button',
  templateUrl: './import-issues-button.component.html',
  styleUrls: ['./import-issues-button.component.scss']
})
export class ImportIssuesButtonComponent {

  @Input() project?: GitlabProject;
  @Input() data?: IssueExchangeModel;

  constructor(private readonly importService: IssueImportService,
              private readonly snackBar: MatSnackBar) {
  }

  importIssues(): void {
    if (this.project && this.data) {
      this.importService
        .import(this.project, this.data)
        .subscribe(result => this.snackBar.open(`Successfully imported ${result.issues.length} issue(s) and ${result.labels.length} label(s)`));
    }
  }


}
