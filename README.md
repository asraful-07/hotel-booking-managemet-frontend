# 🏨 Hotel Booking Management System

A full-stack hotel booking management platform built with Next.js (Frontend) and Node.js/Express (Backend) using Prisma ORM with SQL database.

---

## 🚀 Live Demo

Frontend: https://hotel-booking-managemet-frontend.vercel.app  
Backend: https://hotel-booking-management-backend-blush.vercel.app  

---

## 📌 Features

### Authentication
- User sign up / login
- Secure session handling
- Role-based access (Admin, Manager, Customer)

### Booking System
- Browse rooms
- Book rooms
- View bookings
- Cancel bookings

### Admin / Manager
- Manage rooms
- Manage users
- Manage bookings

### Customer
- Wishlist
- My bookings
- Profile management

---

## 🧱 Tech Stack

Frontend:
- Next.js
- TypeScript
- Tailwind CSS
- Axios
- React Hook Form
- React Toastify

Backend:
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- SQL Database (PostgreSQL/MySQL)
- Better Auth

---

## 🗄️ Database

- ORM: Prisma
- Database: SQL
- Migrations handled by Prisma

---

## ⚙️ Environment Variables

### Frontend (.env.local)
NEXT_PUBLIC_API_BASE_URL=https://hotel-booking-management-backend-blush.vercel.app

### Backend (.env)
PORT=5000  
DATABASE_URL=your_database_url  
JWT_SECRET=your_secret  
CLIENT_URL=https://hotel-booking-managemet-frontend.vercel.app  

---

## 🛠 Setup

### Backend
```
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Frontend
```
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

### Auth
POST /api/auth/sign-in  
POST /api/auth/sign-up  
GET  /api/auth/me  

### Rooms
GET    /api/v1/rooms  
POST   /api/v1/rooms  
PUT    /api/v1/rooms/:id  
DELETE /api/v1/rooms/:id  

### Bookings
GET    /api/v1/bookings  
POST   /api/v1/bookings  
DELETE /api/v1/bookings/:id  

---

## 👨‍💻 Author

Rahat  
Full Stack Developer

---

## 📄 License

MIT License
