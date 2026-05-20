# SilverBricks Connect

Australia's all-in-one services marketplace — connecting homeowners with verified tradespeople and local businesses.

---

## What is this?

SilverBricks Connect is a full-stack marketplace platform with three modules:

- **TradeConnect** — Post jobs and receive quotes from verified tradies
- **Hire-A-Me** — Instant on-demand tradesperson hiring
- **BookEasy Hub** — Book appointments with local businesses

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend API | Python 3.12 + FastAPI + PostgreSQL + Redis |
| Web Frontend | Next.js 15 + React + TailwindCSS |
| Mobile App | React Native (Expo) — iOS + Android |
| Auth | JWT (access + refresh tokens) |
| Payments | Stripe (configured, Phase 2) |
| Notifications | Firebase Push + In-app notifications |
| Email | SMTP (transactional emails) |
| Infrastructure | Docker + Docker Compose |

---

## Features

### For Customers
- Register and post renovation/trade jobs
- Receive and compare quotes from tradies
- Accept/decline quotes, hire tradesperson
- Book appointments with local businesses
- Review and rate tradespeople
- Full booking history and management

### For Tradespeople
- Create verified profile with categories and specialties
- Browse and quote on open jobs
- Track quote history and win rate
- Earnings dashboard and calendar view

### For Business Owners
- Create business profile with services and staff
- Accept and manage customer bookings
- Analytics dashboard (revenue, completion rate)
- Service and staff management

### Platform
- Admin panel — verify providers, moderate reviews, platform stats
- In-app notification system
- Image uploads for jobs and profiles
- Password reset via email
- Role-based access control

---

## Quick Start (Docker)

**Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
# 1. Clone the repo
git clone https://github.com/jagjeetkaur123/RenovateMe.git
cd RenovateMe

# 2. Copy environment file
cp .env.example backend/.env

# 3. Start everything
docker compose up --build
```

Wait ~3 minutes on first run, then open:

| | URL |
|---|---|
| Web App | http://localhost:3000 |
| API Docs | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |

```bash
# Stop
docker compose down
```

---

## Manual Setup (Without Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env         # edit DATABASE_URL to point to your Postgres
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
# Opens at http://localhost:3000
```

### Mobile App

```bash
cd mobile
npm install
npx expo start
# Scan QR code with Expo Go app on your phone
```

---

## Environment Variables

Copy `.env.example` to `backend/.env` and fill in:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT secret — min 32 chars, change in production |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASSWORD` | Email sending (optional for dev) |
| `STRIPE_SECRET_KEY` | Stripe payments (Phase 2) |
| `FIREBASE_CREDENTIALS_PATH` | Firebase push notifications (Phase 2) |

---

## API Documentation

Once running, the full interactive API docs are at:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

All 50+ endpoints are documented with request/response schemas.

---

## Project Structure

```
RenovateMe/
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── api/v1/           # Route handlers
│   │   │   ├── auth.py       # Registration, login, password reset
│   │   │   ├── jobs.py       # Job posting and browsing
│   │   │   ├── quotes.py     # Quote submission and acceptance
│   │   │   ├── bookings.py   # Appointment bookings
│   │   │   ├── reviews.py    # Reviews and ratings
│   │   │   ├── tradespeople.py
│   │   │   ├── businesses.py
│   │   │   ├── notifications.py
│   │   │   ├── uploads.py
│   │   │   └── admin.py
│   │   ├── core/
│   │   │   ├── config.py     # Settings and env vars
│   │   │   ├── security.py   # JWT, password hashing
│   │   │   ├── email.py      # Transactional email service
│   │   │   └── database.py   # Async SQLAlchemy session
│   │   ├── models/           # SQLAlchemy ORM models
│   │   └── schemas/          # Pydantic request/response schemas
│   ├── alembic/              # Database migrations
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/                 # Next.js 15 web app
│   └── src/
│       ├── app/
│       │   ├── page.tsx              # Landing page
│       │   ├── jobs/[id]/            # Job detail + quote submission
│       │   ├── dashboard/
│       │   │   ├── customer/         # Customer dashboards
│       │   │   ├── provider/         # Tradesperson dashboards
│       │   │   └── business/         # Business dashboards
│       │   ├── profile/              # Profile editor
│       │   ├── forgot-password/      # Password reset flow
│       │   ├── terms/                # Terms of service
│       │   ├── privacy/              # Privacy policy
│       │   └── contact/              # Contact form
│       ├── components/
│       │   └── NavBar.tsx            # Shared nav with notifications bell
│       └── lib/
│           └── api.ts                # Axios client with auth interceptors
│
├── mobile/                   # React Native (Expo) app
│   └── app/
│       ├── (tabs)/           # Main tab screens
│       ├── auth/             # Login + Register screens
│       └── jobs/             # Job posting screen
│
├── docker-compose.yml
└── .env.example
```

---

## License

Private project — all rights reserved.
