import {Injectable} from '@angular/core';
import {DataSet, GitlabService} from '../../gitlab-access/services/gitlab.service';
import {GitlabProject, GitlabProjectNamespace} from '../models/project.model';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GitlabProjectsService {

  constructor(private readonly gitlab: GitlabService) {
  }

  public getProjectById(id: number): Observable<GitlabProject> {
    return this.gitlab.call(`projects/${id}`);
  }

  private static reduceNS(ns: GitlabProjectNamespace): GitlabProjectNamespace {
    return {
      id: ns.id,
      full_path: ns.full_path
    };
  }

  /**
   * Remove all fields from Gitlab resource that are not needed within this application.
   * @param set the object that was received from Gitlab
   * @private the reduced object
   */
  private static reduce(set: DataSet<GitlabProject>): DataSet<GitlabProject> {
    const p = set.payload;
    set.payload = {
      id: p.id,
      name: p.name,
      name_with_namespace: p.name_with_namespace,
      path_with_namespace: p.path_with_namespace,
      web_url: p.web_url,
      namespace: GitlabProjectsService.reduceNS(p.namespace)
    }
    return set;
  }

  public getProjects(search?: string): Observable<DataSet<GitlabProject>> {
    return this.gitlab.callPaginated<GitlabProject>('projects', {
      params: {
        search: search ?? '',
        search_namespaces: true,
        order_by: 'path',
        membership: true,
        sort: 'asc',
        simple: true
      }
    }).pipe(map(GitlabProjectsService.reduce));
  }

}
