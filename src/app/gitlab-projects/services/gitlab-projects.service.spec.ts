import {createServiceFactory, SpectatorService, SpyObject} from '@ngneat/spectator/jest';
import {GitlabService} from '../../gitlab-access/services/gitlab.service';
import {GitlabProjectsService} from './gitlab-projects.service';

describe('GitlabProjectsService', () => {

  const createService = createServiceFactory({
    service: GitlabProjectsService,
    mocks: [GitlabService]
  });

  let spectator: SpectatorService<GitlabProjectsService>;
  // Mock
  let gitlab: SpyObject<GitlabService>;
  // Class under Test
  let service: GitlabProjectsService;

  beforeEach(() => {
    spectator = createService();
    gitlab = spectator.inject(GitlabService);
    service = spectator.service;
  });

  it('should work', () => {});

});
