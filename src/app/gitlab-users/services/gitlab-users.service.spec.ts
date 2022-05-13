import {GitlabUsersService} from './gitlab-users.service';
import {createServiceFactory, SpectatorService} from '@ngneat/spectator/jest';
import {GitlabService} from '../../gitlab-access/services/gitlab.service';
import {of} from 'rxjs';

describe('GitlabUsersService', () => {

  let spectator: SpectatorService<GitlabUsersService>;
  const createService = createServiceFactory({
    service: GitlabUsersService,
    mocks: [GitlabService]
  });

  beforeEach(() => spectator = createService());

  it('should reduce to GitlabUser', done => {
    spectator.inject(GitlabService).call
      .mockReturnValue(of({
        id: 10,
        username: 'john.doe',
        name: 'John Doe',
        another_property: 22
      }));
    spectator.service.getCurrentUser()
      .subscribe(user => {
        expect(user.id).toBe(10);
        expect(user.username).toBe('john.doe');
        expect(user.name).toBe('John Doe');
        expect((user as any).another_property).toBeUndefined();
        done();
      });
  }, 1000);

});
