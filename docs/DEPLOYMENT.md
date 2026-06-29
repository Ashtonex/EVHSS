# Deployment Guide

## Overview
The EVHSS Enterprise Platform is designed to be deployed using modern containerized workflows.
The backend is containerised using Docker, while the frontend is optimized for deployment on Vercel.

## Backend Deployment (Docker)

1. **Environment Variables**:
   Create a `.env` file in the `backend/` directory using the provided `.env.example` (or configure via your CI/CD pipeline secrets).
   Ensure `DATABASE_URL` points to your production PostgreSQL database and `SECRET_KEY` is highly secure.

2. **Build and Run**:
   ```bash
   docker build -t evhss-backend:latest ./backend
   docker run -d -p 8000:8000 --env-file ./backend/.env evhss-backend:latest
   ```
   
3. **Database Migrations**:
   Run Alembic migrations on the production database before booting the API layer:
   ```bash
   docker exec -it <container_id> alembic upgrade head
   ```

## Frontend Deployment (Vercel)

The Next.js frontend is designed to be effortlessly deployed to Vercel.

1. **Connect Repository**:
   Link your GitHub repository to Vercel.

2. **Configuration**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

3. **Environment Variables**:
   Add the backend API URL:
   `NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1`
