# 🌾 Agri Mandi Pakistan — Full Stack Web Application
### Node.js + Express + MySQL + HTML/CSS/JS

---

## 📁 Project Structure

```
agri-mandi/
│
├── database.sql              ← Run this in MySQL first!
│
├── frontend/
│   └── index.html            ← The website (public + admin panel)
│
└── backend/
    ├── server.js             ← Main server file (run this)
    ├── package.json          ← Dependencies list
    ├── .env                  ← Your database settings (edit this)
    │
    ├── config/
    │   └── db.js             ← MySQL connection
    │
    ├── middleware/
    │   └── auth.js           ← JWT login protection
    │
    ├── controllers/
    │   ├── authController.js      ← Login logic
    │   ├── ratesController.js     ← Crop rates CRUD
    │   ├── customersController.js ← Customer CRUD
    │   ├── cropsController.js     ← Crop directory CRUD
    │   └── contactController.js   ← Contact messages
    │
    └── routes/
        └── index.js          ← All API routes
```

---

## ⚙️ SETUP STEPS (Follow in order)

### STEP 1 — Install Required Software
Make sure you have these installed on your computer:
- **Node.js** → Download from https://nodejs.org (choose LTS version)
- **MySQL** → Download from https://dev.mysql.com/downloads/mysql/
- A code editor like **VS Code**

---

### STEP 2 — Set Up the Database

1. Open **MySQL Workbench** or **phpMyAdmin** or MySQL command line
2. Open the file `database.sql`
3. Run/Execute the entire file
4. It will create the database `agri_mandi` with all tables and sample data

Using command line:
```bash
mysql -u root -p < database.sql
```

---

### STEP 3 — Configure the Backend

1. Open the file `backend/.env`
2. Change `DB_PASSWORD` to your MySQL password:
```
DB_PASSWORD=your_actual_mysql_password
```
3. Save the file

---

### STEP 4 — Install Node.js Packages

Open a terminal/command prompt, go to the backend folder:
```bash
cd backend
npm install
```
This downloads Express, MySQL driver, JWT, bcrypt, etc.

---

### STEP 5 — Start the Server

In the terminal (inside the backend folder):
```bash
node server.js
```

You should see:
```
✅  MySQL connected successfully!
🌾  ================================
🌾  Agri Mandi Server Running!
🌾  URL: http://localhost:5000
🌾  API: http://localhost:5000/api
🌾  ================================
```

---

### STEP 6 — Open the Website

Open your browser and go to:
```
http://localhost:5000
```

That's it! 🎉

---

## 🔐 Admin Login
- **Username:** `admin`
- **Password:** `mandi123`

Click the **⚙ Admin** button on the top right of the website.

---

## 🌐 API Endpoints (for your report)

| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| POST | /api/auth/login | Public | Admin login |
| GET | /api/rates | Public | Today's crop rates |
| POST | /api/rates | Admin | Update a crop rate |
| DELETE | /api/rates/:id | Admin | Delete a rate |
| GET | /api/customers | Admin | Get all customers |
| POST | /api/customers | Admin | Add new customer |
| PUT | /api/customers/:id | Admin | Update customer |
| DELETE | /api/customers/:id | Admin | Delete customer |
| GET | /api/crops | Public | Get all crops |
| POST | /api/crops | Admin | Add new crop |
| DELETE | /api/crops/:id | Admin | Remove crop |
| POST | /api/contact | Public | Submit contact message |
| GET | /api/contact | Admin | View messages |

---

## 🗄️ Database Tables

| Table | Description |
|-------|-------------|
| `admin_users` | Admin login accounts |
| `categories` | Crop categories (Grain, Vegetable, etc.) |
| `crops` | Crop directory (name, urdu name, icon, season) |
| `daily_rates` | Daily price per crop per date |
| `customers` | Registered farmers/traders/buyers |
| `contact_messages` | Messages from contact form |

---

## 💡 Features

**Public Website:**
- 📊 Live daily rate cards for all crops
- 🔍 Search and filter by category
- 📺 Live price ticker at top
- 📱 Fully responsive (mobile friendly)
- 📬 Contact form (saves to database)

**Admin Panel:**
- 🔐 JWT-secured login
- 💹 Update crop rates (saved to MySQL)
- 👥 Add/delete/toggle customers
- 🌱 Add/remove crops
- 📈 Price reports and charts

---

## 🛠️ Technologies Used

| Technology | Purpose |
|-----------|---------|
| **HTML5 / CSS3 / JavaScript** | Frontend website |
| **Node.js** | JavaScript runtime for backend |
| **Express.js** | Web framework / API server |
| **MySQL** | Relational database |
| **mysql2** | Node.js MySQL driver |
| **bcryptjs** | Password hashing (security) |
| **jsonwebtoken (JWT)** | Admin authentication |
| **dotenv** | Environment configuration |
| **cors** | Cross-Origin Resource Sharing |

---

Made for Agri Mandi Final Year Project — Punjab, Pakistan 🌾
