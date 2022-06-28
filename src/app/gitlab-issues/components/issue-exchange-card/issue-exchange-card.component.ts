import {Component, Inject, OnInit} from '@angular/core';
import {GitlabProject} from '../../../gitlab-projects/models/project.model';
import {IssueExchangeModel} from '../../models/exchange.model';
import {IssueExportService} from '../../services/issue-export.service';
import {ProgressService} from '../../../shared/progress-view/progress.service';
import {IssueImportOptions, IssueImportService} from '../../services/issue-import.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DynamicDownloadService} from '../../../shared/services/dynamic-download.service';
import {Environment, ENVIRONMENT} from '../../../../environments/environment.model';
import {GitlabIssuesService} from '../../services/gitlab-issues.service';
import {GitlabLabelsService} from '../../services/gitlab-labels.service';
import {GitlabIssuesStatistics} from '../../models/gitlab-issue.model';
import {MatDialog} from '@angular/material/dialog';
import {IssueImportOptionsDialogComponent} from '../issue-import-options-dialog/issue-import-options-dialog.component';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-issue-exchange-card',
  templateUrl: './issue-exchange-card.component.html',
  styleUrls: ['./issue-exchange-card.component.scss']
})
export class IssueExchangeCardComponent implements OnInit {

  source?: GitlabProject;
  target?: GitlabProject;
  _data?: IssueExchangeModel;
  data2Transfer?: IssueExchangeModel;
  targetIssueStatistics: GitlabIssuesStatistics = {opened: 0, closed: 0};

  constructor(private readonly issueExportService: IssueExportService,
              private readonly issueService: GitlabIssuesService,
              private readonly labelService: GitlabLabelsService,
              private readonly progressService: ProgressService,
              private readonly importService: IssueImportService,
              private readonly snackBar: MatSnackBar,
              private readonly downloadService: DynamicDownloadService,
              @Inject(ENVIRONMENT) private readonly environment: Environment,
              private readonly dialog: MatDialog) {
  }

  ngOnInit(): void {
    if (!this.environment.production) {
      this.data = SAMPLE_ISSUES;
    }
  }

  get data(): IssueExchangeModel | undefined {
    return this._data;
  }

  set data(data: IssueExchangeModel | undefined) {
    this._data = data;
    this.data2Transfer = data;
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

  get data2TransferAvailable(): boolean {
    return this.data2Transfer !== undefined && this.data2Transfer.issues.length > 0;
  }

  get data2ImportToTargetAvailable(): boolean {
    return this.data2TransferAvailable && this.target !== undefined;
  }

  get targetIsClean(): boolean {
    return this.targetIssueStatistics.opened < 1 && this.targetIssueStatistics.closed < 1
  }

  private retrieveImportOptions(): Observable<IssueImportOptions | undefined> {
    return this.targetIsClean ? of({
      deleteClosedIssues: false,
      deleteOpenIssues: false,
      deleteUnusedLabels: false
    }) : this.dialog.open<IssueImportOptionsDialogComponent, GitlabIssuesStatistics, IssueImportOptions>(IssueImportOptionsDialogComponent, {
      data: this.targetIssueStatistics,
      autoFocus: true,
      disableClose: false,
      minWidth: '20em',
      minHeight: '15em'
    }).afterClosed();
  }

  importDataIntoTarget(obtainOrderOnImport = true): void {
    if (this.data2ImportToTargetAvailable) {
      this.retrieveImportOptions().subscribe(result => {
        if (result) {
          this.importService
            .import(this.target!, this.data2Transfer!, result, obtainOrderOnImport)
            .subscribe(result => {
              this.updateIssuesStatistics(this.target!.id)
              this.snackBar.open(`Successfully imported ${result.issues.length} issue(s) and ${result.labels.length} label(s)`);
            });
        }
      });
    }
  }

  exportAndDownload(): void {
    if (this.data2Transfer) {
      this.issueExportService.export(this.data2Transfer)
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

  private updateIssuesStatistics(projectId: number): void {
    this.issueService.getIssuesStatistics(projectId)
      .subscribe(stat => this.targetIssueStatistics = stat);
  }

  onTargetSelected($event: GitlabProject) {
    this.target = $event;
    this.updateIssuesStatistics(this.target.id);
  }

  setData2Transfer($event: IssueExchangeModel) {
    this.data2Transfer = $event;
  }
}

const SAMPLE_ISSUES: IssueExchangeModel = {
  labels: [
    {
      color: '#256859',
      name: 'test',
      is_project_label: true
    },
    {
      color: '#a4b489',
      name: 'test2',
      is_project_label: false
    }
  ],
  issues: [
    {
      title: 'This is issue #1',
      labels: ['test', 'test2'],
      description: '',
      state: 'opened',
      issue_type: 'issue'
    },
    {
      title: 'This is issue #2',
      labels: ['test'],
      description: '',
      state: 'opened',
      issue_type: 'issue'
    },
    {
      title: 'This is issue #3',
      labels: ['test2'],
      description: '',
      state: 'opened',
      issue_type: 'issue'
    },
    {
      title: 'This is issue #4',
      labels: [],
      description: '',
      state: 'opened',
      issue_type: 'issue'
    },
    {
      title: 'This is issue #5',
      labels: ['test2'],
      description: '',
      state: 'opened',
      issue_type: 'issue'
    },
    {
      title: 'This is issue #6',
      labels: ['test', 'test2'],
      description: '',
      state: 'opened',
      issue_type: 'issue'
    },
    {
      title: 'This is issue #7',
      labels: ['test'],
      description: '',
      state: 'opened',
      issue_type: 'issue'
    },
  ]
}
