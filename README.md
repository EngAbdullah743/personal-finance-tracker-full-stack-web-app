# 💰 Personal Finance Tracker

A full-stack web application to track income, expenses, and budgets with interactive data visualizations.  
Built with **React.js**, **Node.js**, **Express.js**, and **MongoDB**, secured with **JWT authentication**.  

---

## 🚀 Tech Stack

**Frontend:**
- HTML, CSS, JavaScript
- React.js (Hooks & Context API)
- Recharts (data visualization)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose

**Authentication:**
- JWT (JSON Web Tokens)  
- Protected routes with middleware  

---

## ⚙️ Features

### 🔐 User Authentication
- Sign up / login system with JWT tokens.  
- Each user manages their own data securely.  

### 💵 Transactions
- Add income or expense with **amount, category, date, description**.  
- Edit and delete transactions.  
- Store securely in database.  

### 📊 Categories & Budgets
- Categories: Food, Rent, Transport, Entertainment, etc.  
- Set a **monthly budget** per category.  
- View budget progress with **color-coded progress bar** (green, yellow, red).  

### 📈 Data Visualization
- **Line Chart** → Expenses over time.  
- **Pie Chart** → Spending distribution by category.  
- **Bar Chart** → Compare income vs expenses.  

### 🔎 Filtering & Search
- Filter transactions by **date range** or **category**.  
- Search by transaction description.  

### 📋 Dashboard
- Quick stats: **total income, total expenses, net savings**.  
- Overspending alerts per category.  

---

## 📂 Project Structure

### Frontend

frontend/  
│── public/  
│ └── index.html  
│── src/  
│ ├── components/ (Auth, Dashboard, Transactions, Budget, Charts, Layout)  
│ ├── context/ (AuthContext, TransactionContext)  
│ ├── hooks/ (useAuth, useTransactions, useBudgets)  
│ ├── services/ (API services)  
│ ├── styles/ (CSS files)  
│ ├── App.jsx / index.js  


### Backend

backend/  
│── config/ (database, env config)  
│── controllers/ (auth, user, transaction, budget)  
│── middleware/ (auth, validation, error handling)  
│── models/ (User, Transaction, Budget)  
│── routes/ (authRoutes, transactionRoutes, budgetRoutes, userRoutes)  
│── utils/ (JWT, validators, constants)  
│── app.js / server.js  



---

## 🛠️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/personal-finance-tracker.git
cd personal-finance-tracker

Author -[Eng. Abdullah Ahmad]
