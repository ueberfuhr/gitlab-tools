import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IssuesLandingPageComponent} from './issues-landing-page.component';
import {GitlabIssuesModule} from '../../gitlab-issues/gitlab-issues.module';

const routes: Routes = [{path: '', component: IssuesLandingPageComponent}];

@NgModule({
  declarations: [IssuesLandingPageComponent],
  imports: [
    RouterModule.forChild(routes),
    GitlabIssuesModule
  ]
})
export class IssuesLandingPageModule {
}
