import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NAVIGATION_ENTRIES, NAVIGATION_ENTRIES_VALUE} from './navigation.model';

@NgModule({
  imports: [
    RouterModule.forRoot(NAVIGATION_ENTRIES_VALUE.map(entry => entry.route))
  ],
  providers: [
    {provide: NAVIGATION_ENTRIES, useValue: NAVIGATION_ENTRIES_VALUE}
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
