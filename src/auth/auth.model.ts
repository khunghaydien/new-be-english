export interface LoginResponse extends TokenResponse {
    user: any;
}
export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}