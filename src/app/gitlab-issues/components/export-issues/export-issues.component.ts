import {Component} from '@angular/core';
import {GitlabProject} from '../../../gitlab-projects/models/project.model';

@Component({
  selector: 'app-export-issues',
  templateUrl: './export-issues.component.html',
  styleUrls: ['./export-issues.component.scss']
})
export class ExportIssuesComponent {

  project?: GitlabProject;

  onProjectSelected(project: GitlabProject) {
    this.project = project;
  }

  openProjectInGitlab(): void {
    window.open(this.project?.web_url,'_blank');
  }

}
