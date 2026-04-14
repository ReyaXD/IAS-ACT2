# Advanced Vulnerability Challenge: Grading Management System

This is an intentionally vulnerable Node.js web application designed for advanced cybersecurity training. It serves as an unguided capstone challenge where students must hunt for **20 security vulnerabilities** across the OWASP Top 10 framework.

## ⚠️ Warning
**Do not deploy this application on a public or production server.** It is highly vulnerable and easily exploitable. Only run it on a secure local machine or isolated virtual environment.

---

## 🛠️ Setup Instructions

### 1. Prerequisites
- **Node.js** (v14+ recommended)
- **XAMPP** (or any other local MySQL database server)

### 2. Database Setup
1. Start **Apache** and **MySQL** in XAMPP.
2. Go to `http://localhost/phpmyadmin`.
3. Import the `schema.sql` file located in this directory. It will automatically create the `infosec_grading` database.

### 3. Environment Configuration
Ensure your `.env` file matches your local MySQL config:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=infosec_grading
SESSION_SECRET=super_secret_session_key
PORT=3000
```

### 4. Running the Application
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Node.js application:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` to access the Grading Management System.
