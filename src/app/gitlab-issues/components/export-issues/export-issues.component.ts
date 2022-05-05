import {Component} from '@angular/core';
import {GitlabProject} from '../../../gitlab-projects/models/project.model';
import {DynamicDownloadService} from '../../../shared/services/dynamic-download.service';
import {IssueExportService} from '../../services/issue-export.service';

@Component({
  selector: 'app-export-issues',
  templateUrl: './export-issues.component.html',
  styleUrls: ['./export-issues.component.scss']
})
export class ExportIssuesComponent {

  project?: GitlabProject;

  constructor(private readonly exportService: IssueExportService,
              private readonly downloadService: DynamicDownloadService) {
  }

  onProjectSelected(project: GitlabProject) {
    this.project = project;
  }

  downloadExportedIssues(): void {
    if (this.project) {
      this.exportService.export(this.project.id)
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

}
