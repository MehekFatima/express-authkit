import jwt,{SignOptions} from 'jsonwebtoken';
import { TokenOptions, TokenPayload, TokenPair } from './types';

export class TokenManager {
  private accessOptions: TokenOptions;
  private refreshOptions: TokenOptions;

  constructor(accessOptions: TokenOptions, refreshOptions: TokenOptions) {
    this.accessOptions = accessOptions;
    this.refreshOptions = refreshOptions;
  }

  signTokens(payload: TokenPayload): TokenPair {
    const accessToken = jwt.sign(payload, this.accessOptions.secret, {
      expiresIn: this.accessOptions.expiresIn
    } as SignOptions);

    const refreshToken = jwt.sign(payload, this.refreshOptions.secret, {
      expiresIn: this.refreshOptions.expiresIn
    } as SignOptions);

    return { accessToken, refreshToken };
  }

  verifyAccess(token: string): TokenPayload {
    return jwt.verify(token, this.accessOptions.secret) as TokenPayload;
  }

  verifyRefresh(token: string): TokenPayload {
    return jwt.verify(token, this.refreshOptions.secret) as TokenPayload;
  }

  decode(token: string): TokenPayload | null {
    const decoded = jwt.decode(token);
    if (typeof decoded === 'object' && decoded !== null) {
      return decoded as TokenPayload;
    }
    return null;
  }
}
