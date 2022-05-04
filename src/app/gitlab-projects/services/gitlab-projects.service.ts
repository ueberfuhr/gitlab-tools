import {Injectable} from '@angular/core';
import {GitlabService} from '../../gitlab-access/services/gitlab.service';
import {GitlabProject} from '../models/project.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GitlabProjectsService {

  constructor(private readonly gitlab: GitlabService) {
  }

  public getProjectById(id: number): Observable<GitlabProject> {
    return this.gitlab.call(`projects/${id}`);
  }

  public getProjects(search?: string): Observable<GitlabProject[]> {
    return this.gitlab.call('projects', {
      params: {
        search: search ?? '',
        order_by: 'path',
        membership: true,
        sort: 'asc',
        simple: true
      }
    });
  }

}
