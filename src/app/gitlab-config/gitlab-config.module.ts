import {APP_INITIALIZER, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {GitlabConfigService} from './gitlab-config.service';
import {GITLAB_CONFIG, GitlabConfig} from './gitlab-config.model';
import {Observable} from 'rxjs';

function loadGitlabConfiguration(config: GitlabConfigService): () => Observable<GitlabConfig> {
  return () => config.loadConfiguration();
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadGitlabConfiguration,
      deps: [GitlabConfigService],
      multi: true
    },
    {
      provide: GITLAB_CONFIG,
      useFactory: (service: GitlabConfigService) => service.configuration,
      deps: [GitlabConfigService],
    }
  ]
})
export class GitlabConfigModule {
}
