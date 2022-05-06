import {GitlabConfig} from '../../../environments/gitlab-config.model';

export interface GitlabConfigDialogInput {
  config: GitlabConfig,
  message?: string,
  checkValidity?(config: GitlabConfig): Promise<boolean>
}
export interface GitlabConfigDialogResult {
  config?: GitlabConfig,
  successful: boolean
}
