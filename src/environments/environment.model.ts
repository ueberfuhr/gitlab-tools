import {InjectionToken} from '@angular/core';

/**
 * The static environment that is set at build time.
 */
export interface Environment {
  /**
   * A flag indicating whether we run in production mode or not.
   */
  production: boolean,
}

/**
 * The injection token to get the environment configuration.
 * You can get it injected by using constructor parameter
 * <pre>
 *   @Inject(ENVIRONMENT) environment: Environment
 * </pre>
 */
export const ENVIRONMENT = new InjectionToken<Environment>('environment');
