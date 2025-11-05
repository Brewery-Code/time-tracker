# 🕒 Time Tracker Backend

A backend service for tracking working hours and managing user data.  
Built with **FastAPI**, **SQLAlchemy**, **Alembic**, and **PostgreSQL**, fully containerized via **Docker**.

---

## ⚙️ Prerequisites

Make sure you have the following installed:

- **Docker** ≥ 20.10  
- **Docker Compose** ≥ 2.0  
- **Git** ≥ 2.30  
- **Python 3.12+** (optional, for local development)

---

## 📦 1. Clone the Repository

```bash
git clone git@github.com:Brewery-Code/time-tracker.git
cd time-tracker/backend
```

## 🔐 2. Configure Environment Variables
1. ```cp .env.example .env```
2. Open ```.env``` and update the values as needed:
```
POSTGRES_USER=name
POSTGRES_PASSWORD=secret
POSTGRES_DB=time_tracker_database
POSTGRES_HOST=postgres_container
POSTGRES_PORT=5432

PGADMIN_DEFAULT_EMAIL:name@example.com
PGADMIN_DEFAULT_PASSWORD:secret
```
   💡 Keep these values consistent with your docker-compose.yml setup.

## 🐳 3. Run the Containers
Build and start all services:
```docker compose up -d --build```

**Available services:**
- **api_container** — FastAPI backend
- **postgres_container** — PostgreSQL database
- **pgadmin_container (optional)** — web interface for the database

**Once started, the backend is available at:**
- Swagger Docs → http://localhost:8000/docs
- Admin Panel → http://localhost:8000/admin

## 💾 4. Load Database Dump
1. Access the Postgres container:
   ```docker exec -it postgres_container bash```
2. Import the dump:
   ```psql -U john -d time_tracker_database -f /dump.sql```

## 🔄 5. Run Database Migrations (Optional)
If you prefer to start with an empty database instead of using the dump:  
```docker exec -it api_container alembic upgrade head```

## 🧭 6. Default Access
After loading the dump, an **admin user** should already exist:

| Field       | Value             |
|--------------|-------------------|
| **Email**    | `admin@admin.com` |
| **Password** | *(as defined in dump)* |

Use this account to log in at [http://localhost:8000/admin](http://localhost:8000/admin)
