import {Component, Input} from '@angular/core';
import {GitlabLabel} from '../../models/gitlab-label.model';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent {

  @Input() model?: GitlabLabel;
  @Input() displayProjectOrGroupBadge = false;

}
