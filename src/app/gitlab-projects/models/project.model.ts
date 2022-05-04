export interface GitlabProject {

  id: number;
  name: string;
  name_with_namespace: string;
  path_with_namespace: string;
  web_url: string;
  namespace: {
    id: number,
    full_path: string
  }
}
