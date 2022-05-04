import { TestBed } from '@angular/core/testing';

import { GitlabProjectsService } from './services/gitlab-projects.service';

describe('GitlabProjectsService', () => {
  let service: GitlabProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GitlabProjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
