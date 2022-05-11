import {Component} from '@angular/core';
import {GitlabProject} from '../../../gitlab-projects/models/project.model';
import {IssueExchangeModel} from '../../models/exchange.model';
import {IssueExportService} from '../../services/issue-export.service';
import {ProgressService} from '../../../shared/progress-view/progress.service';
import {IssueImportService} from '../../services/issue-import.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DynamicDownloadService} from '../../../shared/services/dynamic-download.service';

@Component({
  selector: 'app-issue-exchange-card',
  templateUrl: './issue-exchange-card.component.html',
  styleUrls: ['./issue-exchange-card.component.scss']
})
export class IssueExchangeCardComponent {

  source?: GitlabProject;
  target?: GitlabProject;
  data?: IssueExchangeModel;

  constructor(private readonly issueExportService: IssueExportService,
              private readonly progressService: ProgressService,
              private readonly importService: IssueImportService,
              private readonly snackBar: MatSnackBar,
              private readonly downloadService: DynamicDownloadService) {
  }

  importDataFromProject(): void {
    if (this.source) {
      this.issueExportService.export(this.source?.id).subscribe(result => this.data = result);
    }
  }

  importDataFromFile(file: File): void {
    // HTML5 FileReader API
    const handle = this.progressService.start({
      title: 'Reading file...',
      mode: 'indeterminate'
    });
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.data = JSON.parse(e.target?.result as string);
      handle.finish();
    };
    reader.onerror = handle.finish;
    reader.readAsText(file);
  }

  get importAvailable():boolean {
    return this.target !== undefined && this.data !== undefined && this.data.issues.length>0;
  }

  loadDataIntoTarget(obtainOrderOnImport = true): void {
    if (this.importAvailable) {
      this.importService
        .import(this.target!, this.data!, obtainOrderOnImport)
        .subscribe(result => this.snackBar.open(`Successfully imported ${result.issues.length} issue(s) and ${result.labels.length} label(s)`));
    }
  }

  downloadExportedIssues(): void {
    if (this.source) {
      this.issueExportService.export(this.source.id)
        .subscribe(data => {
          // start download
          this.downloadService.download({
            fileName: 'issues.json',
            contentType: 'text/json',
            content: JSON.stringify(data, undefined, 2)
          })
        });
    }
  }

  onSourceSelected($event: GitlabProject) {
    this.source = $event;
  }
  onTargetSelected($event: GitlabProject) {
    this.target = $event;
  }

}
