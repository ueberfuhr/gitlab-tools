import {Inject, Injectable} from '@angular/core';
import {GITLAB_CONFIG, GitlabConfig} from '../../../environments/gitlab-config.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GitlabService {

  constructor(
    @Inject(GITLAB_CONFIG) private readonly config: GitlabConfig,
    private readonly http: HttpClient
  ) {
  }

  public call<T>(resource: string, options?: {
    /**
     * A body to include
     */
    body?: any,
    /**
     * The request method, defaults to 'get'
     */
    method?: 'get' | 'post' | 'put' | 'delete',
    /**
     * Additional headers.
     */
    headers?: {
      [header: string]: string | string[];
    },
    /**
     * Additional params
     */
    params?: {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
  }): Observable<T> {
    return this.http.request<T>(options?.method ?? 'get',
      `${this.config.host}/api/v4/${resource}`,
      {
        body: options?.body,
        params: options?.params,
        headers: Object.assign({"PRIVATE-TOKEN": this.config.token}, options?.headers)
      });
  }


}
