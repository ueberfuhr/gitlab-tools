import {Injectable} from '@angular/core';
import {GitlabIssuesService} from './gitlab-issues.service';
import {GitlabLabelsService} from './gitlab-labels.service';
import {GitlabProject} from '../../gitlab-projects/models/project.model';
import {ExchangeIssue, ExchangeLabel, IssueExchangeModel} from '../models/exchange.model';
import {GitlabProjectsService} from '../../gitlab-projects/services/gitlab-projects.service';
import {catchError, combineLatest, defer, map, mergeMap, Observable, of, take, tap, throwError, toArray} from 'rxjs';
import {GitlabLabel} from '../models/gitlab-label.model';
import {GitlabIssue} from '../models/gitlab-issue.model';
import {ProgressDialogHandle, ProgressService} from '../../shared/progress-view/progress.service';

/**
 * The result of the import.
 */
export interface ImportResult {
  /**
   * An array of imported labels. If a label with the given name already existed, it was not imported.
   */
  labels: GitlabLabel[],
  /**
   * An array of imported issues.
   */
  issues: GitlabIssue[]
}

interface ProgressCalculator {
  done(): number;

  countOfDone(): number;
}

class ProgressCalculatorImpl implements ProgressCalculator {

  private count = 0;

  constructor(private readonly total: number,
              private readonly factor: number,
              private readonly offset: number) {
  }

  countOfDone(): number {
    return this.count;
  }

  done(): number {
    this.count++;
    return this.offset + 100 * this.count * this.factor / this.total;
  }

}

@Injectable({
  providedIn: 'root'
})
export class IssueImportService {

  constructor(private readonly issuesService: GitlabIssuesService,
              private readonly projectsService: GitlabProjectsService,
              private readonly labelsService: GitlabLabelsService,
              private readonly progressService: ProgressService) {
  }

  private importLabels(project: GitlabProject, labels: ExchangeLabel[], progress: {
    handle: ProgressDialogHandle,
    createProgressCalculator(total: number): ProgressCalculator
  }): Observable<GitlabLabel[]> {
    return this.labelsService.getLabelsForProject(project.id)
      .pipe(
        // GitlabLabel
        map(set => set.payload.name),
        // GitlabLabel-Name
        toArray(),
        // GitlabLabel-Name[]
        // import labels that do not yet exist
        map(labelNames => labels.filter(label => labelNames.indexOf(label.name) < 0)),
        // ExchangeLabel[]
        map(labelsToImport => {
          const progressCalculator = progress.createProgressCalculator(labelsToImport.length);
          return labelsToImport.map(label => this.labelsService.create(project, {
              name: label.name,
              description: label.description,
              color: label.color,
              is_project_label: label.is_project_label,
            })
              .pipe(
                tap(() => progress.handle
                  .submit({
                    progress: progressCalculator.done(),
                    description: `Imported ${progressCalculator.countOfDone() + 1} of ${labelsToImport.length} label(s)`
                  }))
              )
          );
        }),
        // Observable<GitlabLabel>[]  (imported)
        // if empty, combineLatest would not bring any further results
        mergeMap(labelImports => labelImports.length > 1 ? combineLatest(labelImports) : of([])),
        // GitlabLabel[] (imported)
      );
  }

  private importIssues(project: GitlabProject, issues: ExchangeIssue[], progress: {
    handle: ProgressDialogHandle,
    createProgressCalculator(total: number): ProgressCalculator
  }): Observable<GitlabIssue[]> {
    issues.sort((a, b) => a.iid - b.iid);
    return of(issues)
      .pipe(
        // ExchangeIssue[]
        map(issuesToImport => {
          const progressCalculator = progress.createProgressCalculator(issuesToImport.length);
          return issuesToImport.map(issue => this.issuesService.create(project.id, {
              iid: issue.iid,
              title: issue.title,
              issue_type: issue.issue_type,
              labels: issue.labels,
              description: issue.description,
              state: issue.state
            })
              .pipe(
                tap(() => progress.handle
                  .submit({
                    progress: progressCalculator.done(),
                    description: `Imported ${progressCalculator.countOfDone()} of ${issuesToImport.length} issue(s)`
                  }))
              )
          )
        }),
        // Observable<GitlabIssue>[]  (imported)
        mergeMap(issueImports => issueImports.length > 1 ? combineLatest(issueImports) : of([]))
        // GitlabIssue[] (imported)
      );
  }

  import(project: GitlabProject, data: IssueExchangeModel): Observable<ImportResult> {
    const total = data.labels.length + data.issues.length;
    if (total === 0) {
      return of({
        issues: [],
        labels: [],
      })
    } else {
      const calculateProgressForLabels = (totalLabels: number) => new ProgressCalculatorImpl(totalLabels, data.labels.length / total, 0);
      const progressAfterLabels = 100 * data.labels.length / total;
      const calculateProgressForIssues = (totalIssues: number) => new ProgressCalculatorImpl(totalIssues, data.issues.length / total, progressAfterLabels);
      // we need to execute them in order
      return defer(() => of(this.progressService.start({
        title: 'Importing...',
        mode: 'determinate'
      })))
        .pipe(
          tap(handle => handle.submit({progress: 0, description: 'Importing Labels...'})),
          mergeMap(handle => this
            .importLabels(project, data.labels, {handle, createProgressCalculator: calculateProgressForLabels})
            .pipe(
              map(labels => ({labels, handle})),
              catchError(err => {
                handle.finish();
                return throwError(() => err);
              })
            )
          ),
          tap(labelsWithHandle => labelsWithHandle.handle.submit({progress: progressAfterLabels, description: 'Importing Issues...'})),
          mergeMap(labelsWithHandle => this
            .importIssues(project, data.issues, {handle: labelsWithHandle.handle, createProgressCalculator: calculateProgressForIssues})
            .pipe(
              catchError(err => {
                labelsWithHandle.handle.finish();
                return throwError(() => err);
              }),
              take(1), // just to be sure
              map(issues => ({issues, labels: labelsWithHandle.labels} as ImportResult)),
            )
          )
        )
    }
  }


}
