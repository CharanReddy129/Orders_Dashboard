# Prometheus Orders Dashboard

A modern e-commerce order management dashboard built with React, TypeScript, Vite, Tailwind CSS, shadcn-style primitives, Recharts, React Hook Form, Zod, Axios, and React Router.

This project is intentionally shaped as a DevOps and Prometheus learning playground: the frontend assumes REST APIs today, and later you can add backend services, containers, metrics endpoints, dashboards, and alerts.

## Local development

### Prerequisites

- Node.js 18+ / npm
- Python 3.11+
- pip
- Optional: `virtualenv` or `venv`

### Backend setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```

The backend starts on `http://0.0.0.0:8080` and exposes:

- `GET /api/health`
- `GET /api/metrics`
- `GET /api/users`
- `POST /api/users`
- `GET /api/products`
- `POST /api/products`
- `GET /api/orders`
- `POST /api/orders`

### Frontend setup

```bash
cd /home/charan/practise/prometheus
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

### Environment

Create a `.env` file in the repository root with:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

If the backend is unavailable, the app falls back to mock data for pages and charts.

### Build for production

```bash
npm run build
npm run preview
```

## Docker container setup

### Requirements

- Docker Engine
- Docker CLI

### Recommended service layout

- Frontend container serving the Vite-built app on port `5173`
- Backend container serving Flask on port `8080`

### Example commands

Build the backend image:

```bash
docker build -f backend/Dockerfile -t prometheus-backend ./backend
```

Build the frontend image:

```bash
docker build -f Dockerfile.frontend -t prometheus-frontend .
```

Run the backend container:

```bash
docker run -d --name prometheus-backend -p 8080:8080 \
  -e DATABASE_URL="sqlite:///prometheus.db" \
  -e SECRET_KEY="change-me" \
  -e APP_ENV="production" \
  -e LOG_LEVEL="INFO" \
  prometheus-backend
```

Run the frontend container:

```bash
docker run -d --name prometheus-frontend -p 5173:5173 \
  -e VITE_API_BASE_URL="http://host.docker.internal:8080/api" \
  prometheus-frontend
```

> Note: Use `host.docker.internal` on macOS/Windows, or set `VITE_API_BASE_URL` to the backend container hostname when using Docker networking.

### Example Dockerfile snippets

Frontend `Dockerfile.frontend`:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=build /app/dist ./dist
EXPOSE 5173
CMD ["npx", "vite", "preview", "--host", "0.0.0.0"]
```

Backend `backend/Dockerfile`:

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend ./backend
WORKDIR /app/backend
EXPOSE 8080
CMD ["python", "run.py"]
```

## Useful scripts

```bash
npm run build
npm run preview
npm run lint
```

## API configuration

Set the backend API URL in `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

If the API is unavailable, the app gracefully falls back to realistic local dummy data.
