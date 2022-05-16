import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {GitlabLabel} from '../models/gitlab-label.model';
import {DataSet, GitlabService} from '../../gitlab-access/services/gitlab.service';
import {GitlabProject} from '../../gitlab-projects/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class GitlabLabelsService {

  constructor(private readonly gitlab: GitlabService) {
  }

  /**
   * Remove all fields from Gitlab resource that are not needed within this application.
   * @param set the object that was received from Gitlab
   * @private the reduced object
   */
  private static reduceSet(set: DataSet<GitlabLabel>): DataSet<GitlabLabel> {
    set.payload = GitlabLabelsService.reduce(set.payload)
    return set;
  }

  private static reduce(label: GitlabLabel): GitlabLabel {
    return {
      id: label.id,
      color: label.color,
      description: label.description,
      name: label.name,
      is_project_label: label.is_project_label
    };
  }

  getLabelsForProject(projectId: number): Observable<DataSet<GitlabLabel>> {
    return this.gitlab.callPaginated<GitlabLabel>(`projects/${projectId}/labels`).pipe(
      map(GitlabLabelsService.reduceSet)
    );
  }

  create(project: GitlabProject, label: GitlabLabel): Observable<GitlabLabel> {
    return label.is_project_label ?
      this.createForProject(label, project.id) :
      this.createForGroup(label, project.namespace.id);
  }

  private createForProject(label: GitlabLabel, projectId: number): Observable<GitlabLabel> {
    return this.gitlab.call<GitlabLabel>(`projects/${projectId}/labels`, 'post', {
      params: {
        name: label.name,
        description: label.description ?? '',
        color: label.color,
      }
    }).pipe(
      map(GitlabLabelsService.reduce)
    );
  }

  private createForGroup(label: GitlabLabel, groupId: number): Observable<GitlabLabel> {
    console.log(`Create group label ${label.name} with color ${label.color}`);
    return this.gitlab.call<GitlabLabel>(`groups/${groupId}/labels`, 'post', {
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        name: label.name,
        description: label.description ?? '',
        color: label.color,
      }
    }).pipe(
      map(GitlabLabelsService.reduce)
    );
  }

}
