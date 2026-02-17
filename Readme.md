# 🏦 Banking Management System (Backend)

A secure and scalable Banking Management System built using Node.js, Express, and MongoDB.  
This project simulates real-world banking operations including account management, transactions, authentication, and ledger tracking.


## 🚀 Features

### 🔐 Authentication & Security
- User Registration & Login
- Password Hashing using bcrypt
- JWT-based Authentication
- Token Blacklisting (Logout Security)
- Role-Based Access Control (Admin/User)

### 💳 Banking Operations
- Create Bank Account
- Deposit Money
- Withdraw Money
- Balance Check
- Transaction History
- Ledger Entry Tracking
- Double Withdrawal Prevention
- Negative Balance Prevention

### 📊 System Design
- MVC Architecture
- Middleware-based Authentication
- Centralized Error Handling
- Modular Code Structure
- Environment-based Configuration


## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcrypt
- Nodemailer (Email Service)
- dotenv


## 📂 Project Structure

```

Banking-Management-System/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── user.controller.js
│   ├── account.controller.js
│   └── transaction.controller.js
│
├── models/
│   ├── user.model.js
│   ├── account.model.js
│   ├── transaction.model.js
│   ├── ledger.model.js
│   └── blackList.model.js
│
├── routes/
│   ├── user.routes.js
│   ├── account.routes.js
│   └── transaction.routes.js
│
├── middleware/
│   └── auth.middleware.js
│
├── services/
│   └── email.service.js
│
├── app.js
├── server.js
└── README.md

```

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/abhiraj33181/Banking-Management-System.git
cd Banking-Management-System
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create `.env` File

Create a `.env` file in the root directory and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### 4️⃣ Start Server

```bash
npm run dev
```

Server will start at:

```
http://localhost:5000
```


## 🔑 API Endpoints

### 👤 User Routes

| Method | Endpoint            | Description   |
| ------ | ------------------- | ------------- |
| POST   | /api/users/register | Register User |
| POST   | /api/users/login    | Login User    |
| POST   | /api/users/logout   | Logout User   |


### 💳 Account Routes

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| POST   | /api/accounts/create  | Create Account      |
| GET    | /api/accounts/balance | Check Balance       |
| GET    | /api/accounts/history | Transaction History |


### 💰 Transaction Routes

| Method | Endpoint                   | Description    |
| ------ | -------------------------- | -------------- |
| POST   | /api/transactions/deposit  | Deposit Money  |
| POST   | /api/transactions/withdraw | Withdraw Money |


## 🔒 Security Implementation

* Password stored as hashed value using bcrypt
* JWT authentication with middleware protection
* Token blacklist system implemented
* Double withdrawal prevention
* Negative balance validation
* Role-based access handling


## 🧠 Advanced Logic

* Atomic transaction handling
* Ledger system to maintain financial tracking
* Modular architecture for scalability
* Separation of controller, service, and middleware layers


## 📈 Future Improvements

* Rate Limiting
* API Documentation using Swagger
* Docker Deployment
* CI/CD Integration
* Unit & Integration Testing
* OTP Verification
* Transaction Audit Logs


## 🌍 Deployment

Recommended Deployment Platforms:

* Backend: Render
* Database: MongoDB Atlas
* Frontend (if applicable): Vercel


## 📌 Why This Project?

This project demonstrates:

* Backend Architecture Design
* Secure Authentication
* Financial Transaction Logic
* Real-world Banking Simulation
* Production-ready Code Structure


## 👨‍💻 Author

Abhishek Raj
Backend Developer | MERN Stack Developer
Focused on building secure and scalable backend systems.


## ⭐ If You Like This Project

Give it a star on GitHub ⭐