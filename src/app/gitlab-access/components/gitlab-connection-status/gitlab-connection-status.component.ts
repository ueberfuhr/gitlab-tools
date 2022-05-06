import {AfterViewInit, Component, Inject} from '@angular/core';
import {GITLAB_CONFIG, GitlabConfig} from '../../../../environments/gitlab-config.model';
import {MatDialog} from '@angular/material/dialog';
import {GitlabAccessTokenDialogComponent, GitlabAccessTokenDialogInput} from '../gitlab-access-token-dialog/gitlab-access-token-dialog.component';

@Component({
  selector: 'app-gitlab-connection-status',
  templateUrl: './gitlab-connection-status.component.html',
  styleUrls: ['./gitlab-connection-status.component.scss']
})
export class GitlabConnectionStatusComponent implements AfterViewInit {

  constructor(@Inject(GITLAB_CONFIG) public readonly config: GitlabConfig,
              private readonly dialog: MatDialog) {
  }

  openSite(host: string) {
    window.open(host, '_blank');
  }

  ngAfterViewInit(): void {
    this.dialog.open(GitlabAccessTokenDialogComponent, {
      autoFocus: true,
      minWidth: '20em',
      data: {
        token: this.config.token
      } as GitlabAccessTokenDialogInput
    }).afterClosed().subscribe(token => {
      if (token) {
        this.config.token = token;
      }
    });
  }

}
