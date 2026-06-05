<div align="center">

<br />

```
███╗   ██╗███████╗ ██████╗ ███╗   ██╗██████╗ ██╗██████╗ ███████╗
████╗  ██║██╔════╝██╔═══██╗████╗  ██║██╔══██╗██║██╔══██╗██╔════╝
██╔██╗ ██║█████╗  ██║   ██║██╔██╗ ██║██████╔╝██║██║  ██║█████╗  
██║╚██╗██║██╔══╝  ██║   ██║██║╚██╗██║██╔══██╗██║██║  ██║██╔══╝  
██║ ╚████║███████╗╚██████╔╝██║ ╚████║██║  ██║██║██████╔╝███████╗
╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝╚═════╝ ╚══════╝
```

### ✦ Premium Nationwide Cab Booking Platform ✦

<br />

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

<br />

> **NeonRide** is a full-stack, production-grade cab booking application covering all 50 US states.  
> Built with a luxury dark-mode UI featuring real-time 3D animations, live address geocoding,  
> an AI-powered support assistant, and complete guest + registered user booking flows.

<br />

[🚀 Live Demo](#-getting-started) · [📖 API Docs](#-api-reference) · [🗂 Project Structure](#-project-structure) · [🤝 Contributing](#-contributing)

<br />

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Running the App](#running-the-app)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [UI & Design System](#-ui--design-system)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

NeonRide is a **premium cab booking web application** engineered to demonstrate a complete, real-world full-stack architecture. It brings together a high-performance `.NET 8` REST API, a reactive `React 19` frontend, and a `SQLite` relational database — all wrapped in a luxury, futuristic UI inspired by high-end mobility services like Blacklane and Uber Black.

The application handles the complete booking lifecycle — from live address search across every street and landmark in the United States, through multi-tier ride selection with real-time fare estimation, to live ride tracking with driver details and an AI chat assistant that understands ride context.

---

## ✨ Features

### 🎨 Frontend / UI
| Feature | Description |
|---|---|
| **3D Animated Background** | Canvas-rendered scene: warp-speed star field, rotating wireframe cubes, scrolling neon perspective grid, pulsing rings, and radial light beams — all at 60fps |
| **Luxury Glassmorphism** | Heavy `backdrop-filter: blur()` cards with neon glow borders, gold shimmer on premium elements, and Playfair Display serif headings |
| **Live Address Geocoding** | Real-time autocomplete powered by OpenStreetMap Nominatim — every address, city, landmark, and ZIP code across all 50 US states. No API key required |
| **Two-Column Booking Card** | Centred glass card: left column for location input + controls, right column for live ride tier cards with SVG car silhouettes |
| **Animated Stat Counters** | Numbers count up from zero on load (4.2M rides · 50 states · 10K+ drivers) |
| **Ride Tier Cards** | Economy · Premium · SUV · Luxury — each with a distinct SVG car silhouette, neon colour, ETA, and dynamic fare |
| **Step Progress Indicator** | Visual 3-step progress tracker: Location → Ride Type → Confirm |
| **Guest Checkout** | Full booking without any account — guest session ID stored in localStorage |
| **Live Ride Tracking** | 4-step status timeline with animated checkmarks, countdown ETA ticker, driver card with star ratings |
| **Emergency SOS** | One-tap SOS button on the tracking page |
| **AI Chat Widget** | Floating assistant drawer with typing animation, quick-prompt chips, and context-aware responses |
| **Dark Leaflet Map** | Custom-styled dark map on the tracking page with neon pickup/dropoff markers and dashed route polyline |
| **Fully Responsive** | Single-column layout on mobile, two-column on desktop |

### ⚙️ Backend / API
| Feature | Description |
|---|---|
| **JWT Authentication** | Stateless token auth with 7-day expiry, BCrypt password hashing |
| **Unified Booking** | Single `Rides` table handles both registered users (by `UserId`) and guests (by `GuestSessionId`) via a `PassengerType` discriminator |
| **Haversine Fare Engine** | Real great-circle distance calculation between any two US coordinates with per-tier pricing multipliers |
| **Driver Simulation** | Random assignment of realistic driver names, vehicle descriptions, ratings, and ETAs at booking time |
| **Status Simulation** | Ride status progresses automatically based on elapsed time: `Searching → DriverArriving → Active → Completed` |
| **Context-Aware AI** | Intent parser handles tracking, cancellation, driver, pricing, pet, luggage, and safety queries — and fetches live ride status when a `RideId` is provided |
| **Clean Architecture** | Separated Models · DTOs · Services · Controllers layers |
| **Auto DB Init** | SQLite database and schema created automatically on first run via `EnsureCreated()` |

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI component framework |
| TypeScript | 5 | Type-safe development |
| Vite | 8 | Build tool & dev server with API proxy |
| React Router DOM | 7 | Client-side routing |
| Leaflet | 1.9 | Interactive dark-themed map on tracking page |
| Canvas API | Native | 3D animated background rendering |
| OpenStreetMap Nominatim | — | Free geocoding API (no key required) |
| Playfair Display + Inter | Google Fonts | Luxury + modern typography |
| Custom CSS | — | Full design system (no Tailwind) |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| .NET / ASP.NET Core | 8.0 | REST API framework |
| Entity Framework Core | 8.0 | ORM for SQLite |
| Microsoft.AspNetCore.Authentication.JwtBearer | 8.0 | JWT token validation |
| BCrypt.Net-Next | 4.2 | Password hashing |
| SQLite | — | Relational file-based database |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BROWSER (Port 5173)                          │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  React SPA (Vite)                                            │    │
│  │                                                               │    │
│  │  pages/          components/          services/              │    │
│  │  ├ Dashboard      ├ ThreeDBackground   ├ api.ts (fetch)       │    │
│  │  ├ TrackRide      ├ MapView (Leaflet)  └ geocode.ts (OSM)    │    │
│  │  ├ Login          ├ ChatWidget                               │    │
│  │  └ Signup         ├ NavBar                                   │    │
│  │                   ├ CityScape (SVG)                          │    │
│  │                   └ ParticlesBg                              │    │
│  └──────────────────────────┬────────────────────────────────┘    │
│                             │  /api/* (Vite proxy)                   │
└─────────────────────────────┼───────────────────────────────────────┘
                              │
                              ▼  HTTP / JSON
┌─────────────────────────────────────────────────────────────────────┐
│                    .NET 8 Web API (Port 5000)                         │
│                                                                       │
│  Controllers/          Services/              DTOs/                   │
│  ├ AuthController      ├ RideService          ├ AuthDtos             │
│  ├ RidesController     └ AiService            ├ RideDtos             │
│  └ AiController                               └ AiDtos               │
│                                                                       │
│  Data/                 Models/                                        │
│  └ AppDbContext        ├ User                                        │
│    (EF Core)           └ Ride                                        │
│                              │                                        │
└─────────────────────────────┼───────────────────────────────────────┘
                              │  EF Core / SQLite
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     SQLite (cabBooking.db)                            │
│                                                                       │
│  ┌──────────────┐      ┌──────────────────────────────────────────┐ │
│  │    Users     │      │                  Rides                   │ │
│  │  UserId (PK) │      │  RideId (PK, GUID)                       │ │
│  │  FullName    │◄─────│  UserId (FK, nullable)                   │ │
│  │  Email       │      │  GuestSessionId (nullable)               │ │
│  │  PasswordHash│      │  PassengerType (Registered | Guest)      │ │
│  │  PhoneNumber │      │  PickupAddress / DropoffAddress          │ │
│  │  CreatedAt   │      │  PickupLat/Lng  DropoffLat/Lng           │ │
│  └──────────────┘      │  RideTier / Fare / Status                │ │
│                         │  DriverName / DriverVehicle / Rating    │ │
│                         │  EtaMinutes / CreatedAt                  │ │
│                         └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘

External Services:
  ┌───────────────────────────────────────┐
  │  OpenStreetMap Nominatim (geocoding)  │
  │  https://nominatim.openstreetmap.org  │
  │  Free · No API key · Full US coverage │
  └───────────────────────────────────────┘
```

---

## 🗂 Project Structure

```
neonride-cab-booking/
│
├── 📄 .gitignore
├── 📄 README.md
├── 🖱️ start-backend.bat          ← Double-click to start backend
├── 🖱️ start-frontend.bat         ← Double-click to start frontend
│
├── 📁 backend/                   ← .NET 8 Web API
│   ├── 📄 CabBooking.API.csproj
│   ├── 📄 Program.cs             ← App bootstrap, DI, CORS, JWT, EF Core
│   ├── 📄 appsettings.json       ← DB connection string, JWT config
│   │
│   ├── 📁 Controllers/
│   │   ├── AuthController.cs     ← POST /api/auth/register, /login
│   │   ├── RidesController.cs    ← estimate, book, track, cancel
│   │   └── AiController.cs       ← POST /api/ai/chat
│   │
│   ├── 📁 Models/
│   │   ├── User.cs
│   │   └── Ride.cs
│   │
│   ├── 📁 Data/
│   │   └── AppDbContext.cs       ← EF Core context + Fluent API config
│   │
│   ├── 📁 DTOs/
│   │   ├── AuthDtos.cs
│   │   ├── RideDtos.cs
│   │   └── AiDtos.cs
│   │
│   ├── 📁 Services/
│   │   ├── RideService.cs        ← Haversine, fare calc, driver simulation
│   │   └── AiService.cs          ← Intent parsing, ride-context responses
│   │
│   └── 📁 Properties/
│       └── launchSettings.json   ← Port 5000
│
└── 📁 frontend/                  ← React 19 + Vite + TypeScript
    ├── 📄 package.json
    ├── 📄 vite.config.ts         ← API proxy: /api → localhost:5000
    ├── 📄 tsconfig.json
    ├── 📄 index.html             ← Google Fonts (Playfair Display + Inter)
    │
    └── 📁 src/
        ├── 📄 main.tsx           ← React root
        ├── 📄 App.tsx            ← Router, global background layers
        ├── 📄 index.css          ← Full design system (~850 lines)
        ├── 📄 vite-env.d.ts
        │
        ├── 📁 pages/
        │   ├── Dashboard.tsx     ← Booking page (3D bg + centred glass card)
        │   ├── TrackRide.tsx     ← Live tracking (Leaflet map + timeline)
        │   ├── Login.tsx
        │   └── Signup.tsx
        │
        ├── 📁 components/
        │   ├── ThreeDBackground.tsx  ← Canvas: stars, cubes, grid, beams
        │   ├── MapView.tsx           ← Dark-themed Leaflet map wrapper
        │   ├── ChatWidget.tsx        ← Floating AI assistant drawer
        │   ├── NavBar.tsx
        │   ├── CityScape.tsx         ← SVG night city skyline
        │   └── ParticlesBg.tsx       ← CSS particle system (auth pages)
        │
        └── 📁 services/
            ├── api.ts            ← Typed fetch wrapper for all endpoints
            └── geocode.ts        ← OpenStreetMap Nominatim client + cache
```

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your machine:

| Tool | Version | Download |
|---|---|---|
| .NET SDK | 8.0+ | https://dotnet.microsoft.com/download |
| Node.js | 18.0+ | https://nodejs.org |
| npm | 9.0+ | Included with Node.js |
| Git | Any | https://git-scm.com |

---

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/akhilMotakatla/neonride-cab-booking.git
cd neonride-cab-booking

# 2. Navigate to the backend directory
cd backend

# 3. Restore NuGet packages
dotnet restore

# 4. Build the project
dotnet build
```

> **Note:** The SQLite database (`cabBooking.db`) is created automatically the first time you run the backend. No manual migration steps are needed.

---

### Frontend Setup

```bash
# From the repo root, navigate to the frontend directory
cd frontend

# Install npm dependencies
npm install
```

---

### Running the App

You need **two terminals** running simultaneously — one for the backend, one for the frontend.

**Terminal 1 — Backend:**
```bash
cd backend
dotnet run
# Server starts at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Dev server starts at http://localhost:5173
```

Then open your browser at: **[http://localhost:5173](http://localhost:5173)**

> **Windows users:** Simply double-click **`start-backend.bat`** and **`start-frontend.bat`** from the project root. No terminal needed.

---

### How the Proxy Works

The Vite dev server proxies all `/api/*` requests to the backend automatically:

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:5000',  // backend
    changeOrigin: true,
  }
}
```

This means the frontend calls `/api/rides/estimate` and Vite forwards it to `http://localhost:5000/api/rides/estimate` — **no CORS issues, no hardcoded URLs**.

---

## 📡 API Reference

**Base URL:** `http://localhost:5000/api`

All `POST` endpoints accept and return `application/json`.  
Protected endpoints require `Authorization: Bearer <token>` header.

---

### 🔐 Auth

#### `POST /api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "fullName":    "Alex Johnson",
  "email":       "alex@example.com",
  "password":    "securepassword123",
  "phoneNumber": "+1 (555) 000-0000"   // optional
}
```

**Response `200 OK`:**
```json
{
  "token":    "eyJhbGci...",
  "userId":   1,
  "fullName": "Alex Johnson",
  "email":    "alex@example.com"
}
```

**Error `409 Conflict`:** Email already registered.

---

#### `POST /api/auth/login`
Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email":    "alex@example.com",
  "password": "securepassword123"
}
```

**Response `200 OK`:** Same shape as `/register`.  
**Error `401 Unauthorized`:** Invalid credentials.

---

### 🚗 Rides

#### `POST /api/rides/estimate`
Calculate fare and ETA for all four ride tiers given two coordinates.

**Request Body:**
```json
{
  "pickupLat":      40.7580,
  "pickupLng":     -73.9855,
  "dropoffLat":     34.1015,
  "dropoffLng":   -118.3264,
  "pickupAddress":  "Times Square, New York, NY",
  "dropoffAddress": "Hollywood Blvd, Los Angeles, CA"
}
```

**Response `200 OK`:**
```json
{
  "distanceKm": 4129.76,
  "tiers": [
    { "tier": "Economy", "fare": 4958.22, "etaMinutes": 8, "description": "Affordable & Comfortable", "icon": "🚗" },
    { "tier": "Premium", "fare": 7643.06, "etaMinutes": 7, "description": "Top-Rated Drivers",        "icon": "🚙" },
    { "tier": "SUV",     "fare": 9915.43, "etaMinutes": 9, "description": "Spacious for Groups",      "icon": "🚐" },
    { "tier": "Luxury",  "fare":14460.17, "etaMinutes": 6, "description": "Premium Black Car Service","icon": "✨" }
  ]
}
```

> **Fare Formula:** `distanceKm × tierRate + baseFare`  
> Economy: $1.20/km | Premium: $1.85/km | SUV: $2.40/km | Luxury: $3.50/km

---

#### `POST /api/rides/book`
Create a new ride booking. Supports both registered users and guests.

**Request Body:**
```json
{
  "pickupAddress":  "Times Square, New York, NY",
  "dropoffAddress": "Hollywood Blvd, Los Angeles, CA",
  "pickupLat":       40.7580,  "pickupLng":    -73.9855,
  "dropoffLat":      34.1015,  "dropoffLng":  -118.3264,
  "rideTier":       "Luxury",
  "fare":            14460.17,

  "userId":          1,              // For registered users — OR —
  "guestSessionId": "uuid-here",     // For guests
  "guestEmail":     "guest@mail.com",// optional
  "guestPhone":     "+1 555 000000"  // optional
}
```

**Response `200 OK`:**
```json
{
  "rideId":        "534a9898-9e74-4981-b967-fcbd8def2be1",
  "status":        "Searching",
  "pickupAddress": "Times Square, New York, NY",
  "dropoffAddress":"Hollywood Blvd, Los Angeles, CA",
  "rideTier":      "Luxury",
  "fare":           14460.17,
  "driverName":    "Priya Patel",
  "driverVehicle": "Mercedes-Benz E-Class (Black) · AB1234",
  "driverRating":   4.9,
  "etaMinutes":     7,
  "passengerType": "Registered",
  "createdAt":     "2026-06-05T12:00:00Z"
}
```

---

#### `GET /api/rides/track/{rideId}`
Fetch the current status of a ride. Status progresses automatically based on time elapsed since booking.

**Status Progression:**

| Time Since Booking | Status |
|---|---|
| 0 – 15 seconds | `Searching` |
| 15 – 60 seconds | `DriverArriving` |
| 1 – 5 minutes | `Active` |
| 5+ minutes | `Completed` |

**Response `200 OK`:**
```json
{
  "rideId":         "534a9898-...",
  "status":         "DriverArriving",
  "driverName":     "Priya Patel",
  "driverVehicle":  "Mercedes-Benz E-Class (Black) · AB1234",
  "driverRating":    4.9,
  "etaMinutes":      7,
  "pickupLat":       40.7580,  "pickupLng":    -73.9855,
  "dropoffLat":      34.1015,  "dropoffLng":  -118.3264,
  "pickupAddress":  "Times Square, New York, NY",
  "dropoffAddress": "Hollywood Blvd, Los Angeles, CA"
}
```

---

#### `POST /api/rides/cancel/{rideId}`
Cancel an active ride.

**Response `200 OK`:**
```json
{ "message": "Ride cancelled successfully." }
```

**Error `400 Bad Request`:** Ride is already `Completed` or `Cancelled`.

---

### 🤖 AI Assistant

#### `POST /api/ai/chat`
Process a chat message and return a context-aware response.

**Request Body:**
```json
{
  "message":      "Where is my driver?",
  "currentRideId":"534a9898-...",    // optional — enables ride-context responses
  "isGuest":       false
}
```

**Response `200 OK`:**
```json
{
  "reply":       "Great news! Priya Patel is on the way in a Mercedes-Benz E-Class (Black). ETA: ~7 minutes.",
  "rideStatus":  "DriverArriving"
}
```

**Supported Intents:**

| User asks about… | Response type |
|---|---|
| Ride location / ETA | Fetches live `Status` from DB |
| Driver / vehicle | Returns driver name, vehicle, rating |
| Cancellation / refund | Explains cancellation policy |
| Pricing | Per-km rates for all tiers |
| Luggage / pets | Policy explanation |
| Safety / SOS | Safety features overview |
| Payment | Accepted payment methods |
| General greeting | Welcome message |

---

## 🗄 Database Schema

```sql
-- Users — registered passenger accounts
CREATE TABLE Users (
  UserId       INTEGER PRIMARY KEY AUTOINCREMENT,
  FullName     TEXT    NOT NULL,
  Email        TEXT    UNIQUE NOT NULL,
  PasswordHash TEXT    NOT NULL,
  PhoneNumber  TEXT,
  CreatedAt    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Rides — unified table for both registered and guest bookings
CREATE TABLE Rides (
  RideId         TEXT    PRIMARY KEY,        -- GUID
  PassengerType  TEXT    NOT NULL,           -- 'Registered' | 'Guest'
  UserId         INTEGER NULL,               -- FK → Users.UserId
  GuestSessionId TEXT    NULL,
  GuestEmail     TEXT    NULL,
  GuestPhone     TEXT    NULL,
  PickupAddress  TEXT    NOT NULL,
  DropoffAddress TEXT    NOT NULL,
  PickupLat      REAL    NOT NULL,
  PickupLng      REAL    NOT NULL,
  DropoffLat     REAL    NOT NULL,
  DropoffLng     REAL    NOT NULL,
  RideTier       TEXT    NOT NULL,           -- Economy | Premium | SUV | Luxury
  Fare           REAL    NOT NULL,
  Status         TEXT    DEFAULT 'Searching',
  DriverName     TEXT,
  DriverVehicle  TEXT,
  DriverRating   REAL,
  EtaMinutes     INTEGER,
  CreatedAt      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Performance indexes
CREATE INDEX idx_rides_user   ON Rides(UserId);
CREATE INDEX idx_rides_guest  ON Rides(GuestSessionId);
CREATE INDEX idx_rides_status ON Rides(Status);
```

---

## 🎨 UI & Design System

The entire design system lives in `frontend/src/index.css` (~850 lines) as a custom CSS variable framework — no Tailwind, no component library.

### Color Palette

| Variable | Value | Usage |
|---|---|---|
| `--bg-base` | `#050810` | Page background |
| `--bg-surface` | `#0a0f1e` | Elevated surfaces |
| `--cyan` | `#00F2FE` | Primary accent, pickup markers |
| `--purple` | `#7B61FF` | Secondary accent, dropoff markers |
| `--blue` | `#4FACFE` | Gradient midpoint |
| `--gold` | `#F5C842` | Luxury tier, premium highlights |
| `--text-primary` | `#F1F5F9` | Main body text |
| `--text-secondary` | `#94A3B8` | Labels, subtitles |
| `--text-muted` | `#475569` | Captions, metadata |

### Typography

| Font | Usage |
|---|---|
| **Playfair Display** | All headings — `display-title` class |
| **Inter** | Body text, labels, inputs |

### Key CSS Classes

```css
.glass          /* Light glassmorphism */
.glass-card     /* Hoverable glass card with glow */
.gradient-text  /* Cyan → Blue → Purple gradient text */
.gold-text      /* Luxury gold gradient text */
.btn-primary    /* Cyan-to-purple CTA button */
.btn-gold       /* Gold gradient button (Luxury tier) */
.booking-float  /* The centred glass booking card */
.booking-inner  /* Two-column grid inside the card */
.fade-in-up     /* Staggered entry animation */
```

### 3D Background Layers (`ThreeDBackground.tsx`)

The canvas renders 7 simultaneous layers at 60fps:

1. **Deep space radial gradient** — very dark `#020408 → #0b1528`
2. **Pulsing neon rings** — 5 concentric circles expanding from centre
3. **Warp star field** — 220 neon particles flying toward the camera (3D perspective projection)
4. **Neon perspective grid** — scrolling Tron-style floor with moving highlight sweep
5. **Horizon glow** — atmospheric light at the vanishing point
6. **Rotating wireframe cubes** — 12 cubes with full 3D rotation matrices in depth
7. **Radial light beams** — 6 soft beams rotating slowly from centre
8. **Moving scanline** — single translucent band sweeping down (CRT/tech feel)
9. **Vignette** — dark radial overlay keeping edges dark

---

## 🔧 Environment Variables

The backend reads configuration from `appsettings.json`. For production, override these via environment variables or `appsettings.Production.json`:

| Key | Default | Description |
|---|---|---|
| `ConnectionStrings:DefaultConnection` | `Data Source=cabBooking.db` | SQLite file path |
| `Jwt:Key` | `NeonRideSecretKey...` | JWT signing key — **change in production** |
| `Jwt:Issuer` | `NeonRideAPI` | Token issuer |
| `Jwt:Audience` | `NeonRideApp` | Token audience |

> ⚠️ **Production Note:** Always replace the default `Jwt:Key` with a cryptographically strong secret (min. 32 characters) before deploying.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/neonride-cab-booking.git

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Make your changes and commit
git add .
git commit -m "feat: describe your change"

# 5. Push to your fork
git push origin feature/your-feature-name

# 6. Open a Pull Request on GitHub
```

### Commit Message Convention

This project follows **Conventional Commits**:

| Prefix | Use for |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `style:` | CSS / UI changes |
| `refactor:` | Code restructuring (no behavior change) |
| `docs:` | Documentation updates |
| `chore:` | Build, config, dependency updates |

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Akhil Motakatla

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

<br />

Built with ❤️ using React · .NET 8 · SQLite · Canvas API · OpenStreetMap

<br />

⭐ **If you found this project useful, please consider giving it a star!** ⭐

<br />

[![GitHub stars](https://img.shields.io/github/stars/akhilMotakatla/neonride-cab-booking?style=social)](https://github.com/akhilMotakatla/neonride-cab-booking/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/akhilMotakatla/neonride-cab-booking?style=social)](https://github.com/akhilMotakatla/neonride-cab-booking/network/members)

</div>
