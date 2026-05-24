# Inventory Reservation System

A full-stack inventory reservation system built using Next.js, Prisma, PostgreSQL, and Neon Database.

This project allows users to:

- View inventory across warehouses
- Reserve products
- Confirm reservations
- Cancel reservations
- Track available stock in real time
- Prevent overselling of inventory

---

# Tech Stack

- Next.js 16
- TypeScript
- Prisma ORM
- PostgreSQL
- Neon Database
- REST APIs

---

# Features

## Inventory Management

- Multiple products
- Multiple warehouses
- Real-time stock tracking
- Available stock calculation

## Reservation System

Users can:

- Reserve inventory
- Confirm reservations
- Cancel reservations

The system automatically:

- Updates reserved stock
- Updates available stock
- Prevents overbooking

---

# Project Structure

```bash
app/
 ├── api/
 │    ├── products/
 │    │    └── route.ts
 │    │
 │    └── reservations/
 │         ├── route.ts
 │         ├── [id]/
 │         │    ├── confirm/
 │         │    │    └── route.ts
 │         │    └── release/
 │         │         └── route.ts
 │
 ├── page.tsx
 │
components/
 └── ReserveButton.tsx

lib/
 └── prisma.ts

prisma/
 ├── schema.prisma
 └── seed.ts
```

---

# API Endpoints

## Get Products

```http
GET /api/products
```

Returns all inventory data.

---

## Create Reservation

```http
POST /api/reservations
```

### Request Body

```json
{
  "productId": 1,
  "warehouseId": 1,
  "quantity": 1
}
```

---

## Confirm Reservation

```http
POST /api/reservations/:id/confirm
```

---

## Cancel Reservation

```http
POST /api/reservations/:id/release
```

---

# Database Schema

The project uses Prisma with PostgreSQL.

Main models:

- Product
- Warehouse
- Inventory
- Reservation

---

# Getting Started

## 1. Clone Repository

```bash
git clone <your-repo-url>
cd inventory-reservation-system
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Setup Environment Variables

Create a `.env` file:

```env
DATABASE_URL="your_database_url"
```

---

## 4. Run Prisma Migration

```bash
npx prisma migrate dev
```

---

## 5. Seed Database

```bash
npx tsx prisma/seed.ts
```

---

## 6. Start Development Server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---




