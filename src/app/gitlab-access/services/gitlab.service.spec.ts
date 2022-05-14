import {createHttpFactory, HttpMethod, SpectatorHttp} from '@ngneat/spectator/jest';
import {GitlabService} from './gitlab.service';
import {GITLAB_CONFIG, GitlabConfig} from '../../../environments/gitlab-config.model';
import {Provider} from '@angular/core';
import {HttpTestingController} from '@angular/common/http/testing';

describe('GitlabService', () => {

  const createHttp = createHttpFactory({
    service: GitlabService,
    providers: [
      ({
        provide: GITLAB_CONFIG,
        useValue: ({
          host: 'host',
          token: 'token'
        } as GitlabConfig)
      } as Provider)
    ]
  });

  let spectator: SpectatorHttp<GitlabService>;
  // Mock
  let http: HttpTestingController;
  // Class under Test
  let gitlab: GitlabService;


  beforeEach(() => {
    spectator = createHttp();
    gitlab = spectator.service;
    http = spectator.controller;
  });

  it('should make simple request correctly', done => {
    const responseBody = {test: 'test'};
    gitlab.call('test', {
      body: 'body',
      params: {
        param1: 'pValue1'
      },
      headers: {
        header1: 'hValue1'
      },
      method: 'delete'
    }).subscribe(response => {
      expect(response).toMatchObject(responseBody);
      done();
    });
    const req = http.expectOne('host/api/v4/test?param1=pValue1', HttpMethod.DELETE)
    const request = req.request;
    expect(request.body).toBe('body');
    expect(request.headers.get('header1')).toBe('hValue1');
    expect(request.headers.get('PRIVATE-TOKEN')).toBe('token');
    req.flush(responseBody);
  });

  it('should notify observers when simple request is successful', done => {
    gitlab.accesses.subscribe(done);
    gitlab.call('test').subscribe();
  });

  it('should notify observers on simple request error', done => {
    gitlab.errors.subscribe(err => {
      expect(err.status).toBe(500);
      done();
    });
    gitlab.call('test').subscribe();
    http.expectOne(() => true).flush(null, {
      status: 500,
      statusText: 'internal server error'
    })
  });

  // paginated


});
