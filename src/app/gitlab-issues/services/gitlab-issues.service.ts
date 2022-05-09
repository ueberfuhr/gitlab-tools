import {Injectable} from '@angular/core';
import {DataSet, GitlabService} from '../../gitlab-access/services/gitlab.service';
import {map, Observable} from 'rxjs';
import {GitlabIssue, GitlabIssueState} from '../models/gitlab-issue.model';

@Injectable({
  providedIn: 'root'
})
export class GitlabIssuesService {

  constructor(private readonly gitlab: GitlabService) {
  }

  /**
   * Remove all fields from Gitlab resource that are not needed within this application.
   * @param set the object that was received from Gitlab
   * @private the reduced object
   */
  private static reduceSet(set: DataSet<GitlabIssue>): DataSet<GitlabIssue> {
    set.payload = GitlabIssuesService.reduce(set.payload);
    return set;
  }

  private static reduce(issue: GitlabIssue): GitlabIssue {
    return {
      id: issue.id,
      iid: issue.iid,
      title: issue.title,
      description: issue.description,
      state: issue.state,
      labels: issue.labels,
      issue_type: issue.issue_type,
    };
  }

  getIssues(projectId: number, options?: {
    state?: GitlabIssueState
  }): Observable<DataSet<GitlabIssue>> {
    let params = {};
    if(options?.state) {
      params = Object.assign(params, {state: options.state});
    }
    return this.gitlab.callPaginated<GitlabIssue>(`projects/${projectId}/issues`, {
      params
    }).pipe(map(GitlabIssuesService.reduceSet));
  }

  create(projectId: number, issue: GitlabIssue): Observable<GitlabIssue> {
    return this.gitlab.call<GitlabIssue>(`projects/${projectId}/issues`, {
      method: 'post',
      params: {
        title: issue.title,
        description: issue.description,
        labels: issue.labels.join(','),
        issue_type: issue.issue_type,
        // don't import id, iid and state
      }
    })
  }

}
