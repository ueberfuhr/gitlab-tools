/**
 * A label that is assigned to issues.
 */
export interface GitlabLabel {

  /**
   * The is of the label.
   */
  id: number,
  /**
   * The name of the label.
   */
  name: string,
  /**
   * A description for the label.
   */
  description?: string,
  /**
   * The label text-color as hex string (<code>#803487</code>).
   */
  text_color: string,
  /**
   * The label background-color as hex string (<code>#FFFFFF</code>).
   */
  color: string,
  /**
   * A flag indicating that the label is declared within the project or within one of the parent groups.
   */
  is_project_label: boolean

}
