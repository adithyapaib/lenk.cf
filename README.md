# LENK.CF

LENK.CF is an open-source URL shortener built for Vercel serverless deployment with MongoDB for persistence, Redis for caching, and a no-framework frontend. It ships with a custom-branded landing page, custom alias support, Redis-backed redirect acceleration, a lightweight PWA setup, and a small JSON API.

The current frontend uses a dark editorial design system with an animated intro sequence, SEO and GEO metadata, and a redesigned 404 experience.

## Highlights

- Shorten long URLs with generated short IDs.
- Create custom aliases with validation for letters, numbers, `_`, and `-`.
- Cache both `url -> shortId` and `shortId -> url` in Redis to reduce database lookups.
- Redirect short links with permanent `301` redirects.
- Serve a static landing page and error page through Vercel routing.
- Expose a simple API for creation, redirects, discovery, and listing.
- Include a minimal service worker for PWA-style asset caching.
- Ship a metadata-rich homepage with Open Graph, Twitter Card, canonical, and JSON-LD schema.

## Stack

### Frontend

- HTML
- CSS / SCSS assets
- Vanilla JavaScript
- Service Worker

### Backend

- Node.js serverless functions on Vercel
- MongoDB with Mongoose
- Redis v3 client for caching and shared utility helpers

### Infrastructure

- Vercel routing via [vercel.json](vercel.json)
- MongoDB Atlas or any reachable MongoDB deployment
- Redis Cloud or any reachable Redis instance

## How It Works

1. The landing page at `/` serves the static UI from `static/index.html`.
2. A random short link is created through `GET /p/<encodedUrl>`.
3. A custom short link is created through `POST /custom` with `{ url, shortId }`.
4. Redirects are resolved through the catch-all route and served by `api/redirect.js`.
5. MongoDB stores canonical records.
6. Redis stores hot lookups to avoid repeated database reads.

## Current Feature Set

### URL Creation

- Random IDs are generated in `api/p.js`.
- Existing URLs are reused when already present in the database.
- Custom aliases are rejected if the alias already exists.

### Redirect Resolution

- Cached short IDs return immediately from Redis.
- Cache misses fall back to MongoDB.
- Missing records redirect to `/404`.

### Frontend Experience

- Intro loading animation that visually compresses a long URL into a short link.
- Inline result section with copy-to-clipboard support.
- Domains panel for alternate domains.
- Toast notifications for success and error states.

### Metadata / Discoverability

- Canonical URL
- Open Graph and Twitter metadata
- Geographic metadata
- JSON-LD for `WebApplication` and `FAQPage`

## Project Structure

```text
.
|-- api/
|   |-- _lib/
|   |   |-- cache.js
|   |   |-- db.js
|   |   `-- rate-limit.js
|   |-- all.js
|   |-- custom.js
|   |-- index.js
|   |-- p.js
|   `-- redirect.js
|-- models/
|   `-- model.js
|-- static/
|   |-- 404.html
|   |-- index.html
|   `-- assets/
|       |-- robots.txt
|       |-- script.js
|       |-- styles.css
|       |-- styles.scss
|       `-- sw.js
|-- LICENSE
|-- README.md
|-- package.json
`-- vercel.json
```

## Runtime Requirements

- Node.js 18+
- A MongoDB database
- A Redis instance
- Vercel CLI for local serverless development

## Environment Variables

Create a `.env` file in the project root for local development.

```env
DB=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/lenk-cf?retryWrites=true&w=majority
REDIS_URL=redis://default:<password>@<host>:<port>
```

### Variable Reference

| Variable | Required | Purpose |
| :-- | :-- | :-- |
| `DB` | Yes | MongoDB connection URI used by `api/_lib/db.js` |
| `REDIS_URL` | Yes in practice | Redis connection used by cache helpers and shared Redis utilities |

Notes:

- `api/_lib/db.js` connects with `dbName: 'lenk-cf'`.
- `api/_lib/rate-limit.js` falls back to `redis://127.0.0.1:6379` if `REDIS_URL` is missing, but the app expects Redis to be available for normal operation.

## Local Development

This repository does not define npm scripts. Use the Vercel CLI directly.

### 1. Clone the repository

```bash
git clone https://github.com/adithyapaib/lenk.cf
cd lenk.cf
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create `.env` as shown above.

### 4. Start local development

```bash
npx vercel dev
```

The app is typically available at `http://localhost:3000`.

## Deploying to Vercel

### 1. Install the Vercel CLI

```bash
npm install -g vercel
```

### 2. Authenticate and link the project

```bash
vercel
```

### 3. Configure environment variables in Vercel

Add these in the Vercel project settings:

- `DB`
- `REDIS_URL`

### 4. Deploy

```bash
vercel deploy
```

## API Overview

All endpoints are served from the same Vercel deployment domain.

### `GET /`

