import {Component, Input} from '@angular/core';

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

}
