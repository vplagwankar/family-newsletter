# Lagwankar Family Chronicle

A private family newsletter website for the Lagwankar family. Bilingual (English / Kannada), with a public-facing site, a password-protected admin panel, and an ASP.NET Core backend API.

---

## Features

**Public site**
- Home page with upcoming events, recent events, announcements, and a family spotlight
- Events listing with category and year filters
- Event detail pages with photo galleries
- Upcoming events with countdown timer and calendar export
- Calendar view
- Photo gallery with albums
- Family directory with generation filter and birthday highlights
- Interactive family tree (recursive, zoom in/out, click for member details)
- Full-text search across events, members, and announcements
- English / Kannada language toggle (preference saved in `localStorage`)

**Admin panel** (`/admin/login`)
- JWT-based login
- Dashboard with stats and quick actions
- Create and edit events (bilingual fields, draft / publish workflow)
- Manage family members (add, edit, soft-delete)
- Photo gallery management (upload, delete)
- Family tree editor (inline edit per member)

---

## Architecture

The repo contains two apps:

| Part | Folder | Technology |
|---|---|---|
| Frontend (SPA) | `src/` | React 18, Vite 3, React Router v6, Tailwind CSS 3, react-i18next |
| Backend API | `api/` | ASP.NET Core (.NET 8), JWT bearer auth |

The frontend calls the API over HTTP. All data access is in `src/services/api.js`, and login/session handling is in `src/services/authService.js`. Both currently use a hard-coded base URL of `http://localhost:5000/api`.

**Data is not persistent.** The API keeps everything in an in-memory singleton (`api/Data/DataStore.cs`) seeded from `api/Data/SeedData.cs`. Any create / edit / delete is lost when the API restarts.

> `src/mock/` is a leftover from the earlier frontend-only version. The data pages no longer read from it, but `AdminGalleryPage.jsx` still imports `src/mock/store.js`. It can be removed once that page is moved onto the API.

---

## Prerequisites

| Tool | Minimum version | Check |
|---|---|---|
| Node.js | 18.x | `node -v` |
| npm | 9.x | `npm -v` |
| .NET SDK | 8.0 | `dotnet --version` |

---

## Local setup

You need two terminals: one for the API and one for the frontend.

### 1. Clone the project

```bash
git clone <your-repo-url>
cd family-newsletter
```

### 2. Start the API

```bash
cd api
dotnet run
```

The API must listen on `http://localhost:5000` (the frontend expects this). If `dotnet run` picks another port, start it explicitly:

```bash
dotnet run --urls http://localhost:5000
```

CORS only allows the Vite dev server origins `http://localhost:5173` and `http://localhost:5174`.

### 3. Start the frontend

In a second terminal, from the repo root:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## Admin login

The admin panel is at `/admin/login`. Admin accounts are seeded in `api/Data/SeedData.cs` and checked by `api/Controllers/AuthController.cs`. On success the API returns a JWT (valid for 8 hours), which the frontend stores in `localStorage` and sends as a `Bearer` token on admin requests.

These accounts are for development only. Passwords are stored in plain text and the JWT signing key in `api/appsettings.json` is a placeholder. Replace both before any real deployment.

---

## Project structure

