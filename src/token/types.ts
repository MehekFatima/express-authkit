export interface TokenPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface TokenOptions {
  secret: string;
  expiresIn: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
