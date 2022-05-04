import {Component, Inject, Input} from '@angular/core';
import {GITLAB_CONFIG, GitlabConfig} from '../../../environments/gitlab-config.model';

/**
 * An entry that is made into the navigation.
 */
export interface NavigationEntry {

  /**
   * The label of the navigation entry.
   */
  label: string,
  /**
   * The router link.
   */
  routerLink: string,
  /**
   * The material icon, if any should be shown.
   */
  icon?: string

}

@Component({
  selector: 'app-page-template',
  templateUrl: './page-template.component.html',
  styleUrls: ['./page-template.component.scss']
})
export class PageTemplateComponent {

  @Input() title = '';
  @Input() navigation: NavigationEntry[] = [];

  constructor(@Inject(GITLAB_CONFIG) public readonly config: GitlabConfig) {
  }

}
