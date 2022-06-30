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
 * Returns an empty Gitlab configuration.
 */
export function emptyGitlabConfig(): GitlabConfig {
  return {
    host: '',
    token: ''
  };
}

/**
 * The injection token to get the GitLab config.
 */
export const GITLAB_CONFIG = new InjectionToken<GitlabConfig>('Configuration for the Gitlab Endpoint');

/**
 * The endpoint to the config json.
 */
export const GITLAB_CONFIG_ENDPOINT = new InjectionToken<string>('URL to the endpoint providing the configuration', {
  providedIn: 'root',
  factory: () => 'gitlab-config.json'
})
