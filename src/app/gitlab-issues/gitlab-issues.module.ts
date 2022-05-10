import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GitlabIssuesRoutingModule} from './gitlab-issues-routing.module';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {GitlabProjectsModule} from '../gitlab-projects/gitlab-projects.module';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ProjectSelectorModule} from '../gitlab-projects/modules/project-selector/project-selector.module';
import {ProjectOpenInGitlabButtonModule} from '../gitlab-projects/modules/project-open-in-gitlab-button/project-open-in-gitlab-button.module';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FormsModule} from '@angular/forms';
import {ImportIssuesButtonComponent} from './components/import-issues-button/import-issues-button.component';
import {ExportIssuesButtonComponent} from './components/export-issues-button/export-issues-button.component';
import {FileDragDropModule} from '../shared/file-drag-drop/file-drag-drop.module';
import {FlexModule} from '@angular/flex-layout';
import {IssueExchangeModelViewerComponent} from './components/issue-exchange-model-viewer/issue-exchange-model-viewer.component';
import {MatDividerModule} from '@angular/material/divider';
import {LabelComponent} from './components/label/label.component';
import {MatBadgeModule} from '@angular/material/badge';
import {MatListModule} from '@angular/material/list';
import {ProgressViewModule} from '../shared/progress-view/progress-view.module';
import {IssueExchangeCardComponent} from './components/issue-exchange-card/issue-exchange-card.component';

@NgModule({
  declarations: [
    LandingPageComponent,
    ImportIssuesButtonComponent,
    ExportIssuesButtonComponent,
    IssueExchangeModelViewerComponent,
    LabelComponent,
    IssueExchangeCardComponent,
  ],
  imports: [
    CommonModule,
    GitlabIssuesRoutingModule,
    GitlabProjectsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ProjectSelectorModule,
    ProjectOpenInGitlabButtonModule,
    MatInputModule,
    MatToolbarModule,
    FormsModule,
    FileDragDropModule,
    FlexModule,
    MatDividerModule,
    MatBadgeModule,
    MatListModule,
    ProgressViewModule
  ]
})
export class GitlabIssuesModule {
}
