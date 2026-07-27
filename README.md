<div align="center">

# 🏨 Hotel Booking Management System

A full-stack hotel booking management platform for browsing rooms, managing bookings, and handling role-based hotel operations — built with **Next.js** on the frontend and **Node.js/Express** on the backend, backed by **Prisma ORM**.

[![Frontend](https://img.shields.io/badge/Frontend-Live-brightgreen)](https://hotel-booking-managemet-frontend.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Live-blue)](https://hotel-booking-management-backend-blush.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#-license)

[Live Demo](#-live-demo) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Setup](#-setup) • [API Reference](#-api-reference)

</div>

---

## 📖 Overview

Hotel Booking Management System is a complete booking platform that lets customers browse and reserve rooms while giving admins and managers full control over rooms, users, and bookings. It supports role-based access control, a wishlist system, and a clean, responsive UI.

---

## 🚀 Live Demo

| Service  | URL                                                                                                            |
| -------- | -------------------------------------------------------------------------------------------------------------- |
| Frontend | [hotel-booking-managemet-frontend.vercel.app](https://hotel-booking-managemet-frontend.vercel.app)             |
| Backend  | [hotel-booking-management-backend-blush.vercel.app](https://hotel-booking-management-backend-blush.vercel.app) |

---

## 📌 Features

### 🔐 Authentication

- User sign up / login
- Secure session handling
- Role-based access control (**Admin**, **Manager**, **Customer**)

### 🛏️ Booking System

- Browse available rooms
- Book rooms in real time
- View booking history
- Cancel existing bookings

### 🛠️ Admin / Manager

- Manage rooms (add, update, remove)
- Manage users
- Manage and oversee all bookings

### 👤 Customer

- Wishlist for favorite rooms
- "My Bookings" dashboard
- Profile management

---

## 🧱 Tech Stack

**Frontend**

- Next.js
- TypeScript
- Tailwind CSS
- Axios
- React Hook Form
- React Toastify

**Backend**

- Node.js / Express.js
- TypeScript
- Prisma ORM
- SQL Database (PostgreSQL / MySQL)
- Better Auth

---

## 🗄️ Database

- **ORM:** Prisma
- **Database:** SQL (PostgreSQL or MySQL)
- **Migrations:** Handled via Prisma Migrate

---

## ⚙️ Environment Variables

### Frontend — `.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=https://hotel-booking-management-backend-blush.vercel.app
```

### Backend — `.env`

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
CLIENT_URL=https://hotel-booking-managemet-frontend.vercel.app
```

> ⚠️ Never commit your actual `.env` files. Use `.env.example` as a template for contributors.

---

## 🛠 Setup

### Prerequisites

- Node.js (v18+ recommended)
- npm
- A PostgreSQL or MySQL database instance

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will typically run on `http://localhost:3000` and the backend on `http://localhost:5000`.

---

## 📡 API Reference

### Auth

| Method | Endpoint            | Description                        |
| ------ | ------------------- | ---------------------------------- |
| POST   | `/api/auth/sign-up` | Register a new user                |
| POST   | `/api/auth/sign-in` | Log in an existing user            |
| GET    | `/api/auth/me`      | Get the current authenticated user |

### Rooms

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| GET    | `/api/v1/rooms`     | List all rooms      |
| POST   | `/api/v1/rooms`     | Create a new room   |
| PUT    | `/api/v1/rooms/:id` | Update a room by ID |
| DELETE | `/api/v1/rooms/:id` | Delete a room by ID |

### Bookings

| Method | Endpoint               | Description            |
| ------ | ---------------------- | ---------------------- |
| GET    | `/api/v1/bookings`     | List bookings          |
| POST   | `/api/v1/bookings`     | Create a new booking   |
| DELETE | `/api/v1/bookings/:id` | Cancel a booking by ID |

---

## 📂 Project Structure

```
hotel-booking-management/
├── backend/
│   ├── prisma/
│   ├── src/
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Rahat**
Full Stack Developer

---

## 📄 License

This project is licensed under the **MIT License**.
