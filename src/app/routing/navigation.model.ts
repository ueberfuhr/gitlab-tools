/**
 * An entry that is made into the navigation.
 */
import {LoadChildrenCallback} from '@angular/router';
import {InjectionToken} from '@angular/core';

export interface NavigationEntry {

  /**
   * The label of the navigation entry.
   */
  label: string,
  /**
   * A short description of this action.
   */
  description?: string,
  /**
   * The route.
   */
  route: {
    path: string,
    loadChildren: LoadChildrenCallback
  },
  /**
   * The material icon, if any should be shown.
   */
  icon?: string

}

export const NAVIGATION_ENTRIES_VALUE: NavigationEntry[] = [
  {
    route: {
      path: '',
      loadChildren: () => import('../landing-page/landing-page.module').then(m => m.LandingPageModule)
    },
    label: 'Home',
    icon: 'home'
  },
  {
    route: {
      path: 'issues',
      loadChildren: () => import('../gitlab-issues/gitlab-issues.module').then(m => m.GitlabIssuesModule)
    },
    label: 'Issues',
    description: 'Import and Export Issues from a Project, including labels.',
    icon: 'style'
  }
];

export const NAVIGATION_ENTRIES = new InjectionToken<NavigationEntry[]>("Application navigation entries.");
