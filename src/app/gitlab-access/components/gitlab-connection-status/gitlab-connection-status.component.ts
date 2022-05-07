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
    this.gitlabErrorsSubscription = this.gitlab.errors.subscribe(() => {
      this.lastAccessSuccessful = false;
      this.snackBar.open('Test', 'Action', {
        duration: 5000
      });
    });
    this.gitlabAccessesSubscription = this.gitlab.accesses.subscribe(() => {
      this.lastAccessSuccessful = true;
    });
  }

  ngOnDestroy(): void {
    this.gitlabErrorsSubscription?.unsubscribe();
  }


  openSite(host: string) {
    window.open(host, '_blank');
  }

  ngAfterViewInit(): void {
    this.testConnection(this.config).subscribe(success => {
      if (!success) {
        this.openSettings('Your configuration is not yet valid, please enter your access data.');
      }
    });
  }

  openSettings(message?: string): void {
    this.dialog.open({
      config: this.config,
      message,
      connectionTester: this
    }).subscribe(result => {
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
          this.snackBar.open(`Hallo ${user.name}!`, 'Verbindung erfolgreich.', {
            duration: 5000
          });
          return true;
        }),
        catchError(() => of(false))
      );
    } finally {
      Object.assign(this.config, configBackup);
    }
  }

}
