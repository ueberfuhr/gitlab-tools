import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {NAVIGATION_ENTRIES, NavigationEntry} from '../routing/navigation.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy {

  handset = false;
  private handSetSubscription?: Subscription;

  constructor(private readonly breakpointObserver: BreakpointObserver,
              @Inject(NAVIGATION_ENTRIES) private readonly _navigation: NavigationEntry[]) {
  }

  get navigation(): NavigationEntry[] {
    return this._navigation.filter(entry => entry.route.path.length > 0);
  }

  ngOnInit(): void {
    this.handSetSubscription = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .subscribe(state => this.handset = state.matches);
  }

  ngOnDestroy(): void {
    this.handSetSubscription?.unsubscribe();
  }

}
