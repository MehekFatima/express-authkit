# express-authx

[![npm version](https://img.shields.io/npm/v/express-authx.svg)](https://www.npmjs.com/package/express-authx)
[![npm downloads](https://img.shields.io/npm/dm/express-authx.svg)](https://www.npmjs.com/package/express-authx)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)


## 📚 Table of Contents

- [Why express-authx?](#-why-express-authx)
- [Installation](#installation)
- [Quick Usage](#quick-usage)
- [Role-Based Access](#2-role-based-access)
- [MongoDB Token Blacklisting](#3-mongodb-token-blacklisting-logout)
- [MongoDB Session Storage](#4-mongodb-session-storage-optional)
- [TypeScript Support](#typescript-support)
- [CLI Usage](#cli-usage)


A simple, fully-configurable authentication kit for Express.js apps using JWT, Refresh Tokens, Role-Based Access Control (RBAC), MongoDB sessions, and a powerful CLI – all in TypeScript.

---

##  Why `express-authx`?

Most authentication libraries either:
- Tie you to a third-party service (like Auth0 or Firebase),
- Require too much boilerplate (like Passport.js),
- Or lack refresh/session support entirely (like `jsonwebtoken` alone).

**`express-authx`** solves that by giving you:

- Full control over your auth logic  
- Access token support via Bearer headers and HTTP-only cookies
- Secure access & refresh token support  
- Role-based route protection  
- Optional Mongodb-based session management  
- Powerful CLI for token generation & testing 
- Written in TypeScript, supports JS


---

## Installation

```bash
npm install express-authx
```
## .env Configuration
Create a .env file in your project root and define:

```bash
ACCESS_SECRET=your-access-secret
REFRESH_SECRET=your-refresh-secret
MONGO_URI=mongodb://localhost:27017
```
These are used to securely sign & verify tokens.

## Quick Usage

```ts
import express from 'express';
import cookieParser from 'cookie-parser';
import { TokenManager, authMiddleware, MongoTokenBlacklist } from 'express-authx';

const app = express();
app.use(express.json());
app.use(cookieParser());

const tokenManager = new TokenManager(
  { secret: process.env.ACCESS_SECRET!, expiresIn: '15m' },
  { secret: process.env.REFRESH_SECRET!, expiresIn: '7d' }
);

const blacklist = new MongoTokenBlacklist(process.env.MONGO_URI!);

// IMPORTANT: Initialize MongoTokenBlacklist before use
await blacklist.init();

app.post('/login', (req, res) => {
  const { id, role } = req.body;
  const tokens = tokenManager.signTokens({ id, role });

  res.cookie('accessToken', tokens.accessToken, { httpOnly: true });
  res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
  res.json(tokens);
});

app.get('/profile', authMiddleware(tokenManager, blacklist), (req, res) => {
  res.json({ message: 'Welcome', user: req.user });
});

```

### 2. Role-Based Access

```ts
import { protectMiddleware } from 'express-authx';

app.get('/admin', protectMiddleware(['admin']), (req, res) => {
  res.send('Admins only');
});

```
### 3. MongoDB Token Blacklisting (Logout)

```ts
import { MongoTokenBlacklist } from 'express-authx';

const blacklist = new MongoTokenBlacklist(process.env.MONGO_URI!);
await blacklist.init();

await blacklist.blacklistToken(token, expiryInSeconds);

```

##### This invalidates tokens for logout purposes.

### 4. MongoDB Session Storage (Optional)
```ts
import { MongoSessionStore } from 'express-authx';

const sessionStore = new MongoSessionStore(process.env.MONGO_URI);

await sessionStore.saveSession({
  userId: 'demoUser',
  sessionId: 'uuid-session-id',
  ip: '::1',
  userAgent: 'browser-info',
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
});
```

## TypeScript Support

>Note: If you're using plain JavaScript, req.user is available without any additional setup.

If you're using TypeScript, you need to tell Express that your `req.user` property exists.

Create a file like `types/express-authx.d.ts` in your project:

```ts
// types/express-authx.d.ts
import 'express';
import type { TokenPayload } from 'express-authx';

declare module 'express-serve-static-core' {
  interface Request {
    user?: TokenPayload;
  }
}
```
Then include this file in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "typeRoots": ["./types", "./node_modules/@types"]
  }
}
```




## CLI Usage

The CLI saves you time while developing or testing. Use it to generate, decode, or refresh tokens instantly. This CLI provides 6 core commands

> Run any command below with `npx express-authx` OR install globally with `npm i -g express-authx`.

### 1. Create a new user token
Purpose: Generate a new access and refresh token for a user.

```bash
npx express-authx create-user --id <user-id> --role <user-role>
```
#### Example
```bash
npx express-authx create-user --id=joe --role=admin
```
You’ll get:

```yaml
✅ User created!
Access Token: <...>
Refresh Token: <...>
```

### 2. sign-token
#### Purpose: Sign an arbitrary payload (e.g., ID and role) into a token.

```bash
npx express-authx sign-token --id <user-id> --role <role>
```
#### Optional

- `--access-secret <secret>`

- `--access-expiry <expiry>`

#### Example

```bash
npx express-authx sign-token --id=alice --role=moderator --access-secret=mysecret
```


### 3. Verify a token
#### Purpose: Verify the validity of a JWT (access or refresh).

#### Optional:

- `--refresh` — Verifies using refresh token logic

- `--access-secret <secret>` — Provide secret manually

```bash
npx express-authx verify-token --token <jwt-token>
```
#### Example:

- Access token:
```bash
npx express-authx verify-token --token <access-token>
```
- Refresh token:
```bash
npx express-authx verify-token --token <your-refresh-token> --refresh
```

> 💡 If you're using MongoDB blacklisting, always pass the `--mongo` flag when verifying a token. Otherwise, the blacklist won’t be checked.

### 4. Decode a token (without verifying)
#### Purpose: Decode a JWT without verifying the signature.

```bash
npx express-authx decode-token --token <jwt-token>

```

#### Example
```bash
npx express-authx decode-token --token <your-token>
```
You’ll get:
```json
{
  "id": "user123",
  "role": "admin",
  "iat": 1751550000,
  "exp": 1751553600
}
```

### 5. Refresh an expired access token
#### Purpose: Refresh an expired access token using a valid refresh token.

```bash
npx express-authx refresh-token --refresh-token <refresh-token>
```
#### Optional
- `--access-secret <secret>`

- `--refresh-secret <secret>`

- `--access-expiry <expiry>`

- `--refresh-expiry <expiry>`

### 6. Logout a Token (Blacklist via MongoDB)
#### Purpose: Invalidate an access token by blacklisting it in MongoDB. Once blacklisted, the token will be rejected on all protected routes.

#### Usage:
```bash
npx express-authx logout-token --token <token> --mongo <mongo-uri>

```
##### Try to Verify Again
```bash
npx express-authx verify-token --token <token> --mongo mongodb://localhost:27017
```

### 7. Set Cookie Token (Dev/Test Server)

#### Purpose:  Starts a small Express server that signs an access token and sets it as an HTTP-only cookie.  

#### Usage:

```bash
npx express-authx set-cookie-token --id <user-id> --role <user-role> [options]
```

#### Required Options:
- `--id <id> `— User ID to embed in the token

- `--role <role>` — User role to embed in the token

#### Optional:
- `--access-secret <secret>` — Secret key for signing the access token (default: process.env.ACCESS_SECRET or 'default-access')

- `--access-expiry <expiry>` — Access token expiry duration (default: '15m')

- `--port <port>` — Port for the test server (default: 4000)

### To view help for all commands at once:

```bash
npx express-authx --help
```

#### Contributions are always welcome!

See `contributing.md` for ways to get started.

[![Made with ❤️ by Mehek](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F%20by%20Mehek-blueviolet)](https://github.com/MehekFatima)