/**
 * The configuration read from gitlab.json.
 */
export interface GitLabConfig {
    /**
     * The URL to the GitLab server.
     */
    host: string;
    /**
     * The access token that is used to access GitLab.
     */
    token: string;
}

let gitLabConfig: GitLabConfig;

export function readGitLabConfig(): Promise<GitLabConfig> {
    if (!gitLabConfig) {
        return fetch('gitlab.json', {cache: 'reload'})
            .then(response => response.json() as unknown as GitLabConfig)
            .then(result => {
                gitLabConfig = result;
                return result;
            })
            .catch(error => {
                console.error(error);
                return Promise.reject(error);
            })
    } else {
        return Promise.resolve(gitLabConfig);
    }
}

function accessToken(config: GitLabConfig): RequestInit {
    return {
        headers: {
            "PRIVATE-TOKEN": config.token
        }
    } as RequestInit;
}

export function callGitLab<T>(resource: string, options?: RequestInit): Promise<T> {
    return readGitLabConfig()
        .then(config => fetch(`${config.host}/api/v4/${resource}`, Object.assign(accessToken(config), options)))
        .then(response => response.json() as unknown as T)
        .catch(err => {
            console.error(err);
            return Promise.reject(err);
        });
}
