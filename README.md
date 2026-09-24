Secure File Sharing API

A secure file-sharing web application built with Node.js, Express,
MongoDB and React.

The project provides authenticated users with a private vault where they
can upload, view, download, rename and delete files securely.

Features

Authentication

User registration

User login

Password hashing with bcrypt

JWT-based authentication

Protected routes

User profile endpoint

File Management

Upload single or multiple files

Maximum 5 files per upload

Maximum 10 MB per file

Supported formats:

JPG

JPEG

PNG

PDF

Automatic unique filenames

File metadata stored in MongoDB

List uploaded files

Search files

Pagination

Download files

Rename files

Delete files

User ownership checks

Security

JWT authentication

Password hashing

Helmet security headers

CORS configuration

API rate limiting

File size validation

MIME type validation

File extension validation

Generated server-side filenames

Users can access only their own files

Centralized error handling for Multer/general errors

Tech Stack

Backend

Node.js

Express

MongoDB

Mongoose

JWT

bcryptjs

Multer

express-rate-limit

Helmet

CORS

Frontend

React

Vite

React Router

Context API

CSS

Project Structure

secure-file-sharing/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── rateLimitMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── File.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── fileRoutes.js
│   │
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
└── README.md

API Endpoints

Authentication

Method   Endpoint               Description

POST     /api/auth/register   Register a new user
POST     /api/auth/login      Login and receive JWT
GET      /api/auth/profile    Get authenticated user profile

Files

Method   Endpoint                    Description

POST     /api/files/upload         Upload files
GET      /api/files                Get user's files
GET      /api/files/:id            Get file metadata
GET      /api/files/:id/download   Download a file
PATCH    /api/files/:id            Rename a file
DELETE   /api/files/:id            Delete a file

Protected endpoints require:

Authorization: Bearer <JWT_TOKEN>

Rate Limits

The current application includes:

Operation      Limit

General API    100 requests / 15 minutes
Login          5 requests / 15 minutes
Registration   3 requests / hour
Upload         20 requests / hour
Download       100 requests / hour

The current express-rate-limit configuration is IP-based. A
user-specific Redis-based limiter can be added for stricter per-user
limits.

Environment Variables

Create a .env file inside the backend folder:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Do not commit .env to GitHub.

Running the Project

Backend

cd backend
npm install
npm run dev

The backend runs on:

http://localhost:3000

Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Then open the Vite development URL shown in the terminal.

Upload Validation

The backend accepts:

.jpg
.jpeg
.png
.pdf

Maximum file size:

10 MB

Maximum files in one upload:

5

Both the MIME type and file extension are checked before accepting a
file.

Security Flow

Client
   ↓
Express API
   ↓
Rate Limiter
   ↓
JWT Authentication
   ↓
Multer
   ↓
File Validation
   ↓
Local Storage
   ↓
MongoDB Metadata

Frontend

The frontend provides a dark security-vault style dashboard with:

Login/Register screens

Protected dashboard

File upload interface

File search

File list

Download controls

Rename controls

Delete controls

Upload selection cancellation

Toast notifications

Responsive layout

Storage

For the current starter implementation, uploaded files are stored
locally in:

backend/uploads/

File metadata is stored in MongoDB.

For a production/large-scale deployment, object storage such as Amazon
S3 or Cloudinary can be integrated.

Future Improvements

Possible advanced improvements include:

Redis-based rate limiting

User-specific upload limits

S3/Cloudinary storage

Signed download URLs

Malware scanning

Upload progress tracking

Large-file/chunked uploads

Advanced logging and monitoring

Role-based access control

GitHub

The project is organized as a single repository containing both the
backend and frontend.

Before pushing changes, verify that sensitive/generated files are
ignored:

node_modules/
.env
uploads/
dist/

Project Goal

This project was designed as a mini secure file-sharing system similar
in concept to a private Google Drive/WeTransfer-style service, with
authentication, protected file operations, validation and rate limiting.