[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

# express-authkit

Plug-and-play authentication middleware for Express with JWT, refresh tokens, role-based access control (RBAC), session management (Redis), and a built-in CLI.

---

## Features

- Easy JWT access and refresh token management
- Middleware to protect Express routes and attach user info
- Role-based access control support
- Session management using Redis
- CLI to generate tokens, create users, and verify tokens
- Written in TypeScript with full type definitions
- Testable with Jest and support for Redis mocking

---

## Installation

```bash
npm install express-authkit
```
## Usage

### Token Manager and Middleware

```ts
import express from 'express';
import { TokenManager, authMiddleware } from 'express-authkit';

const tokenManager = new TokenManager(
  { secret: process.env.ACCESS_SECRET!, expiresIn: '15m' },
  { secret: process.env.REFRESH_SECRET!, expiresIn: '7d' }
);

const app = express();

app.use(authMiddleware(tokenManager));

app.get('/protected', (req, res) => {
  res.json({ user: req.user }); // req.user added by middleware
});

app.listen(3000);

```

* * *

### Redis Store (Optional)

```ts
import { RedisStore } from 'express-authkit';

const redisStore = new RedisStore('redis://localhost:6379');
```

* * *

### CLI

```bash
npx express-authkit create-user --id=mehek --role=admin 

npx express-authkit verify-token --token <your-token>
```