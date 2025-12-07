# Deadlock Tier List

Only the strongest survive the Cursed Apple. This is a community-driven tier list application for Valve's *Deadlock*, featuring real-time voting, patch versioning, and a high-fidelity dark aesthetic.

![Deadlock Logo](https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/card_dashboard_logo.png)

## Features

- **Ranked Tier List**: Dynamic S-F tier grouping based on community average votes.
- **Vote System**: Interactive modal with sound effects and "Ghostly Green" visual feedback.
- **Data Integrity**: **IP-based Anti-Cheat** (SHA-256 hashed) prevents spam voting. Voting is locked to the current active patch.
- **Authentic Design**: 
    - Official Hero Name Logos fetched from the game API.
    - Custom "Forevs" font integration.
    - Glassmorphism, noise overlays, and smooth CSS transitions.
- **Audio**: Integrated voice lines (Happy/Sad) on vote with a dedicated Mute toggle.
- **Tech Stack**: Next.js 16 (App Router), Tailwind CSS v4, Drizzle ORM, Postgres, Docker.

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- pnpm

### Local Development

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/EightBitByte/deadlock-tier-list.git
    cd deadlock-tier-list
    ```

2.  **Start the Database**:
    ```bash
    docker-compose up -d db
    ```

3.  **Install Dependencies**:
    ```bash
    pnpm install
    ```

4.  **Setup Environment**:
    - Create a `.env.local` file (copy example if exists, or just set `DATABASE_URL`).
    - *Note: The default docker-compose setup uses `postgres://postgres:postgrespassword@localhost:5432/deadlock_tierlist` for local dev.*

5.  **Initialize Database**:
    ```bash
    # Push schema
    npx drizzle-kit push
    
    # Seed characters
    npx tsx src/db/seed.ts
    ```

6.  **Run the App**:
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## Deployment (Docker)

The application is fully containerized for production.

```bash
# Build and run everything
docker-compose up --build -d
```

- **App**: `http://localhost:3000`
- **Database**: Port `5432` (internal network `deadlock-tier-list_default`)

### Hide Your IP (Cloudflare Tunnel)
If hosting on a VPS (like Linode) and you wish to remain anonymous:
1.  Add a `cloudflared` service to `docker-compose.yml`.
2.  Do not expose port `3000` publicly.
3.  Route traffic via Cloudflare Zero Trust.

## Architecture

- **Database**: Postgres with `votes` and `characters` tables.
- **API**: Next.js Route Handlers (`/api/tierlist`, `/api/vote`).
- **Styles**: `src/app/globals.css` defines the CSS variables for the tier colors and the signature `ghostly-green` accent.

---

*This project is not affiliated with Valve Software.*
