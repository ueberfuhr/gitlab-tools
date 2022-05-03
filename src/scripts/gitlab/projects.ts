import {callGitLab} from "./access";

export interface Project {

    id: number;
    name: string;
    name_with_namespace: string

}

export function getProjects(search?: string): Promise<Project[]> {
    return callGitLab<Project[]>(`projects?search=${search}`);
}
