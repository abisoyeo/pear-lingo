# Pear Lingo

Pear Lingo is a global platform for connecting with language partners.  
Practice real conversations, make friends, and improve your language skills together in a interactive environment.

## Live Site

[https://pearlingo.onrender.com](https://pearlingo.onrender.com)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [License](#license)

---

## Features

- **User Authentication**
  - Secure signup/login with JWT
  - OAuth integration (Google)
  - Email verification and password reset flows
- **Profile Customization**
  - Set bio, profile picture, native/learning languages, and location
  - Random avatar generator
- **Language Partner Matching**
  - Discover and connect with recommended users based on language interests
- **Friend System**
  - Send, accept, and manage friend requests
  - Email notifications for new friend requests
- **Real-Time Chat & Video**
  - 1:1 messaging powered by [GetStream Chat](https://getstream.io/)
  - High-quality video calls via [GetStream Video SDK](https://getstream.io/video/)
  - Email notifications for unread messages
- **Notifications**
  - In-app and email notifications for friend requests, unread messages, password changes, and more
- **Responsive UI**
  - Modern, mobile-friendly interface
  - Multiple themes (Tailwind CSS + DaisyUI)
- **Security & Monitoring**
  - Helmet, rate limiting, and CORS for secure API access
  - Robust error handling and logging (Winston, CloudWatch)
  - Monitoring via Sentry
- **Transactional Emails**
  - Email verification, password reset, password change, friend requests, unread messages
  - Powered by [Mailtrap](https://mailtrap.io/) with custom HTML templates

---

## Tech Stack

**Frontend**

- React 19
- Vite
- Tailwind CSS & DaisyUI
- Zustand (state management)
- React Router v7
- React Hot Toast (notifications)
- Lucide React (icons)
- @tanstack/react-query (data fetching/caching)
- GetStream Chat & Video SDKs (`stream-chat`, `stream-chat-react`, `@stream-io/video-react-sdk`)
- Axios

**Backend**

- Node.js (Express)
- MongoDB (Mongoose)
- JWT Authentication
- OAuth (Google via Passport)
- GetStream Chat API (`stream-chat`)
- Sentry (error monitoring)
- Winston & CloudWatch (logging)
- Joi (validation)
- Helmet, CORS, Cookie-Parser, Rate Limiting
- Mailtrap (transactional emails)

**DevOps & Deployment**

- Render.com (hosting)
- Nodemon (dev server)
- Environment-based config

---

## Project Structure

```
/
├── client/   # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── lib/
│   │   ├── constants/
│   │   └── utils/
│   ├── public/
│   ├── index.html
│   └── tailwind.config.js
├── server/   # Express backend
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── chat/
│   │   │   └── users/
│   │   ├── shared/
│   │   │   ├── config/
│   │   │   ├── middlewares/
│   │   │   ├── utils/
│   │   │   └── mailtrap/
│   │   │        ├── emails.js
│   │   │        ├── emailTemplates.js
│   │   │        └── mailtrap.config.js
│   │   └── server.js
│   └── .env.example
├── package.json
```

---

## Transactional Emails

Pear Lingo sends transactional emails for:

- **Email Verification**: Custom HTML template with verification code
- **Password Reset & Change**: Secure reset links and confirmation emails
- **Friend Requests**: Notification with sender details and direct link to accept/decline
- **Unread Messages**: Notification with sender names and direct link to read messages

All emails are sent via [Mailtrap](https://mailtrap.io/) using custom HTML templates for branding and clarity.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

Install dependencies for both client and server:

```sh
npm install --prefix server
npm install --prefix client
```

---

## Environment Variables

Create `.env` files in both `server` and `client` directories.

### Server (`server/.env`)

See `server/.env.example` for all options:

```
PORT=3000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
NODE_ENV=development
LOG_LEVEL=debug

# GetStream Chat & Video
STREAM_API_KEY=your-stream-api-key
STREAM_API_SECRET=your-stream-api-secret

# Sentry
SENTRY_DSN=your-sentry-dsn

# AWS CloudWatch (optional)
CLOUDWATCH_LOG_GROUP=your-cloudwatch-log-group
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key

# Mailtrap
MAILTRAP_ENDPOINT=your-mailtrap-endpoint
MAILTRAP_TOKEN=your-mailtrap-token
```

### Client (`client/.env`)

```
VITE_API_URL=http://localhost:3000/api
VITE_STREAM_API_KEY=your-stream-api-key
```

---

## Development

Start the backend server:

```sh
npm run dev --prefix server
```

Start the frontend client:

```sh
npm run dev --prefix client
```

- Client: [http://localhost:5173](http://localhost:5173)
- Server: [http://localhost:3000](http://localhost:3000)

---

## Deployment

Pear Lingo is deployed on [Render](https://render.com).  
Live: [https://pearlingo.onrender.com](https://pearlingo.onrender.com)

---

## License

ISC
