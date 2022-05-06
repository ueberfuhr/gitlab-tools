import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {catchError, debounceTime, filter, forkJoin, map, mergeMap, Observable, of, take, tap, toArray} from 'rxjs';
import {GitlabProject} from '../../models/project.model';
import {GitlabProjectsService} from '../../services/gitlab-projects.service';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

interface FilterSet<T> {
  items: T[],
  total: number
}

@Component({
  selector: 'app-project-selector',
  templateUrl: './project-selector.component.html',
  styleUrls: ['./project-selector.component.scss']
})
export class ProjectSelectorComponent implements OnInit {
  txtInput = new FormControl();
  filteredOptions$?: Observable<GitlabProject[]>;
  filteredOptionsMissing = 0;
  @Input() optionsLimit = 20;
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
        const projectById$ = (isNaN(id) ? of([]) : this.projects.getProjectById(id)
          .pipe(
            // transform to array of length 1 to make it joinable
            map(project => [project]),
            catchError(() => [])
          ))
          .pipe(
            // transform to filterset
            map(items => ({items, total: items.length}) as FilterSet<GitlabProject>)
          );
        // search for name
        const projectsByName$ = (value.length < 3 ? of([]) : this.projects.getProjects(value)
          .pipe(
            // exclude project with id
            filter(set => set.payload.id != id),
            // do not catch all entries,  only 20
            take(this.optionsLimit),
            toArray(),
            catchError(() => [])
          ))
          .pipe(
            map(sets => ({
              items: sets.map(set => set.payload),
              total: sets.length > 0 ? sets[0].total : 0
            } as FilterSet<GitlabProject>))
          )
        return forkJoin([projectById$, projectsByName$])
          .pipe(
            map(result => ({
              items: [...result[0].items, ...result[1].items],
              total: result[0].total + result[1].total
            } as FilterSet<GitlabProject>)),
            tap(set => {
              this.filteredOptionsMissing = set.total - set.items.length;
            }),
            map(set => set.items)
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