Returns the static homepage UI.

### `GET /api`

Returns a JSON object with server status, route hints, domains, and credits.

Example response shape:

```json
{
  "server": "online",
  "end_points": [
    {"/": "index.html"},
    {"/p/<url>": "Creates a new shortID for the url sent or returns an existing shortID."}
  ],
  "source": "https://github.com/adithyapaib/lenk.cf"
}
```

### `GET /p/<encodedUrl>`

Creates or reuses a short ID for a URL.

Example:

```http
GET /p/https%3A%2F%2Fexample.com%2Fdocs%2Fintro
```

Success response:

```json
"Ab3"
```

Behavior:

- Validates the decoded URL.
- Returns a cached short ID when available.
- Reuses an existing database record for the same URL.
- Generates a 3-character ID and falls back to 5 characters if the first candidate collides.

### `POST /custom`

Creates a short link with a user-specified alias.

Request:

```http
POST /custom
Content-Type: application/json
```

```json
{
  "url": "https://example.com",
  "shortId": "myalias"
}
```

Success response:

```json
"myalias"
```

Conflict response:

```json
0
```

Validation:

- `url` is required and must parse with `new URL(...)`.
- `shortId` is required.
- `shortId` must match `^[a-zA-Z0-9_-]+$`.

### `GET /all`

Returns all stored documents, prefixed with a count object.

Example response shape:

```json
[
  { "numberOfShortURLS": 2 },
  { "_id": "...", "url": "https://example.com", "shortId": "Ab3" },
  { "_id": "...", "url": "https://example.org", "shortId": "docs" }
]
```

### `GET /<shortId>`

Redirects with HTTP `301` to the original URL.

Behavior:

- Uses Redis first.
- Falls back to MongoDB.
- Redirects to `/404` when no matching short ID exists.
- Normalizes stored URLs by prepending `https://` if a protocol is missing during redirect.

### `GET /404`

Returns the branded not-found page.

## Vercel Routing

Routing is defined in [vercel.json](vercel.json).

Key mappings:

- `/` -> `static/index.html`
- `/css` -> `static/assets/styles.css`
- `/js` -> `static/assets/script.js`
- `/serviceworker` -> `static/assets/sw.js`
- `/robots.txt` -> `static/assets/robots.txt`
- `/p/...` -> `api/p.js`
- `/custom` requests are handled by `api/custom.js`
- `/all` -> `api/all.js`
- `/api` -> `api/index.js`
- catch-all fallback route -> `api/redirect.js`

## Data Model

MongoDB documents are stored through the Mongoose model in [models/model.js](models/model.js).

Schema:

```js
{
  url: String,
  shortId: String
}
```

There are no explicit schema indexes or uniqueness constraints at the model level right now. Uniqueness is enforced in route logic.

## Cache Strategy

Redis is used by `api/_lib/cache.js` and shared by the route handlers.

| Cache Key | Value | TTL | Used By |
| :-- | :-- | :-- | :-- |
| `url:<longUrl>` | `shortId` | 7 days | `api/p.js`, `api/custom.js` |
| `shortid:<shortId>` | destination URL | 30 days | `api/p.js`, `api/custom.js`, `api/redirect.js` |
| `all` | serialized JSON array | 30 seconds | `api/all.js` |

## Security Headers

Current handlers set a small set of response headers:

- `api/p.js`: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`
- `api/custom.js`: `X-Content-Type-Options`, `X-Frame-Options`
- `api/redirect.js`: `X-Content-Type-Options`, `Referrer-Policy`

## Rate Limiting

`api/_lib/rate-limit.js` exposes a Redis-backed helper:

- `getRedisClient()`
- `checkRateLimit(ip, limit = 100, windowSec = 3600)`

At the moment, the helper exists but is not wired into the public route handlers. That means the repository includes rate-limit infrastructure, but requests are not currently being blocked by it.

## PWA Notes

The service worker in `static/assets/sw.js` is intentionally minimal.

Current behavior:

- Caches `./` and `/css` during install.
- Claims clients on activation.
- Does not currently implement runtime fetch handling.

## Frontend Notes

The current homepage includes:

- Intro overlay animation
- Copy-to-clipboard result state
- Alternate domain panel
- Toast-based status feedback
- SEO, GEO, and social metadata
- JSON-LD structured data

## Alternate Domains

The UI currently advertises these domains:

- `https://lenk.cf`
- `https://nani.cf`
- `https://4543.ml`
- `https://urml.ml`

Availability depends on DNS, hosting status, and whether those domains are still pointed at the deployed project.

## Limitations and Implementation Notes

- No npm scripts are defined in `package.json`.
- The API is intentionally simple and does not include authentication.
- `/all` exposes all stored records and should be treated carefully in public deployments.
- Alias uniqueness is handled in application logic rather than database constraints.
- The rate-limit helper is present but not enforced.
- The service worker is partial rather than a full offline strategy.

