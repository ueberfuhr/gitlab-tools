import {AfterViewInit, Component, Inject} from '@angular/core';
import {GITLAB_CONFIG, GitlabConfig} from '../../../../environments/gitlab-config.model';
import {GitlabConfigDialogService} from '../../services/gitlab-config-dialog.service';

@Component({
  selector: 'app-gitlab-connection-status',
  templateUrl: './gitlab-connection-status.component.html',
  styleUrls: ['./gitlab-connection-status.component.scss']
})
export class GitlabConnectionStatusComponent implements AfterViewInit {

  constructor(@Inject(GITLAB_CONFIG) public readonly config: GitlabConfig,
              private readonly dialog: GitlabConfigDialogService) {
  }

  openSite(host: string) {
    window.open(host, '_blank');
  }

  ngAfterViewInit(): void {
    this.dialog.open({
      config: this.config
    }).subscribe(result => {
      if(result.successful) {
        Object.assign(this.config, result.config ?? this.config);
      }
    })
  }

}
