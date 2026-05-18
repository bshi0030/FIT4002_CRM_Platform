# FIT4002 CRM Platform

A modern full-stack Customer Relationship Management (CRM) platform developed for the FIT4002 Software Engineering project. The system is designed to help organizations manage customer relationships, sales activities, communication records, and business workflows through an interactive and user-friendly interface.

---

# Project Overview

The FIT4002 CRM Platform aims to provide a scalable and intelligent solution for managing customer interactions and sales processes within an organization. The platform focuses on improving productivity, collaboration, and decision-making through centralized customer management and workflow tracking.

The system is built using the MERN stack architecture and follows modular software engineering principles to ensure maintainability, scalability, and clean separation of concerns.

---

# Key Features

## Contact & Account Management

* Create and manage customer profiles
* Store company and contact information
* Upload and manage company logos
* Attach files and documents to customer profiles
* Customer interaction timeline

## Sales Pipeline Management

* Track leads and opportunities
* Visual sales pipeline
* Deal stage management
* Pipeline progress tracking

## Task & Activity Management

* Task assignment and monitoring
* Kanban-style task management
* Activity logging and reminders

## Communication Tracking

* Centralized communication history
* Email and interaction logging
* Customer engagement tracking

## User & Role Management

* Authentication and authorization
* Role-based access control
* Team-based data visibility

## Security Features

* Password hashing using bcrypt
* JWT authentication
* Secure password reset workflow
* File upload validation

---

# Tech Stack

## Frontend

* React
* React Router DOM
* Axios
* CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Multer
* JWT Authentication
* Nodemailer

---

# System Architecture

The project follows a separated frontend-backend architecture:

```plaintext
Frontend (React)
        ↓
REST API (Express.js)
        ↓
MongoDB Database
```

The backend follows an MVC-inspired structure:

* Models
* Controllers
* Routes
* Middleware
* Services

---

# Project Structure

```plaintext
FIT4002_CRM_Platform/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   └── server.js
│
└── README.md
```

---

# Setup Instructions

## Prerequisites

Ensure the following are installed:

* Node.js
* npm
* MongoDB Atlas account or local MongoDB instance

---

# Installation

## Clone Repository

```bash
git clone <your-repository-url>
cd FIT4002_CRM_Platform
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

Run backend server:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```plaintext
http://localhost:5173
```

Backend runs on:

```plaintext
http://localhost:5000
```

---

# Current Implemented Features

## Sprint 1

* Customer profile creation
* Customer profile viewing
* Company logo upload
* MongoDB integration
* REST API integration
* Responsive customer UI
* File upload handling

---

# Future Enhancements

* Advanced analytics dashboard
* Real-time notifications
* Team collaboration features
* Gmail integration
* AI-powered workflow automation
* Customer engagement analytics
* Smart lead prioritization

---

# Security Considerations

* Input validation
* Secure password hashing
* JWT-based authentication
* File type validation
* File size restrictions
* Protected API routes

---

# Contributors

* Bilal
* Hiba
* Xin Thung
* Noorhan
* Jadon
* Mingze

---

# License

This project is developed for educational purposes as part of the FIT4002 Software Engineering unit at Monash University Malaysia.
