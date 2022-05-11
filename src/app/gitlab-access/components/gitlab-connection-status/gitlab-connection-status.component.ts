import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {GITLAB_CONFIG, GitlabConfig} from '../../../../environments/gitlab-config.model';
import {GitlabConfigDialogService} from '../../services/gitlab-config-dialog.service';
import {GitlabService} from '../../services/gitlab.service';
import {catchError, map, Observable, of, Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ThemePalette} from '@angular/material/core';
import {GitlabUsersService} from '../../../gitlab-users/services/gitlab-users.service';
import {GitlabConfigConnectionTester} from '../../models/gitlab-config-dialog-models';

@Component({
  selector: 'app-gitlab-connection-status',
  templateUrl: './gitlab-connection-status.component.html',
  styleUrls: ['./gitlab-connection-status.component.scss']
})
export class GitlabConnectionStatusComponent implements OnInit, AfterViewInit, OnDestroy, GitlabConfigConnectionTester {

  private gitlabAccessesSubscription?: Subscription;
  private gitlabErrorsSubscription?: Subscription;
  lastAccessSuccessful?: boolean;
  settingsDialogOpen = false;

  readonly warn: ThemePalette = 'warn';
  readonly accent: ThemePalette = 'accent';
  readonly primary: ThemePalette = 'primary';

  constructor(@Inject(GITLAB_CONFIG) public readonly config: GitlabConfig,
              private readonly gitlab: GitlabService,
              private readonly users: GitlabUsersService,
              private readonly dialog: GitlabConfigDialogService,
              private readonly snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.gitlabErrorsSubscription = this.gitlab.errors.subscribe(err => {
      switch (err.status) {
        case 401:
          this.lastAccessSuccessful = false;
          if (this.settingsDialogOpen) {
            this.snackBar.open('Gitlab Connection Authentication failed.');
          } else {
            this.snackBar
              .open('Gitlab Connection Authentication failed.', 'Edit settings...')
              .onAction().subscribe(() => this.openSettings());
          }
          break;
        case 404:
          // don't do anything
          break;
        default:
          this.lastAccessSuccessful = false;
          this.snackBar.open('Gitlab Connection is broken.');
          break;
      }
    });
    this.gitlabAccessesSubscription = this.gitlab.accesses.subscribe(() => {
      this.lastAccessSuccessful = true;
    });
  }

  ngOnDestroy(): void {
    this.gitlabErrorsSubscription?.unsubscribe()
    this.gitlabAccessesSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.testConnection(this.config).subscribe(success => {
      if (!success) {
        this.openSettings('Gitlab access failed. Please check:');
      }
    });
  }

  openSettings(message?: string): void {
    this.settingsDialogOpen = true;
    this.dialog.open({
      config: this.config,
      message,
      connectionTester: this
    }).subscribe(result => {
      this.settingsDialogOpen = false;
      if (result.successful) {
        Object.assign(this.config, result.config ?? this.config);
      }
      this.testConnection(this.config).subscribe();
    })
  }

  // @Override
  testConnection(config: GitlabConfig): Observable<boolean> {
    const configBackup = Object.assign({}, this.config);
    try {
      Object.assign(this.config, config);
      return this.users.getCurrentUser().pipe(
        map(user => {
          this.snackBar.open(`Hallo ${user.name}!`);
          return true;
        }),
        catchError(() => of(false))
      );
    } finally {
      Object.assign(this.config, configBackup);
    }
  }

}
