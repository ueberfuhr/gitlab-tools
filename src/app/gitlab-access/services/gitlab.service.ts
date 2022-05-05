import {Inject, Injectable} from '@angular/core';
import {GITLAB_CONFIG, GitlabConfig} from '../../../environments/gitlab-config.model';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {concat, defer, EMPTY, from, map, mergeMap, Observable} from 'rxjs';

export interface CallOptions {
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
}

/**
 * A single data set as part of a paginated or streamed call.
 */
export interface DataSet<T> {
  /**
   * The payload.
   */
  payload: T;
  /**
   * The 0-based index of the data set.
   */
  //index: number;
  /**
   * The total count of available data sets.
   */
  total: number;

}

// header names
const TOTAL_HEADER = 'X-Total';
const TOTAL_PAGES_HEADER = 'X-Total-Pages'

@Injectable({
  providedIn: 'root'
})
export class GitlabService {

  constructor(
    @Inject(GITLAB_CONFIG) private readonly config: GitlabConfig,
    private readonly http: HttpClient
  ) {
  }

  /**
   * Makes a single call to the REST API.
   * @param resource the URL of the resource
   * @param options the options of the call
   */
  public call<T>(resource: string, options?: CallOptions): Observable<T> {
    return this.http.request<T>(options?.method ?? 'get',
      `${this.config.host}/api/v4/${resource}`,
      {
        body: options?.body,
        params: options?.params,
        headers: Object.assign({'PRIVATE-TOKEN': this.config.token}, options?.headers)
      });
  }

  /**
   * Makes multiple calls to the REST API to fetch multiple resources.
   * Gitlab has a pagination that this method will handle.
   * If you do not want to read all data, use the <code>take*</code> operators for pipes.
   * @return an observable that submits each data set separately
   */
  public callPaginated<T>(resource: string, options?: CallOptions, page = 1, pageSize = 20): Observable<DataSet<T>> {
    return defer(() => this.http.request<T[]>(options?.method ?? 'get',
      `${this.config.host}/api/v4/${resource}`,
      {
        body: options?.body,
        params: Object.assign({
          // pagination
          page,
          per_page: pageSize
        }, options?.params),
        headers: Object.assign({'PRIVATE-TOKEN': this.config.token}, options?.headers),
        observe: 'response',
      }).pipe(
      map((response: HttpResponse<T[]>) => {
        const data = response.body ?? [];
        const totalHeader = response.headers.get(TOTAL_HEADER);
        const total = totalHeader ? Number(totalHeader) : data.length;
        const totalPagesHeader = response.headers.get(TOTAL_PAGES_HEADER);
        const totalPages = totalPagesHeader ? Number(totalPagesHeader) : page;
        return {
          items: data.map(payload => ({payload, total} as DataSet<T>)),
          isLast: page === totalPages
        };
      }),
      mergeMap(data => {
        const items$ = from(data.items);
        const next$ = data.isLast ? EMPTY : this.callPaginated<T>(resource, options, page + 1, pageSize);
        return concat(items$, next$);
      })
    ));
  }

}
