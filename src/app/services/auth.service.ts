import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly oauthService: OAuthService) { }

  login() {
    //
  }

  logout() {
    this.oauthService.logOut()
  }

  getIdentityClaims() {
    return this.oauthService.getIdentityClaims()
  }

  getGrantedScopes() {
    return this.oauthService.getGrantedScopes()
  }

  getAccessToken() {
    return this.oauthService.getAccessToken()
  }

  getAccessTokenExpiration() {
    return this.oauthService.getAccessTokenExpiration()
  }

  hasValidAccessToken() {
    return this.oauthService.hasValidAccessToken()
  }

  authorizationHeader() {
    return this.oauthService.authorizationHeader()
  }
}
