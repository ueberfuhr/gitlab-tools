import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectOpenInGitlabButtonComponent } from './project-open-in-gitlab-button.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';



@NgModule({
  declarations: [
    ProjectOpenInGitlabButtonComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    ProjectOpenInGitlabButtonComponent
  ]
})
export class ProjectOpenInGitlabButtonModule { }
