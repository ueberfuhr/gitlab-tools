/**
 * The configuration read from gitlab.json.
 */
import {InjectionToken} from '@angular/core';

export interface GitlabConfig {
  /**
   * The URL to the GitLab server.
   */
  host: string;
  /**
   * The access token that is used to access GitLab.
   */
  token: string;
}

/**
 * The injection token to get the GitLab config.
 */
export const GITLAB_CONFIG = new InjectionToken<GitlabConfig>('gitlab.config');
