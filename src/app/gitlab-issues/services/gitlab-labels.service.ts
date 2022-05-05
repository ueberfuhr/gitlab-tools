import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {GitlabLabel} from '../models/gitlab-label.model';
import {DataSet, GitlabService} from '../../gitlab-access/services/gitlab.service';

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
  private static reduce(set: DataSet<GitlabLabel>): DataSet<GitlabLabel> {
    const label = set.payload;
    set.payload = {
      id: label.id,
      color: label.color,
      description: label.description,
      name: label.name,
      is_project_label: label.is_project_label,
      text_color: label.text_color
    };
    return set;
  }

  public getLabelsForProject(projectId: number): Observable<DataSet<GitlabLabel>> {
    return this.gitlab.callPaginated<GitlabLabel>(`projects/${projectId}/labels`).pipe(
      map(GitlabLabelsService.reduce)
    );
  }

}
