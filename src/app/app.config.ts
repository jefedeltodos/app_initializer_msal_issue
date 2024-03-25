import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter, withDisabledInitialNavigation, withEnabledBlockingInitialNavigation } from '@angular/router';
import { routes } from './app.routes';
import { AppStartService } from './services/app-start.service';
import { ApiResponse, SpaEnvironment } from './models';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { BrowserCacheLocation, BrowserUtils, IPublicClientApplication, InteractionType, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalService } from '@azure/msal-angular';
import { Observable } from 'rxjs';

function appInitObservable(appStartService: AppStartService): () => Observable<ApiResponse<SpaEnvironment>> {
  console.info('appInit called');
  return () => appStartService.initObservable('./assets/config.json');
}
function appInitPromise(appStartService: AppStartService): () => Promise<ApiResponse<SpaEnvironment>> {
  console.info('appInit called');
  return () => appStartService.initPromise('./assets/config.json');
}

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

export function MSALInstanceFactory(appEnvironmentService: AppStartService): IPublicClientApplication {
  console.info('MSALInstanceFactory')

  const env = appEnvironmentService.getEnv();

  return new PublicClientApplication({
    auth: {
      clientId: env.msalConfig.auth.clientId,
      authority: env.msalConfig.auth.authority,
      redirectUri: '/',
      postLogoutRedirectUri: '/'
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage
    },
    system: {
      allowNativeBroker: false, // Disables WAM Broker
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false
      }
    }
  });
}

export function MSALInterceptorConfigFactory(appEnvironmentService: AppStartService): MsalInterceptorConfiguration {
  console.info('MSALInterceptorConfigFactory');

  const env = appEnvironmentService.getEnv();

  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(env.apiConfig.uri, env.apiConfig.scopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}


export function MSALGuardConfigFactory(appEnvironmentService: AppStartService): MsalGuardConfiguration {
  console.info('MSALGuardConfigFactory called');
  const env = appEnvironmentService.getEnv();
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [...env.apiConfig.scopes]
    },
    loginFailedRoute: '/login-failed'
  };
}

const initialNavigation = !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup()
    ? withEnabledBlockingInitialNavigation() // Set to enabledBlocking to use Angular Universal
    : withDisabledInitialNavigation();
    
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes, initialNavigation),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitPromise,
      multi: true,
      deps: [AppStartService],
    },
    // MSAL
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
      deps: [AppStartService],
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
      deps: [AppStartService],
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
      deps: [AppStartService],
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
};
