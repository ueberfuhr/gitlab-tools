import {Component, Input} from '@angular/core';
import {GitlabProject} from '../../../gitlab-projects/models/project.model';
import {DynamicDownloadService} from '../../../shared/services/dynamic-download.service';
import {IssueExportService} from '../../services/issue-export.service';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-export-issues-button',
  templateUrl: './export-issues-button.component.html',
  styleUrls: ['./export-issues-button.component.scss']
})
export class ExportIssuesButtonComponent {

  @Input() project?: GitlabProject;
  @Input() color?: ThemePalette;

  constructor(private readonly exportService: IssueExportService,
              private readonly downloadService: DynamicDownloadService) {
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
