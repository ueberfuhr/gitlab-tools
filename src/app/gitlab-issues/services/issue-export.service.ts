import {Injectable} from '@angular/core';
import {GitlabIssuesService} from './gitlab-issues.service';
import {GitlabLabelsService} from './gitlab-labels.service';
import {forkJoin, map, mergeMap, Observable, tap, toArray} from 'rxjs';
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

  private getIssues(projectId: number): Observable<ExchangeIssue[]> {
    return this.issues.getIssues(projectId)
      .pipe(
        map(set => set.payload),
        map(this.mapper.mapIssue),
        toArray(),
        tap(issues => {
          issues.sort((a, b) => a.iid - b.iid);
        })
      );
  }

  private getLabels(projectId: number): Observable<ExchangeLabel[]> {
    return this.labels.getLabelsForProject(projectId)
      .pipe(
        map(set => set.payload),
        map(this.mapper.mapLabel),
        toArray()
      );
  }

  /**
   * Creates the export model and provides it via an observable.
   * @param projectId the id of the project
   */
  export(projectId: number): Observable<IssueExchangeModel> {
    return this.progressService.startAsObservable({
      title: 'Exporting...',
      mode: 'indeterminate',
      initialProgress: {progress: 0, description: 'Exporting issues and labels'}
    })
      .pipe(
        mergeMap(handle => this.exportWithProgressDialog(projectId)
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

  private exportWithProgressDialog(projectId: number): Observable<IssueExchangeModel> {
    return forkJoin([this.getIssues(projectId), this.getLabels(projectId)])
      .pipe(
        map(([issues, allLabels]) => {
          const labels = this.onlyLabelsUsedInIssues(allLabels, issues);
          return {issues, labels} as IssueExchangeModel;
        })
      )
  }

}
