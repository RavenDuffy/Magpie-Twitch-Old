export interface AuthResponse {
  access_token: string
  expires_in: number
  token_type: string
}

export interface Auth extends AuthResponse {
  expires_on: number
}
