import {Injectable} from '@angular/core';
import {GitlabIssuesService} from './gitlab-issues.service';
import {GitlabLabelsService} from './gitlab-labels.service';
import {forkJoin, map, mergeMap, Observable, of, toArray} from 'rxjs';
import {ExchangeIssue, ExchangeLabel, IssueExchangeModel} from '../models/exchange.model';
import {ProgressService} from '../../shared/progress-view/progress.service';
import {IssueExportModelMapperService} from './issue-export-model-mapper.service';
import {finishProgress, finishProgressOnError} from '../../shared/progress-view/progress.utilities';

@Injectable({
  providedIn: 'root'
})
export class IssueExportService {

  constructor(private readonly issues: GitlabIssuesService,
              private readonly labels: GitlabLabelsService,
              private readonly mapper: IssueExportModelMapperService,
              private readonly progressService: ProgressService) {
  }

  private getIssues(project: IssueSource): Observable<ExchangeIssue[]> {
    if (typeof project === 'number') {
      return this.issues.getIssues(project)
        .pipe(
          map(set => set.payload),
          toArray(),
          map(issues => issues
            .sort((a, b) => a.iid && b.iid ? a.iid - b.iid : 1)
            .map(i => this.mapper.mapIssue(i))
          )
        );
    } else {
      return of((project as IssueExchangeModel).issues);
    }
  }

  private getLabels(project: IssueSource): Observable<ExchangeLabel[]> {
    if (typeof project === 'number') {
      return this.labels.getLabelsForProject(project)
        .pipe(
          map(set => set.payload),
          map(this.mapper.mapLabel),
          toArray()
        );
    } else {
      return of((project as IssueExchangeModel).labels);
    }
  }

  /**
   * Creates the export model and provides it via an observable.
   * @param project the id of the project or the ExchangeIssueModel
   */
  export(project: IssueSource): Observable<IssueExchangeModel> {
    return this.progressService.startAsObservable({
      title: 'Exporting...',
      mode: 'indeterminate',
      initialProgress: {progress: 0, description: 'Exporting issues and labels'}
    })
      .pipe(
        mergeMap(handle => this.exportWithProgressDialog(project)
          .pipe(
            finishProgressOnError(handle),
            finishProgress(handle)
          ))
      );
  }

  private onlyLabelsUsedInIssues(labels: ExchangeLabel[], issues: ExchangeIssue[]): ExchangeLabel[] {
    const usedLabels = new Set(
      issues
        .map(i => i.labels)
        .reduce((a, value) => a.concat(value), [])
    );
    return labels
      .filter(label => usedLabels.has(label.name));

  }

  private exportWithProgressDialog(project: IssueSource): Observable<IssueExchangeModel> {
    return forkJoin([this.getIssues(project), this.getLabels(project)])
      .pipe(
        map(([issues, allLabels]) => {
          const labels = this.onlyLabelsUsedInIssues(allLabels, issues);
          return {issues, labels} as IssueExchangeModel;
        })
      )
  }

}

type IssueSource = number | IssueExchangeModel;
