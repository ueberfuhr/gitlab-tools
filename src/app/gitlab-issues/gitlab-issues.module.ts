import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GitlabProjectsModule} from '../gitlab-projects/gitlab-projects.module';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ProjectSelectorModule} from '../gitlab-projects/modules/project-selector/project-selector.module';
import {ProjectOpenInGitlabButtonModule} from '../gitlab-projects/modules/project-open-in-gitlab-button/project-open-in-gitlab-button.module';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FormsModule} from '@angular/forms';
import {FileDragDropModule} from '../shared/file-drag-drop/file-drag-drop.module';
import {FlexModule} from '@angular/flex-layout';
import {IssueExchangeModelViewerComponent} from './components/issue-exchange-model-viewer/issue-exchange-model-viewer.component';
import {MatDividerModule} from '@angular/material/divider';
import {LabelComponent} from './components/label/label.component';
import {MatBadgeModule} from '@angular/material/badge';
import {MatListModule} from '@angular/material/list';
import {IssueExchangeCardComponent} from './components/issue-exchange-card/issue-exchange-card.component';
import {MatMenuModule} from '@angular/material/menu';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {RouterModule} from '@angular/router';
import { LabelsByNamePipe } from './pipes/labels-by-name.pipe';

@NgModule({
  declarations: [
    LandingPageComponent,
    IssueExchangeModelViewerComponent,
    LabelComponent,
    IssueExchangeCardComponent,
    LabelsByNamePipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: LandingPageComponent}]),
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
    MatMenuModule
  ]
})
export class GitlabIssuesModule {
}
