import {Component, Input} from '@angular/core';
import {ExchangeLabel, IssueExchangeModel} from '../../models/exchange.model';

@Component({
  selector: 'app-issue-exchange-model-viewer',
  templateUrl: './issue-exchange-model-viewer.component.html',
  styleUrls: ['./issue-exchange-model-viewer.component.scss']
})
export class IssueExchangeModelViewerComponent {

  @Input() model?: IssueExchangeModel

  getLabelsByName(labelNames: string[]): ExchangeLabel[] {
    if(this.model) {
      return this.model.labels.filter(label => labelNames.indexOf(label.name)>=0);
    } else {
      return [];
    }
  }

}
