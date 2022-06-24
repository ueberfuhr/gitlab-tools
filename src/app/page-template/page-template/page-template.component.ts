import {Component, Inject, Input} from '@angular/core';
import {Router} from '@angular/router';
import {NAVIGATION_ENTRIES, NavigationEntry} from '../../routing/navigation.model';

@Component({
  selector: 'app-page-template',
  templateUrl: './page-template.component.html',
  styleUrls: ['./page-template.component.scss']
})
export class PageTemplateComponent {

  @Input() title = '';

  constructor(public readonly router: Router,
              @Inject(NAVIGATION_ENTRIES) public readonly navigation: NavigationEntry[]) {
  }

}
