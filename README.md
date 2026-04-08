# Lagwankar Family Chronicle

A private family newsletter website for the Lagwankar family. Bilingual (English / Kannada), with a public-facing site and a password-protected admin panel.

---

## Features

**Public site**
- Home page with upcoming events, recent events, announcements, and a family spotlight
- Events listing with category and year filters
- Event detail pages with photo galleries
- Upcoming events with countdown timer and calendar export
- Photo gallery with albums
- Family directory with generation filter and birthday highlights
- Interactive family tree (recursive, zoom in/out, click for member details)
- Full-text search across events, members, and announcements
- English / Kannada language toggle

**Admin panel** (`/admin`)
- Dashboard with stats and quick actions
- Create and edit events (bilingual fields, draft / publish workflow)
- Manage family members (add, edit, soft-delete)
- Photo gallery management (upload, delete)
- Family tree editor (inline edit per member)

---

## Tech stack

| Layer | Technology |
|---|---|
| UI framework | React 18 |
| Build tool | Vite 3 |
| Routing | React Router v6 |
| Styling | Tailwind CSS 3 |
| Internationalisation | react-i18next |
| Data layer | Static mock data (no backend) |

All data lives in `src/mock/` as JavaScript files. An in-memory store (`src/mock/store.js`) absorbs admin CRUD operations for the duration of a browser session — data resets on page refresh. To add a real backend, only `src/services/api.js` needs to change.

---

## Prerequisites

| Tool | Minimum version | Check |
|---|---|---|
| Node.js | 18.x | `node -v` |
| npm | 9.x | `npm -v` |

Install Node.js from [nodejs.org](https://nodejs.org) (LTS version recommended). npm is bundled with it.

---

## Local setup

### 1. Clone or download the project

```bash
git clone <your-repo-url>
cd family-newsletter
```

Or if you downloaded a ZIP, extract it and open a terminal in the folder.

### 2. Install dependencies

```bash
npm install
```

This installs React, Vite, Tailwind CSS, react-i18next, and all other packages listed in `package.json`. Takes about 30 seconds.

### 3. Start the development server

```bash
npm run dev
```

Vite starts a local server, typically at `http://localhost:5173`. Open that URL in your browser.

The dev server supports hot module replacement — the browser updates instantly as you edit source files without a full reload.

---

## Admin login

The admin panel is at `/admin/login`.

| Field | Value |
|---|---|
| Email | `admin@family.com` |
| Password | `admin123` |

These credentials are defined in `src/mock/admins.js` and are only for local development.

---

## Project structure

```
family-newsletter/
├── public/                  # Static assets (favicon, etc.)
├── src/
│   ├── components/
│   │   ├── admin/           # Admin layout and shared admin components
│   │   ├── home/            # Home page sections (hero, spotlight, etc.)
│   │   ├── layout/          # Navbar and Footer
│   │   └── ui/              # Shared UI (Badge, Spinner, Toast, etc.)
│   ├── context/             # React contexts (AuthContext, LanguageContext)
│   ├── hooks/               # Custom hooks (useAuth, useLanguage)
│   ├── i18n/
│   │   ├── en.json          # English translations
│   │   └── kn.json          # Kannada translations
│   ├── mock/
│   │   ├── admins.js        # Mock admin credentials
│   │   ├── albums.js        # Mock photo albums
│   │   ├── announcements.js # Mock announcements (births, achievements, etc.)
│   │   ├── events.js        # Mock events (past + upcoming)
│   │   ├── members.js       # 66 family members across 5 generations
│   │   └── store.js         # In-memory mutable store for admin CRUD
│   ├── pages/               # One file per route (public + admin)
│   ├── services/
│   │   └── api.js           # All data access — the only file to change for a real backend
│   ├── App.jsx              # Routes and layout wrappers
│   ├── i18n.js              # i18next initialisation
│   ├── index.css            # Global styles and Tailwind directives
│   └── main.jsx             # React entry point
├── tailwind.config.js       # Custom colours (cream, terracotta, saffron, warmgreen)
├── vite.config.js
└── package.json
```

---

## Available commands

| Command | What it does |
|---|---|
| `npm run dev` | Start local development server with HMR |
| `npm run build` | Compile and bundle for production into `dist/` |
| `npm run preview` | Serve the `dist/` build locally to test before deploying |

---

## Building for production

```bash
npm run build
```

Output goes to `dist/`. The contents of that folder can be deployed to any static host (Vercel, Netlify, Firebase Hosting, GitHub Pages, etc.).

To verify the build locally before deploying:

```bash
npm run preview
```

---

## Troubleshooting

**Blank page after editing files**

Vite's module cache can get stale after large changes. Delete the cache and restart:

```bash
# Delete Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

Then do a hard refresh in the browser (`Ctrl+Shift+R` / `Cmd+Shift+R`).

**Port already in use**

If port 5173 is taken, Vite will try the next available port and print it in the terminal. You can also set a fixed port in `vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
})
```

**`node_modules` missing or corrupted**

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Moving to a real backend

All data access is centralised in `src/services/api.js`. Every exported function returns a `Promise`, mimicking real async behaviour. To connect a real backend:

1. Create your database (Supabase, PostgreSQL, Firebase, etc.)
2. Rewrite the functions in `api.js` to call your API instead of reading from `store.*`
3. Replace the mock auth in `src/context/AuthContext.jsx` with real token-based auth
4. Replace `src/mock/admins.js` credentials with environment variables

No other files need to change.
