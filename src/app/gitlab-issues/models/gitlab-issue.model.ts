export type GitlabIssueState = "open" | "closed";

/**
 * A Gitlab issue.
 */
export interface GitlabIssue {

  /**
   * The ID that is unique across all projects.
   */
  id: number;
  /**
   * The internal ID (displayed in the web UI) that’s unique in the scope of a single project.
   * See {@link https://docs.gitlab.com/ee/api/#id-vs-iid} for more information.
   */
  iid: number;
  /**
   * The title.
   */
  title: string;
  /**
   * The description text.
   */
  description: string;
  /**
   * The state of the issue.
   */
  state: GitlabIssueState;
  /**
   * The labels of the issue.
   */
  labels: string[];
  /**
   * The type. Is <code>"ISSUE"</code> in every case.
   */
  type: "ISSUE";

}
