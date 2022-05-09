import {Injectable} from '@angular/core';
import {GitlabIssuesService} from './gitlab-issues.service';
import {GitlabLabelsService} from './gitlab-labels.service';
import {catchError, defer, forkJoin, map, mergeMap, Observable, of, tap, throwError, toArray} from 'rxjs';
import {ExchangeIssue, ExchangeLabel, IssueExchangeModel} from '../models/exchange.model';
import {GitlabIssue} from '../models/gitlab-issue.model';
import {GitlabLabel} from '../models/gitlab-label.model';
import {ProgressService} from '../../shared/progress-view/progress.service';

@Injectable({
  providedIn: 'root'
})
export class IssueExportService {

  constructor(private readonly issues: GitlabIssuesService,
              private readonly labels: GitlabLabelsService,
              private readonly progressService: ProgressService) {
  }

  private static reduceIssue(issue: GitlabIssue): ExchangeIssue {
    return {
      iid: issue.iid,
      title: issue.title,
      description: issue.description,
      state: issue.state,
      labels: issue.labels,
      issue_type: issue.issue_type
    }
  }

  private static reduceLabel(label: GitlabLabel): ExchangeLabel {
    return {
      name: label.name,
      description: label.description,
      color: label.color,
      is_project_label: label.is_project_label
    }
  }

  /**
   * Creates the export model and provides it via an observable.
   * @param projectId the id of the project
   */
  export(projectId: number): Observable<IssueExchangeModel> {
    // only invoke when subscription
    const handle$ = defer(() => of(this.progressService.start({
      title: 'Exporting...',
      mode: 'indeterminate'
    })).pipe(tap(handle => handle.submit({progress: 0, description: 'Exporting issues and labels'}))));
    const issues$ = this.issues.getIssues(projectId)
      .pipe(
        map(set => set.payload),
        toArray()
      );
    const labels$ = this.labels.getLabelsForProject(projectId)
      .pipe(
        map(set => set.payload),
        toArray()
      );
    return handle$
      .pipe(
        mergeMap(handle => forkJoin([issues$, labels$, of(handle)])
          .pipe(catchError(err => {
            handle.finish();
            return throwError(() => err);
          }))),
        // create IssueExport
        map(([issuesValue, labelsValue, handle]) => {
          const issues = issuesValue
            .map(IssueExportService.reduceIssue)
            .sort((a, b) => a.iid - b.iid);
          // delete labels not in issues
          const usedLabels = new Set(issues.map(i => i.labels).reduce((a, value) => a.concat(value), []));
          const labels = labelsValue
            .map(IssueExportService.reduceLabel)
            .filter(label => usedLabels.has(label.name));
          handle.finish();
          return {issues, labels} as IssueExchangeModel;
        })
      );
  }

}
