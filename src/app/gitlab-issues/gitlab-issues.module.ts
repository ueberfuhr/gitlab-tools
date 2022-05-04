import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GitlabIssuesRoutingModule} from './gitlab-issues-routing.module';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import {GitlabProjectsModule} from '../gitlab-projects/gitlab-projects.module';
import { ExportIssuesComponent } from './components/export-issues/export-issues.component';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';



@NgModule({
  declarations: [
    LandingPageComponent,
    ExportIssuesComponent
  ],
  imports: [
    CommonModule,
    GitlabIssuesRoutingModule,
    GitlabProjectsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ]
})
export class GitlabIssuesModule { }
