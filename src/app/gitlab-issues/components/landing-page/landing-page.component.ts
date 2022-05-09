import {Component} from '@angular/core';
import {GitlabProject} from '../../../gitlab-projects/models/project.model';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

  project?: GitlabProject;

  onProjectSelected($event: GitlabProject) {
    this.project = $event;
  }
}
