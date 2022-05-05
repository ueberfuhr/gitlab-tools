import {Injectable} from '@angular/core';
import {GitlabIssuesService} from './gitlab-issues.service';
import {GitlabLabelsService} from './gitlab-labels.service';
import {forkJoin, map, Observable, toArray} from 'rxjs';
import {ExchangeIssue, ExchangeLabel, IssueExchangeModel} from '../models/exchange.model';
import {GitlabIssue} from '../models/gitlab-issue.model';
import {GitlabLabel} from '../models/gitlab-label.model';

@Injectable({
  providedIn: 'root'
})
export class IssueExportService {

  constructor(private readonly issues: GitlabIssuesService,
              private readonly labels: GitlabLabelsService) {
  }

  private static reduceIssue(issue: GitlabIssue): ExchangeIssue {
    return {
      iid: issue.iid,
      title: issue.title,
      description: issue.description,
      state: issue.state,
      labels: issue.labels
    }
  }

  private static reduceLabel(label: GitlabLabel): ExchangeLabel {
    return {
      name: label.name,
      description: label.description,
      color: label.color,
      text_color: label.text_color,
      is_project_label: label.is_project_label
    }
  }

  /**
   * Creates the export model and provides it via an observable.
   * @param projectId the id of the project
   */
  export(projectId: number): Observable<IssueExchangeModel> {
    const issues$ = this.issues.getIssuesForProject(projectId)
      .pipe(
        map(set => set.payload),
        toArray()
      );
    const labels$ = this.labels.getLabelsForProject(projectId)
      .pipe(
        map(set => set.payload),
        toArray()
      );
    return forkJoin([issues$, labels$])
      .pipe(
        // create IssueExport
        map(([issues, labels]) => ({
          issues: issues.map(IssueExportService.reduceIssue).sort((a, b) => a.iid - b.iid),
          labels: labels.map(IssueExportService.reduceLabel)
        } as IssueExchangeModel)),
        // delete labels not in issues
        map(data => {
          const usedLabels = new Set(data.issues.map(i => i.labels).reduce((a, value) => a.concat(value), []));
          data.labels = data.labels.filter(label => usedLabels.has(label.name));
          return data;
        })
      )
  }

}
