import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {PageTemplateComponent} from './page-template/page-template.component';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    PageTemplateComponent
  ],
  exports: [
    PageTemplateComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
  ]
})
export class PageTemplateModule {
}
