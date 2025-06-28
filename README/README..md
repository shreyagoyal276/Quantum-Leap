# Auth Backend Project

This is a Node.js backend for managing authentication, stock notifications, billing, and trending/clothing-related functionality. It includes several controllers, models, and scheduled tasks.

## 📁 Project Structure

```
auth/
└── backend/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── .env
    ├── server.js
    ├── config.js
    ├── weather.cron.js
    ├── restockNotifier.js
    ├── trendingNotifier.js
    └── package.json
```

## 🚀 How to Run the Project Locally

### 1. Prerequisites

- Node.js (v14 or higher recommended)
- npm (Node Package Manager)
- MongoDB (local or cloud instance like MongoDB Atlas)

### 2. Setup Instructions

#### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name/auth/backend
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Configure Environment Variables

Create a `.env` file inside `auth/backend/` with the following keys:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

#### Step 4: Run the Server

```bash
node server.js
```

For development with auto-reloading:

```bash
npm install -g nodemon
nodemon server.js
```

## 🛠️ Features

- JWT Authentication
- CRUD APIs for Clothing Items and Stock
- Billing Controllers
- Scheduled Notifiers (Trending, Weather, Restocking)
- Middleware for secure routing

## 📌 Important Files

- `server.js`: Entry point of the backend
- `restockNotifier.js`: Handles stock notifications
- `weather.cron.js`: Weather-based triggers
- `trendingNotifier.js`: Sends trending product notifications

## 📫 Contact

For any queries or issues, feel free to open an issue or contact the maintainer.

---

> Make sure to update the MongoDB URI and secrets before running the project in production.