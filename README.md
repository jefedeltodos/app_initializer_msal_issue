# MsalTest

This is a project that demonstrates that the `MSAL_GUARD_CONFIG` factory is called before the `APP_INITIALIZER` code is completed.

[From Angular's documentation](https://angular.io/api/core/APP_INITIALIZER)
> The provided functions are injected at application startup and executed during app initialization. If any of these functions returns a Promise or an Observable, initialization does not complete until the Promise is resolved or the Observable is completed.


## Steps to reproduce
1. Install the dependencies with `npm i`
2. Start the application with `npm start`
3. Open http://localhost:4200 in a browser.

### Expected Results
1. The `APP_INITIALIZER` is invoked and resolved.
2. The `MSAL_GUARD_CONFIG` factory is invoked (along with the other *MSAL* components)
3. The application loads successfully in the browser.

### Actual Results
1. The `APP_INITIALIZER` is invoked, but the `Promise` has not resolved.
2. The `MSAL_GUARD_CONFIG` factory is invoked, but it is dependent on the `APP_INITIALIZER` promise resolving.
3. An Error is thrown because the startup config values are unavailable because the `APP_INITIALIZER` promise hasn't yet resolved.
4. The `APP_INITIAIZER` promise is resolved, and the config values are ready.
5. The application does not load in the browser.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
