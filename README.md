# express-authx

[![npm version](https://img.shields.io/npm/v/express-authx.svg)](https://www.npmjs.com/package/express-authx)

[![npm downloads](https://img.shields.io/npm/dm/express-authx.svg)](https://www.npmjs.com/package/express-authx)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

[![Made with ❤️ by Mehek](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F%20by%20Mehek-blueviolet)](https://github.com/MehekFatima)

> A simple, fully-configurable authentication kit for Express.js apps using JWT, Refresh Tokens, Role-Based Access Control (RBAC), Redis sessions, and a powerful CLI – all in TypeScript.

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

1. Protect Express Routes with Middleware

```ts
import express from 'express';
import { TokenManager, authMiddleware } from 'express-authx';

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

2. Role-Based Access

```ts
import { protectMiddleware } from 'express-authx';

app.get('/admin-only', protectMiddleware(['admin']), (req, res) => {
  res.send('Only admins allowed');
});
```
3. Redis Session Store

```ts
import { RedisStore } from 'express-authx';

const redisStore = new RedisStore('redis://localhost:6379');

await redisStore.setSession('user123', { isLoggedIn: true });
const data = await redisStore.getSession('user123');
```
## CLI Usage

The CLI saves you time while developing or testing. Use it to generate, decode, or refresh tokens instantly.

> Run any command below with `npx express-authkit` OR install globally with `npm i -g express-authx`.

1. Create a new user token

```bash
npx express-authkit create-user --id=joe --role=admin
```
You’ll get:

```yaml
✅ User created!
Access Token: <...>
Refresh Token: <...>
```
2. Verify a token

```bash
npx express-authkit verify-token --token <your-token>
```
You can also verify refresh token:
```bash
npx express-authkit verify-token --token <your-refresh-token> --refresh=true
```
3. Decode a token (without verifying)
```bash
npx express-authkit decode-token --token <your-token>
```
4. Refresh an expired access token
```bash
npx express-authkit refresh-token --refresh <your-refresh-token>
```

Contributions are always welcome!

See `contributing.md` for ways to get started.