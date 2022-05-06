import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { GitlabConnectionStatusComponent } from './components/gitlab-connection-status/gitlab-connection-status.component';
import {GitlabConfigDialogComponent} from './components/gitlab-config-dialog/gitlab-config-dialog.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';


@NgModule({
  declarations: [
    GitlabConnectionStatusComponent,
    GitlabConfigDialogComponent
  ],
  exports: [
    GitlabConnectionStatusComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule
  ]
})
export class GitlabAccessModule { }
