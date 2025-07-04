# express-authx

[![npm version](https://img.shields.io/npm/v/express-authx.svg)](https://www.npmjs.com/package/express-authx)
[![npm downloads](https://img.shields.io/npm/dm/express-authx.svg)](https://www.npmjs.com/package/express-authx)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)


A simple, fully-configurable authentication kit for Express.js apps using JWT, Refresh Tokens, Role-Based Access Control (RBAC), Redis sessions, and a powerful CLI – all in TypeScript.

---

##  Why `express-authx`?

Most authentication libraries either:
- Tie you to a third-party service (like Auth0 or Firebase),
- Require too much boilerplate (like Passport.js),
- Or lack refresh/session support entirely (like `jsonwebtoken` alone).

**`express-authx`** solves that by giving you:

- Full control over your auth logic  
- Secure access & refresh token support  
- Role-based route protection  
- Optional Redis-based session management  
- Developer CLI to generate/verify/refresh tokens  
- Super easy plug-and-play setup

---

## Installation

```bash
npm install express-authx
```
## .env Configuration
Create a .env file in your project root and define:

```bash
ACCESS_SECRET=your_access_token_secret
REFRESH_SECRET=your_refresh_token_secret
```
These are used to securely sign & verify tokens.

## Quick Start

### 1. Protect Express Routes with Middleware

```ts
import express from 'express';
import { TokenManager, authMiddleware } from 'express-authx';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const tokenManager = new TokenManager(
  { secret: process.env.ACCESS_SECRET!, expiresIn: '15m' },
  { secret: process.env.REFRESH_SECRET!, expiresIn: '7d' }
);

// Attach middleware to secure routes
app.use(authMiddleware(tokenManager));

app.get('/protected', (req, res) => {
  res.json({ message: 'Hello Secure World!', user: req.user });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### 2. Role-Based Access

```ts
import { protectMiddleware } from 'express-authx';

app.get('/admin-only', protectMiddleware(['admin']), (req, res) => {
  res.send('Only admins allowed');
});
```
### 3. Redis Session Store

```ts
import { RedisStore } from 'express-authx';

const redisStore = new RedisStore('redis://localhost:6379');

await redisStore.setSession('user123', { isLoggedIn: true });
const data = await redisStore.getSession('user123');
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

The CLI saves you time while developing or testing. Use it to generate, decode, or refresh tokens instantly. This CLI provides 5 core commands

> Run any command below with `npx express-authkit` OR install globally with `npm i -g express-authx`.

### 1. Create a new user token
Purpose: Generate a new access and refresh token for a user.

```bash
npx express-authkit create-user --id <user-id> --role <user-role>
```
#### Example
```bash
npx express-authkit create-user --id=joe --role=admin
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
npx express-authkit sign-token --id <user-id> --role <role>
```
#### Optional

- `--access-secret <secret>`

- `--access-expiry <expiry>`

#### Example

```bash
npx express-authkit sign-token --id=alice --role=moderator --access-secret=mysecret
```


### 3. Verify a token
#### Purpose: Verify the validity of a JWT (access or refresh).

#### Optional:

- `--refresh` — Verifies using refresh token logic

- `--access-secret <secret>` — Provide secret manually

```bash
npx express-authkit verify-token --token <jwt-token>
```
#### Example:

- Access token:
```bash
npx express-authkit verify-token --token <access-token>
```
- Refresh token:
```bash
npx express-authkit verify-token --token <your-refresh-token> --refresh
```
### 4. Decode a token (without verifying)
#### Purpose: Decode a JWT without verifying the signature.

```bash
npx express-authkit decode-token --token <jwt-token>

```

#### Example
```bash
npx express-authkit decode-token --token <your-token>
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
npx express-authkit refresh-token --refresh-token <refresh-token>
```
#### Optional
- `--access-secret <secret>`

- `--refresh-secret <secret>`

- `--access-expiry <expiry>`

- `--refresh-expiry <expiry>`

### To view help for all commands at once:

```bash
npx express-authkit --help
```

#### Contributions are always welcome!

See `contributing.md` for ways to get started.

[![Made with ❤️ by Mehek](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F%20by%20Mehek-blueviolet)](https://github.com/MehekFatima)