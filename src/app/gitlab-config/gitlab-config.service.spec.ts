import {fakeAsync} from '@angular/core/testing';

import {createHttpFactory, HttpMethod, SpectatorHttp} from '@ngneat/spectator';
import {HttpTestingController} from '@angular/common/http/testing';
import {GitlabConfigService} from './gitlab-config.service';
import {GITLAB_CONFIG_ENDPOINT, GitlabConfig} from './gitlab-config.model';

describe('GitlabConfigService', () => {
  let spectator: SpectatorHttp<GitlabConfigService>;
  const createService = createHttpFactory({
    service: GitlabConfigService,
    providers: [
      {provide: GITLAB_CONFIG_ENDPOINT, useValue: 'endpoint'}
    ]
  });
  let service: GitlabConfigService;
  let http: HttpTestingController;

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    http = spectator.controller;
  });

  it('should be initialized correctly', () => {
    expect(service.configuration.host).not.toBeNull();
    expect(service.configuration.token).not.toBeNull();
  });

  it('should read config correctly', fakeAsync(() => {
    const config: GitlabConfig = {
      host: 'host',
      token: 'token'
    }
    service.loadConfiguration().subscribe(result => {
      expect(result).toEqual(config);
    });
    http.expectOne('endpoint', HttpMethod.GET)
      .flush(config);
  }));
});
