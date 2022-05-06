import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {map, Observable} from 'rxjs';
import {GitlabConfigDialogInput, GitlabConfigDialogResult} from '../models/gitlab-config-dialog-models';
import {GitlabConfigDialogComponent} from '../components/gitlab-config-dialog/gitlab-config-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class GitlabConfigDialogService {

  constructor(private readonly dialog: MatDialog) {
  }

  open(input: GitlabConfigDialogInput): Observable<GitlabConfigDialogResult> {
    return this.dialog
      .open<GitlabConfigDialogComponent, GitlabConfigDialogInput, GitlabConfigDialogResult>(GitlabConfigDialogComponent, {
        autoFocus: true,
        minWidth: '20em',
        data: input,
      }).afterClosed().pipe(
        map(result => result ?? {
          successful: false
        })
      );
  }

}
