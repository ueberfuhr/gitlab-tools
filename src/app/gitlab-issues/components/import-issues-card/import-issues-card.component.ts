import {Component, Input} from '@angular/core';
import {GitlabProject} from '../../../gitlab-projects/models/project.model';
import {IssueExchangeModel} from '../../models/exchange.model';
import {IssueExportService} from '../../services/issue-export.service';
import {ProgressService} from '../../../shared/progress-view/progress.service';

@Component({
  selector: 'app-import-issues-card',
  templateUrl: './import-issues-card.component.html',
  styleUrls: ['./import-issues-card.component.scss']
})
export class ImportIssuesCardComponent {

  @Input() project?: GitlabProject;
  data?: IssueExchangeModel;

  constructor(private readonly issueExportService: IssueExportService,
              private readonly progressService: ProgressService) {
  }

  importDataFromProject(): void {
    if (this.project) {
      this.issueExportService.export(this.project?.id).subscribe(result => this.data = result);
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

}
