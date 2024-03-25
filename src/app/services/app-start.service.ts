import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, SpaEnvironment } from '../models';
import { Observable, firstValueFrom, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStartService {
  private httpClient: HttpClient;
  
  private _env: SpaEnvironment | undefined;

  constructor(httpBackend: HttpBackend) {
    this.httpClient = new HttpClient(httpBackend);
  }
  
  public initObservable(url: string): Observable<ApiResponse<SpaEnvironment>> {
    return this.httpClient.get<ApiResponse<SpaEnvironment>>(url);
  }

  public initPromise(url: string): Promise<ApiResponse<SpaEnvironment>> {
    return new Promise<ApiResponse<SpaEnvironment>>(async (resolve, reject) => {
      try {
        var config = await firstValueFrom(
          this.httpClient.get<ApiResponse<SpaEnvironment>>(url)
            .pipe(tap(resp => this._env = resp.data))
        );
        console.info("got config:", config);
        resolve(config)
      } catch (e) {
        reject(e);
      }

    });
  }

  public getEnv(): SpaEnvironment {
    if (this._env === undefined) {
      throw new Error('Environment is uninitialized');
    }

    return this._env;
  }
}
