# 🚀 AI Prompt Library

## 📌 Overview

AI Prompt Library is a full-stack web application that allows users to create, view, and manage AI prompts in an organized and user-friendly way.

It is built using **React (frontend)** and **Node.js with Express (backend)**, with **SQLite** as the database and **Redis** for tracking prompt views. Docker support is included for containerized execution.

---

## ✨ Features

* ➕ Add new prompts (title, content, complexity)
* 📋 View all prompts in a responsive UI
* 🔍 View detailed prompt information
* ⚡ Loading and error handling
* 🧠 Input validation on both frontend and backend
* 📊 Redis-based view count tracking (optional)
* 🐳 Docker support for running full system

---

## 🧱 Tech Stack

### Frontend

* React.js
* CSS (Responsive UI)

### Backend

* Node.js
* Express.js

### Database

* SQLite

### Cache (Optional)

* Redis

### DevOps

* Docker
* Docker Compose

---

## 📂 Project Structure

```
ai-prompt-library/
│
├── backend/
│   ├── index.js
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## ⚙️ API Endpoints

### 🔹 Get All Prompts

```
GET /prompts/
```

### 🔹 Get Single Prompt

```
GET /prompts/:id/
```

### 🔹 Create Prompt

```
POST /prompts/
```

---

## ▶️ Run Locally

### 1️⃣ Backend

```
cd backend
npm install
node index.js
```

### 2️⃣ Frontend

```
cd frontend
npm install
npm start
```

👉 Open: http://localhost:3000

---

## 🐳 Run with Docker (Optional)

```
docker-compose up --build
```

👉 Runs:

* Frontend (React)
* Backend (Node.js)
* Redis

---

## 🧠 How It Works

1. User interacts with React frontend
2. Frontend sends API requests using fetch
3. Backend handles requests using Express
4. Data is stored in SQLite database
5. Redis tracks view count for prompts
6. Response is returned and UI updates

---

## 💡 Key Design Decisions

* SQLite used for simplicity and easy setup
* Redis used for fast in-memory operations (view tracking)
* Redis is optional to ensure system stability
* Clean separation between frontend and backend

---

## 🎯 Conclusion

This project demonstrates:

* Full-stack development
* API design and integration
* State management in React
* Database handling with SQLite
* Basic caching with Redis
* Containerization using Docker

---

## 📌 Author

Built as part of a full-stack assignment to demonstrate practical development skills.
