import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {GITLAB_CONFIG, GitlabConfig} from './environments/gitlab-config.model';

fetch('gitlab-config.json', {cache: 'reload'})
  .then(response => response.json() as unknown as GitlabConfig)
  .catch(error => {
    console.error(error);
    return {
      host: 'http://localhost',
      token: '<unknown>'
    } as GitlabConfig;
  }).then(config => {
  platformBrowserDynamic([
    {provide: GITLAB_CONFIG, useValue: config}
  ]).bootstrapModule(AppModule)
    .catch(err => console.error(err));
})
