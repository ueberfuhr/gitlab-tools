import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./routing-landing-pages/landing-page/landing-page.module').then(m => m.LandingPageModule)
  },
  {
    path: 'issues',
    loadChildren: () => import('./routing-landing-pages/issues-landing-page/issues-landing-page.module').then(m => m.IssuesLandingPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
