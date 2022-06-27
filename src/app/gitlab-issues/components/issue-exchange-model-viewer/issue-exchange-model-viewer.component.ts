import {Component, Input} from '@angular/core';
import {IssueExchangeModel} from '../../models/exchange.model';

@Component({
  selector: 'app-issue-exchange-model-viewer',
  templateUrl: './issue-exchange-model-viewer.component.html',
  styleUrls: ['./issue-exchange-model-viewer.component.scss']
})
export class IssueExchangeModelViewerComponent {

  @Input() model?: IssueExchangeModel

}
