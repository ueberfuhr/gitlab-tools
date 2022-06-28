import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './routing/app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PageTemplateModule} from './page-template/page-template.module';
import {HttpClientModule} from '@angular/common/http';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import {ProgressViewModule} from './shared/progress-view/progress-view.module';
import {GitlabConfigModule} from './gitlab-config/gitlab-config.module';
import {ENVIRONMENT} from '../environments/environment.model';
import {environment} from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GitlabConfigModule,
    BrowserAnimationsModule,
    PageTemplateModule,
    HttpClientModule,
    MatSnackBarModule,
    ProgressViewModule
  ],
  providers: [
    {provide: ENVIRONMENT, useValue: environment},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3500}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