## Example cURL Requests

### Create a random short link

```bash
curl "http://localhost:3000/p/https%3A%2F%2Fexample.com%2Fguide"
```

### Create a custom short link

```bash
curl -X POST "http://localhost:3000/custom" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","shortId":"docs"}'
```

### Inspect the API index

```bash
curl "http://localhost:3000/api"
```

### List all stored links

```bash
curl "http://localhost:3000/all"
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).

## Credits

- Project: Adithya Pai
- Site: https://adithyapai.com
- Source: https://github.com/adithyapaib/lenk.cf
# ❤️ lenk.cf

A fast, open-source URL shortener built with Node.js, MongoDB, and Vercel serverless functions. Features Redis caching for near-instant redirects, a custom alias system, a Progressive Web App (PWA) frontend, and a simple REST API.

&nbsp;

## Tech Stack

**Client:** HTML, SCSS, Vanilla JS, PWA (Service Worker)

**Server:** Node.js, MongoDB (Mongoose), Redis, Vercel Serverless Functions

&nbsp;

## 🎦 Screenshots

![App Screenshot](https://raw.githubusercontent.com/adithyapaib/lenk.cf/main/static/screenshots/Screenshot%20(23).png)

&nbsp;

## 💻 Requirements

- Node.js 18+
- MongoDB Atlas cluster
- Redis instance (e.g. Redis Cloud)
- Vercel CLI

&nbsp;

## 🌐 Deployment

**1. Install Vercel CLI**

```bash
npm i -g vercel
```

**2. Set up MongoDB Atlas**

Go to [MongoDB Atlas](https://cloud.mongodb.com/), create a cluster, and copy the Node.js connection URI.

**3. Set up Redis**

Create a free Redis instance at [Redis Cloud](https://redis.com/try-free/) and copy the connection URL.

**4. Clone and install**

```bash
git clone https://github.com/adithyapaib/lenk.cf
cd lenk.cf
npm i
```

**5. Create `.env`**

```env
DB=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/lenk-cf?retryWrites=true&w=majority
REDIS_URL=redis://default:<password>@<host>:<port>
```

**6. Run locally**

```bash
vercel dev
```

App runs at `http://localhost:3000`.

**7. Deploy to Vercel**

```bash
vercel deploy
```

Add `DB` and `REDIS_URL` as Environment Variables in your Vercel project settings.

&nbsp;

## 💢 API Reference

All endpoints are available at `http://localhost:3000` locally or your Vercel domain in production.

&nbsp;

#### GET `/api` — API info

Returns server status and a list of all endpoints.

&nbsp;

#### GET `/<shortId>` — Redirect

Resolves a short ID and redirects to the original URL (301). Results are cached in Redis for **30 days**.

&nbsp;

#### GET `/p/<encodedUrl>` — Create short link (random alias)

```
GET /p/https%3A%2F%2Fexample.com%2Fsome%2Flong%2Fpath
```

| Parameter | Description |
| :-------- | :---------- |
| `encodedUrl` | **Required.** The long URL, [encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)-encoded. |

Returns the generated `shortId` as a JSON string. Cached for **7 days**.

&nbsp;

#### POST `/custom` — Create short link (custom alias)

```
POST /custom
Content-Type: application/json

{ "url": "https://example.com", "shortId": "myalias" }
```

| Field | Description |
| :---- | :---------- |
| `url` | **Required.** The long URL to shorten. |
| `shortId` | **Required.** Your custom alias (letters, numbers, hyphens, underscores). |

Returns the `shortId` string on success, or `0` if the alias is already taken. Cached for **30 days**.

&nbsp;

#### GET `/all` — List all short links

Returns all documents in the database, prefixed with a count. Cached for **30 seconds**.

&nbsp;

#### GET `/404` — Not found page

Shown when a short ID doesn't exist in the database.

&nbsp;

## 🛰 Environment Variables

| Variable | Description |
| :------- | :---------- |
| `DB` | MongoDB connection URI |
| `REDIS_URL` | Redis connection URL |

&nbsp;

## 🚦 Caching

| Cache key | TTL | Used in |
| :-------- | :-- | :------ |
| `shortid:<id>` → URL | 30 days | `redirect.js`, `p.js`, `custom.js` |
| `url:<url>` → shortId | 7 days | `p.js`, `custom.js` |
| `all` → JSON list | 30 seconds | `all.js` |

&nbsp;

## 🌐 Domains

- [https://lenk.cf](https://lenk.cf)

&nbsp;

## 🚦 Acknowledgements

- 🙋🏼‍♂️ Follow me on [GitHub](https://github.com/adithyapaib/) and star ⭐ this repo!

&nbsp;

## 📑 License

[MIT](https://choosealicense.com/licenses/mit/)

&nbsp;
