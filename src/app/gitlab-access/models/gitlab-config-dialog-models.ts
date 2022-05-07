import {GitlabConfig} from '../../../environments/gitlab-config.model';
import {Observable} from 'rxjs';

export interface GitlabConfigConnectionTester {

  testConnection(config: GitlabConfig): Observable<boolean>

}

export interface GitlabConfigDialogInput {
  config: GitlabConfig,
  message?: string,
  connectionTester?: GitlabConfigConnectionTester
}

export interface GitlabConfigDialogResult {
  config?: GitlabConfig,
  successful: boolean
}
