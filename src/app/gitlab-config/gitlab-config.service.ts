import {Inject, Injectable} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {GITLAB_CONFIG_ENDPOINT, GitlabConfig} from './gitlab-config.model';

@Injectable({
  providedIn: 'root'
})
export class GitlabConfigService {

  private env: GitlabConfig = {
    host: 'http://localhost',
    token: '<access-token>'
  };

  constructor(private readonly http: HttpClient,
              @Inject(GITLAB_CONFIG_ENDPOINT) private readonly endpoint: string) {
  }

  get configuration(): GitlabConfig {
    return this.env;
  }

  loadConfiguration(): Observable<GitlabConfig> {
    return this.http.get<GitlabConfig>(this.endpoint)
      .pipe(
        tap(env => this.env = env)
      );
  }

}
