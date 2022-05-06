import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { GitlabConnectionStatusComponent } from './components/gitlab-connection-status/gitlab-connection-status.component';
import {MatButtonModule} from '@angular/material/button';
import { GitlabAccessTokenDialogComponent } from './components/gitlab-access-token-dialog/gitlab-access-token-dialog.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [
    GitlabConnectionStatusComponent,
    GitlabAccessTokenDialogComponent
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
    MatIconModule
  ]
})
export class GitlabAccessModule { }
