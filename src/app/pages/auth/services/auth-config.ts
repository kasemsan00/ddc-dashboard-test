import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig =
{
    "issuer": "https://d1422-accounts.ddc.moph.go.th/auth/realms/d1422", // https://eid-accounts.ddc.moph.go.th/auth/realms/master
    "oidc": true,
    "redirectUri": window.location.origin + '/',
    "clientId": "D1422_iQM", // D1422_Develop, D1422_iQM
    "scope": "openid",
    "responseType": "code",
    // "dummyClientSecret": "LDcqkVQbHF83MIQLyAj04CPAE5IqcMX6"
}
