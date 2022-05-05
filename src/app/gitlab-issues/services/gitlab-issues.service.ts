import {Injectable} from '@angular/core';
import {DataSet, GitlabService} from '../../gitlab-access/services/gitlab.service';
import {Observable, tap} from 'rxjs';
import {GitlabIssue, GitlabIssueState} from '../models/gitlab-issue.model';

@Injectable({
  providedIn: 'root'
})
export class GitlabIssuesService {

  constructor(private readonly gitlab: GitlabService) {
  }

  /**
   * Remove all fields from Gitlab resource that are not needed within this application.
   * @param issue the object that was received from Gitlab
   * @private the reduced object
   */
  private static reduce(issue: GitlabIssue): GitlabIssue {
    return {
      id: issue.id,
      iid: issue.iid,
      title: issue.title,
      description: issue.description,
      state: issue.state,
      labels: issue.labels,
      type: issue.type
    };
  }

  public getIssuesForProject(projectId: number, options?: {
    state?: GitlabIssueState
  }): Observable<DataSet<GitlabIssue>> {
    let params = {};
    if(options?.state) {
      params = Object.assign(params, {state: options.state});
    }
    return this.gitlab.callPaginated<GitlabIssue>(`projects/${projectId}/issues`, {
      params
    }).pipe(tap(set => set.payload = GitlabIssuesService.reduce(set.payload)));
  }

}
