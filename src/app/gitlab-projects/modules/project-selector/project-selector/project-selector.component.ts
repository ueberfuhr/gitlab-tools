import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {catchError, debounceTime, forkJoin, map, mergeMap, Observable, of} from 'rxjs';
import {GitlabProject} from '../../../models/project.model';
import {GitlabProjectsService} from '../../../services/gitlab-projects.service';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

@Component({
  selector: 'app-project-selector',
  templateUrl: './project-selector.component.html',
  styleUrls: ['./project-selector.component.scss']
})
export class ProjectSelectorComponent implements OnInit {
  txtInput = new FormControl();
  filteredOptions$?: Observable<GitlabProject[]>;
  @Output() projectSelected = new EventEmitter<GitlabProject>();
  project?: GitlabProject;

  constructor(private readonly projects: GitlabProjectsService) {
  }

  ngOnInit(): void {
    this.filteredOptions$ = this.txtInput.valueChanges.pipe(
      debounceTime(1000),
      mergeMap(value => {
        // search for id
        const id = Number(value);
        const projectById$ = isNaN(id) ? of([]) : this.projects.getProjectById(id)
          .pipe(
            // transform to array of length 1
            map(project => [project]),
            catchError(() => []),
          );
        // search for name
        const projectsByName$ = value.length < 3 ? of([]) : this.projects.getProjects(value)
          .pipe(
            // exclude project with id
            map(projects => projects.filter(p => p.id != id))
          )
        return forkJoin([projectById$, projectsByName$])
          .pipe(
            map(result => [...result[0], ...result[1]]),
            catchError(() => [])
          );
      })
    );
  }

  displayText(project?: GitlabProject): string {
    return project ? `${project.name_with_namespace} (ID: ${project.id})` : '';
  }

  onProjectSelected($event: MatAutocompleteSelectedEvent) {
    this.project = $event.option.value as GitlabProject;
    this.projectSelected.emit(this.project);
  }
}
