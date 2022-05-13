import {Injectable} from '@angular/core';
import {GitlabIssuesService} from './gitlab-issues.service';
import {GitlabLabelsService} from './gitlab-labels.service';
import {GitlabProject} from '../../gitlab-projects/models/project.model';
import {ExchangeIssue, ExchangeLabel, IssueExchangeModel} from '../models/exchange.model';
import {GitlabProjectsService} from '../../gitlab-projects/services/gitlab-projects.service';
import {combineLatest, concat, defer, map, mergeMap, Observable, of, OperatorFunction, take, tap, toArray} from 'rxjs';
import {GitlabLabel} from '../models/gitlab-label.model';
import {GitlabIssue} from '../models/gitlab-issue.model';
import {ProgressDialogHandle, ProgressService} from '../../shared/progress-view/progress.service';
import {finishProgress, finishProgressOnError, ProgressHandler} from '../../shared/progress-view/progress.utilities';

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

@Injectable({
  providedIn: 'root'
})
export class IssueImportService {

  constructor(private readonly issuesService: GitlabIssuesService,
              private readonly projectsService: GitlabProjectsService,
              private readonly labelsService: GitlabLabelsService,
              private readonly progressService: ProgressService) {
  }

  private importLabelsWithLabelsImporter(project: GitlabProject, data: IssueExchangeModel, progressOptions: {
    handle: ProgressDialogHandle,
    minProgress: number,
    maxProgress: number
  }): Observable<GitlabLabel[]> {
    const importer = new LabelsImporter(
      data.labels,
      project,
      this.labelsService,
      total => new ProgressHandler(
        total,
        (progressOptions.maxProgress - progressOptions.minProgress) / total,
        progressOptions.minProgress,
        progressOptions.handle,
        (_progress, index) => `Imported ${index} of ${total} label(s)`
      )
    );
    return importer.import()
      .pipe(
        finishProgressOnError(progressOptions.handle)
      );
  }

  private importIssuesWithIssuesImporter(project: GitlabProject, data: IssueExchangeModel, progressOptions: {
    handle: ProgressDialogHandle,
    minProgress: number,
    maxProgress: number
  }, obtainOrder = true): Observable<GitlabIssue[]> {
    const importer = new IssuesImporter(
      data.issues,
      project,
      this.issuesService,
      total => new ProgressHandler(
        total,
        (progressOptions.maxProgress - progressOptions.minProgress) / total,
        progressOptions.minProgress,
        progressOptions.handle,
        (_progress, index) => `Imported ${index} of ${total} issues(s)`
      )
    );
    return importer.import(obtainOrder)
      .pipe(
        finishProgressOnError(progressOptions.handle)
      );
  }

  import(project: GitlabProject, data: IssueExchangeModel, obtainOrder = true): Observable<ImportResult> {
    const total = data.labels.length + data.issues.length;
    if (total === 0) {
      return of({issues: [], labels: [],});
    } else {
      const progressAfterLabels = data.labels.length / total;
      return defer(
        () => of(this.progressService.start({title: 'Importing...', mode: 'determinate'}))
      )
        .pipe(
          mergeMap(handle => this.importLabelsWithLabelsImporter(project, data, {
              handle,
              minProgress: 0,
              maxProgress: progressAfterLabels
            })
              .pipe(
                take(1), // just to be sure
                mergeMap(labels => this.importIssuesWithIssuesImporter(project, data, {
                    handle,
                    minProgress: progressAfterLabels,
                    maxProgress: 1
                  }, obtainOrder)
                    .pipe(
                      take(1), // just to be sure
                      map(issues => ({issues, labels} as ImportResult))
                    )
                ),
                finishProgress(handle)
              )
          )
        );
    }
  }

}

/* *************************************
 *   I N T E R N A L   C L A S S E S   *
 * ----------------------------------- *
 * Internal classes that encapsulate   *
 * the import context data and provide *
 * a readable kind of code.            *
 ************************************* */

/**
 * Imports the labels that do not yet exist.
 */
class LabelsImporter {

  /**
   * Constructor.
   * @param labels the array of labels that have to be imported
   * @param project the project where to import into
   * @param labelsService the labels service to access Gitlab
   * @param createProgressHandler a function to create a progress handler for the current progress
   */
  constructor(private readonly labels: ExchangeLabel[],
              private readonly project: GitlabProject,
              private readonly labelsService: GitlabLabelsService,
              private readonly createProgressHandler: (total: number) => ProgressHandler) {
  }

  private getExistingLabelNames(): Observable<string[]> {
    return this.labelsService.getLabelsForProject(this.project.id)
      .pipe(
        // DataSet<GitlabLabel>
        map(dataSet => dataSet.payload.name),
        // GitlabLabel-Name
        toArray()
      );
  }

  private findNewLabels(): OperatorFunction<string[], ExchangeLabel[]> {
    return map<string[], ExchangeLabel[]>(
      existingLabelNames => this.labels
        .filter(label => existingLabelNames.indexOf(label.name) < 0)
    );
  }

  private createImportOperationForLabel(label: ExchangeLabel, progressHandler: ProgressHandler) {
    return this.labelsService.create(this.project, {
      name: label.name,
      description: label.description,
      color: label.color,
      is_project_label: label.is_project_label,
    })
      .pipe(
        // display progress
        tap(() => progressHandler.done())
      )
  }

  /**
   * Execute the import.
   * @return the imported labels (that did not yet exist before the import)
   */
  import(): Observable<GitlabLabel[]> {
    return this.getExistingLabelNames()
      .pipe(
        // import labels that do not yet exist
        this.findNewLabels(),
        // ExchangeLabel[]
        mergeMap(newLabels => {
          if (newLabels.length > 0) {
            const progressHandler = this.createProgressHandler(newLabels.length);
            const importOperations = newLabels.map(label => this.createImportOperationForLabel(label, progressHandler));
            return combineLatest(importOperations);
          } else {
            return of([]);
          }
        })
      );
  }

}

/**
 * Imports the issues.
 */
class IssuesImporter {

  /**
   * Constructor.
   * @param issues the array of issues that have to be imported
   * @param project the project where to import into
   * @param issuesService the issues service to access Gitlab
   * @param createProgressHandler a function to create a progress handler for the current progress
   */
  constructor(private readonly issues: ExchangeIssue[],
              private readonly project: GitlabProject,
              private readonly issuesService: GitlabIssuesService,
              private readonly createProgressHandler: (total: number) => ProgressHandler) {
  }

  private sortIssuesByIID(): void {
    this.issues.sort((a, b) => a.iid - b.iid);
  }

  private createImportOperationForIssue(issue: ExchangeIssue, progressHandler: ProgressHandler) {
    return this.issuesService.create(this.project.id, {
      iid: issue.iid,
      title: issue.title,
      issue_type: issue.issue_type,
      labels: issue.labels,
      description: issue.description,
      state: issue.state
    })
      .pipe(
        // display progress
        tap(() => progressHandler.done())
      )
  }

  import(obtainOrder = true): Observable<GitlabIssue[]> {
    if (this.issues.length < 1) {
      return of([])
    } else {
      if (obtainOrder) {
        this.sortIssuesByIID();
      }
      return of(this.issues)
        .pipe(
          // ExchangeIssue[]
          mergeMap(newIssues => {
            const progressHandler = this.createProgressHandler(newIssues.length);
            const importOperations = newIssues.map(issue => this.createImportOperationForIssue(issue, progressHandler));
            return obtainOrder ?
              // we need them in sequence to get the right order!
              concat(...importOperations).pipe(toArray()) :
              combineLatest(importOperations);
          })
        );
    }
  }

}
