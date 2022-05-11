import {Component, Input} from '@angular/core';
import {GitlabProject} from '../../models/project.model';

@Component({
  selector: 'app-project-open-in-gitlab-button',
  templateUrl: './project-open-in-gitlab-button.component.html',
  styleUrls: ['./project-open-in-gitlab-button.component.scss']
})
export class ProjectOpenInGitlabButtonComponent {

  @Input() project?: GitlabProject;
  @Input() disabled = false;

  open(): void {
    window.open(this.project?.web_url,'_blank');
  }

}
