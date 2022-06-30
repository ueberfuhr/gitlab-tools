import {Inject, Injectable} from '@angular/core';
import {catchError, Observable, of, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {emptyGitlabConfig, GITLAB_CONFIG_ENDPOINT, GitlabConfig} from './gitlab-config.model';

@Injectable({
  providedIn: 'root'
})
export class GitlabConfigService {

  private env: GitlabConfig = emptyGitlabConfig();

  constructor(private readonly http: HttpClient,
              @Inject(GITLAB_CONFIG_ENDPOINT) private readonly endpoint: string) {
  }

  get configuration(): GitlabConfig {
    return this.env;
  }

  loadConfiguration(): Observable<GitlabConfig> {
    return this.http.get<GitlabConfig>(this.endpoint)
      .pipe(
        catchError(() => of(emptyGitlabConfig())),
        tap(env => this.env = env),
      );
  }

}
