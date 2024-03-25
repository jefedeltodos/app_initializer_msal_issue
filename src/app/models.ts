export interface ApiResponse<T> {
    data: T,
}

export interface SpaEnvironment {
    msalConfig: {
      auth: {
        clientId: string;
        authority: string;
      }
    },
    apiConfig: {
      scopes: string[];
      uri: string;
    }
  }