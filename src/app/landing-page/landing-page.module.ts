import {NgModule} from '@angular/core';
import {LandingPageComponent} from './landing-page.component';
import {RouterModule} from '@angular/router';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {LayoutModule} from '@angular/cdk/layout';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: LandingPageComponent}]),
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    FlexLayoutModule
  ],
})
export class LandingPageModule {
}