```
family-newsletter/
├── api/                          # ASP.NET Core backend
│   ├── Controllers/              # Auth, Events, Members, Albums, Announcements, FamilyTree, Search
│   ├── Data/
│   │   ├── DataStore.cs          # In-memory store and CRUD
│   │   └── SeedData.cs           # Initial events, members, albums, announcements, admins
│   ├── Models/                   # DTOs / entities
│   ├── Program.cs                # CORS, JWT auth, DI setup
│   ├── appsettings.json          # JWT key and logging
│   └── FamilyNewsletter.Api.csproj
├── public/                       # Static assets (favicon)
├── src/
│   ├── components/
│   │   ├── admin/                # Admin layout
│   │   ├── events/               # Event card, grid, detail, photo grid
│   │   ├── home/                 # Hero, spotlight, announcements, etc.
│   │   ├── layout/               # Navbar and Footer
│   │   ├── members/              # Member card and profile
│   │   └── ui/                   # Shared UI (Badge, Button, Card, Modal, Lightbox, Spinner, Toast)
│   ├── context/                  # AuthContext, LanguageContext
│   ├── hooks/                    # useAuth, useLanguage
│   ├── i18n/
│   │   ├── i18n.js               # i18next initialisation
│   │   ├── en.json               # English translations
│   │   └── kn.json               # Kannada translations
│   ├── mock/                     # Legacy frontend-only mock data (mostly unused)
│   ├── pages/                    # One file per route (public + admin)
│   ├── services/
│   │   ├── api.js                # HTTP calls to the backend
│   │   ├── authService.js        # Login, logout, session and token handling
│   │   └── storageService.js     # localStorage helper (language preference)
│   ├── App.jsx                   # Routes and layout wrappers
│   ├── index.css                 # Global styles and Tailwind directives
│   └── main.jsx                  # React entry point
├── index.html
├── tailwind.config.js            # Custom colours (cream, terracotta, saffron, warmgreen)
├── postcss.config.js
├── vite.config.js
└── package.json
```

---

## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/events`, `/events/:id` | Events list / detail |
| `/upcoming` | Upcoming events |
| `/calendar` | Calendar |
| `/family-tree` | Family tree |
| `/gallery` | Photo gallery |
| `/members` | Family directory |
| `/search` | Search |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin dashboard (auth required) |
| `/admin/posts/new`, `/admin/posts/:id/edit` | Create / edit event (auth required) |
| `/admin/members` | Manage members (auth required) |
| `/admin/gallery` | Manage photos (auth required) |
| `/admin/family-tree/edit` | Edit family tree (auth required) |

---

## Available commands

**Frontend (repo root)**

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Bundle for production into `dist/` |
| `npm run preview` | Serve the `dist/` build locally |

**Backend (`api/`)**

| Command | What it does |
|---|---|
| `dotnet run` | Start the API |
| `dotnet build` | Compile the API |

---

## Deploying

The frontend and the API deploy separately.

**Frontend** (static build, `npm run build` → `dist/`)
- Works on Vercel, Netlify, or GitHub Pages.
- The app uses `BrowserRouter`, so the host must rewrite unknown paths to `index.html`. Otherwise refreshing or opening a direct link such as `/events` returns a 404.
- GitHub Pages also needs a `base` path in `vite.config.js` and either `HashRouter` or a `404.html` fallback.

**Backend** (ASP.NET Core)
- Needs a host that runs .NET 8 (Azure App Service, a container, etc.). Static hosts cannot run it.

**Before going live, change these:**
1. Replace the hard-coded `http://localhost:5000/api` in `src/services/api.js` and `src/services/authService.js` with the deployed API URL (for example via a Vite env variable such as `import.meta.env.VITE_API_BASE`).
2. Add the deployed frontend origin to the CORS policy in `api/Program.cs` (it only allows localhost today).
3. Move `Jwt:Key` out of `appsettings.json` into an environment variable or secret store.
4. Replace the seeded plain-text admin accounts with hashed credentials.
5. Replace the in-memory `DataStore` with a real database, or all content resets whenever the API restarts.

---

## Troubleshooting

**Pages load but show errors or no data**

The API isn't running or isn't on port 5000. Start it with `dotnet run --urls http://localhost:5000` inside `api/`.

**CORS error in the browser console**

The frontend must run on port 5173 or 5174. Other ports are blocked by the CORS policy in `api/Program.cs`.

**Admin changes disappear**

Expected. Data lives in API memory and resets when the API restarts.

**Blank page after editing files**

Vite's module cache can get stale after large changes:

```bash
rm -rf node_modules/.vite
npm run dev
```

Then hard refresh (`Ctrl+Shift+R` / `Cmd+Shift+R`).

**Port already in use**

Vite will use the next free port, but the API's CORS policy only allows 5173 and 5174. Free up the port, or add the new origin in `api/Program.cs`.

**`node_modules` missing or corrupted**

```bash
rm -rf node_modules package-lock.json
npm install
```
