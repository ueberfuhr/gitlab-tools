import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ExchangeIssue, ExchangeLabel, IssueExchangeModel} from '../../models/exchange.model';
import {moveElementDownInArray, moveElementToBottomOfArray, moveElementToTopOfArray, moveElementUpInArray} from '../../../shared/misc/array-operations';

@Component({
  selector: 'app-issue-exchange-model-viewer',
  templateUrl: './issue-exchange-model-viewer.component.html',
  styleUrls: ['./issue-exchange-model-viewer.component.scss']
})
export class IssueExchangeModelViewerComponent implements OnChanges {

  @Input() model?: IssueExchangeModel;
  items?: ListItem[];
  @Output() readonly change = new EventEmitter<IssueExchangeModel>();
  selectionState: 'none' | 'partial' | 'all' = 'none';
  selectedLabelNames: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model']) {
      const model = (changes['model'].currentValue as IssueExchangeModel);
      this.items = model.issues
        .map(issue => ({issue, selected: true}) as ListItem);
      this.selectionState = 'all';
      this.updateSelectedLabelNames();
    }
  }

  private get selectedIssues(): ExchangeIssue[] {
    return this.items?.filter(item => item.selected).map(item => item.issue) || [];
  }

  isLabelInSelectedIssue(label: ExchangeLabel): boolean {
    return this.selectedLabelNames.includes(label.name);
  }

  private updateSelectedLabelNames(): void {
    const labelNamesOfIssues = this.selectedIssues.map(issue => issue.labels);
    this.selectedLabelNames = ([] as string[]).concat
      .apply<string[], string[][], string[]>([], labelNamesOfIssues);
  }

  private updateSelectionState(): void {
    if (this.items && this.items.length > 0) {
      if (this.items.every(item => item.selected)) {
        this.selectionState = 'all';
      } else if (this.items?.every(item => !item.selected)) {
        this.selectionState = 'none';
      } else {
        this.selectionState = 'partial';
      }
    } else {
      this.selectionState = 'none';
    }
  }

  private submitChanges(): void {
    if (this.items) {
      this.change.emit({
        labels: this.model?.labels || [],
        issues: this.selectedIssues
      });
    }
  }

  selectAll(checked: boolean): void {
    this.items?.forEach(item => item.selected = checked);
    this.selectionState = checked ? 'all' : 'none';
    this.updateSelectedLabelNames();
    this.submitChanges();
  }

  select(checked: boolean, item: ListItem): void {
    if (item.selected != checked) {
      item.selected = checked;
      this.updateSelectionState();
      this.updateSelectedLabelNames();
      this.submitChanges();
    }
  }

  swap(item: ListItem, direction: 'top' | 'previous' | 'next' | 'bottom'): void {
    if (this.items) {
      switch (direction) {
        case 'top':
          moveElementToTopOfArray(this.items, item);
          break;
        case 'previous':
          moveElementUpInArray(this.items, item);
          break;
        case 'next':
          moveElementDownInArray(this.items, item);
          break;
        case 'bottom':
          moveElementToBottomOfArray(this.items, item);
          break;
      }
      this.submitChanges();
    }
  }

}

interface ListItem {
  issue: ExchangeIssue;
  selected: boolean;
}

