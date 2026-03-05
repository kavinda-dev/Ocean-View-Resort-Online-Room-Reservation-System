# 🏨 Ocean View Resort – Online Room Reservation System

> A modern, distributed web-based reservation management system for **Ocean View Resort**, Galle, Sri Lanka.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](backend/pom.xml)
[![Java](https://img.shields.io/badge/Java-11+-orange.svg)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg?logo=mysql)](https://www.mysql.com/)
[![Maven](https://img.shields.io/badge/Maven-3.8+-C71A36.svg?logo=apachemaven)](https://maven.apache.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [Architecture](#️-architecture)
- [Room Rates](#-room-rates)
- [Prerequisites](#-prerequisites)
- [Setup Instructions](#️-setup-instructions)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Branching Strategy](#-branching-strategy)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 Project Overview

The **Ocean View Resort Online Room Reservation System** replaces manual, paper-based booking processes with a fully functional distributed web application. Designed for resort staff, the system enables seamless management of guest reservations, automatic bill calculations, printable invoices, and insightful reporting — all from a clean, responsive web interface.

**Key Highlights:**
- 🔐 Secure JWT-based authentication
- 📱 Fully responsive React.js frontend
- ☕ Robust Java Servlet backend following MVC & DAO patterns
- 📊 Real-time reports: daily, monthly, occupancy, and guest history

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Secure Login** | JWT-based authentication with SHA-256 hashed passwords |
| 📅 **Reservations** | Add, view, update, and cancel room bookings with overlap detection |
| 🧾 **Bill Calculation** | Automatic nightly rate calculation with printable invoice |
| 📊 **Reports** | Daily bookings, monthly income, occupancy stats, and guest history |
| 🛡️ **Security** | SQL injection prevention, input validation, and session management |
| 📱 **Responsive UI** | Mobile-friendly React frontend styled with Bootstrap 5 |
| 🗄️ **Singleton DB** | Thread-safe DatabaseConnection Singleton pattern |

---

## 🛠️ Technology Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend** | React.js, Bootstrap 5, Axios | React 18 |
| **Backend** | Java Servlets, Apache Tomcat | Java 11+, Tomcat 10 |
| **JSON Processing** | Google Gson | 2.10 |
| **Database** | MySQL, JDBC | MySQL 8.0 |
| **Build Tool** | Apache Maven | 3.8+ |

---

## 🏗️ Architecture

This project follows a **3-Tier Architecture** implementing the **MVC**, **DAO**, and **Singleton** design patterns:

```
┌─────────────────────────────────────────────┐
│       Presentation Layer  (React.js)         │
│   Login · Dashboard · Reservations           │
│   Invoice · Reports · Help                   │
└────────────────────┬────────────────────────┘
                     │  HTTP / REST API (JSON)
┌────────────────────▼────────────────────────┐
│      Application Layer  (Java Servlets)      │
│   LoginServlet · ReservationServlet          │
│   ReportServlet                              │
│   DAO: UserDAO · ReservationDAO              │
│   Singleton: DatabaseConnection              │
└────────────────────┬────────────────────────┘
                     │  JDBC
┌────────────────────▼────────────────────────┐
│          Data Layer  (MySQL 8.0)             │
│   Tables: users · reservations               │
└─────────────────────────────────────────────┘
```

---

## 💰 Room Rates

| Room Type | Rate (LKR / night) |
|---|---|
| 🛏️ Single | LKR 8,000 |
| 🛏️🛏️ Double | LKR 12,000 |
| 👑 Deluxe | LKR 18,000 |

---

## ✅ Prerequisites

Ensure the following are installed before setting up the project:

| Tool | Version | Download |
|---|---|---|
| Java JDK | 11+ | [Download](https://www.oracle.com/java/technologies/downloads/) |
| Apache Tomcat | 10+ | [Download](https://tomcat.apache.org/download-10.cgi) |
| Apache Maven | 3.8+ | [Download](https://maven.apache.org/download.cgi) |
| MySQL | 8.0+ | [Download](https://dev.mysql.com/downloads/) |
| Node.js & npm | 18+ | [Download](https://nodejs.org/) |
| Git | Latest | [Download](https://git-scm.com/) |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/kavinda-dev/Ocean-View-Resort-Online-Room-Reservation-System.git
cd Ocean-View-Resort-Online-Room-Reservation-System
```

---

### 2. Database Setup

```bash
# Log in to MySQL
mysql -u root -p

# Run the provided schema script
source database/schema.sql;
```

This will automatically:
- ✅ Create the `ocean_view_resort` database
- ✅ Create the `users` and `reservations` tables
- ✅ Insert a default admin user

**Default Admin Credentials:**

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `admin123` |

> ⚠️ **Important:** Change the password after your first login.

---

### 3. Configure Database Connection

Edit `backend/src/main/resources/db.properties`:

```properties
db.url=jdbc:mysql://localhost:3306/ocean_view_resort
db.username=root
db.password=your_mysql_password
```

---

### 4. Build & Deploy Backend

```bash
cd backend
mvn clean package

# Copy the WAR file to your Tomcat webapps directory
cp target/ocean-view-resort-1.0.0.war /path/to/tomcat/webapps/

# Start Tomcat
/path/to/tomcat/bin/startup.sh    # Linux / macOS
/path/to/tomcat/bin/startup.bat   # Windows
```

> Backend API will be available at: **`http://localhost:8080/ocean-view-resort`**

---

### 5. Setup & Run Frontend

```bash
cd frontend
npm install
npm start
```

> Frontend will be available at: **`http://localhost:3000`**

If your backend URL differs, edit `frontend/src/config/api.js`:

```js
export const API_BASE_URL = "http://localhost:8080/ocean-view-resort/api";
```

---

## 🗄️ Database Schema

Full schema: [`database/schema.sql`](database/schema.sql)

**`users` table**
```sql
CREATE TABLE users (
    user_id   INT AUTO_INCREMENT PRIMARY KEY,
    username  VARCHAR(100) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL,          -- SHA-256 hashed
    role      VARCHAR(50)  NOT NULL DEFAULT 'staff'
);
```

**`reservations` table**
```sql
CREATE TABLE reservations (
    reservation_id  INT AUTO_INCREMENT PRIMARY KEY,
    guest_name      VARCHAR(150) NOT NULL,
    address         TEXT,
    contact_number  VARCHAR(20)  NOT NULL,
    room_type       VARCHAR(50)  NOT NULL,
    check_in        DATE         NOT NULL,
    check_out       DATE         NOT NULL,
    total_amount    DOUBLE       NOT NULL,
    created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🌐 API Endpoints

All endpoints are prefixed with `/api`. Protected endpoints require a valid `Authorization: Bearer <token>` header.

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/login` | Authenticate user & receive JWT | ❌ |
| `POST` | `/reservations` | Create a new reservation | ✅ |
| `GET` | `/reservations` | Get all reservations | ✅ |
| `GET` | `/reservations/{id}` | Get reservation by ID | ✅ |
| `DELETE` | `/reservations/{id}` | Cancel a reservation | ✅ |
| `GET` | `/reports/daily?date=YYYY-MM-DD` | Daily bookings report | ✅ |
| `GET` | `/reports/monthly?month=YYYY-MM` | Monthly income report | ✅ |
| `GET` | `/reports/occupancy` | Room occupancy report | ✅ |
| `GET` | `/reports/guest-history?name=X` | Guest booking history | ✅ |

**Sample Success Response:**
```json
{
  "status": "success",
  "data": {
    "reservation_id": 101,
    "guest_name": "John Silva",
    "room_type": "Deluxe",
    "check_in": "2026-03-01",
    "check_out": "2026-03-05",
    "total_amount": 72000.00
  }
}
```

---

## 📁 Project Structure

```
Ocean-View-Resort-Online-Room-Reservation-System/
├── backend/
│   ├── src/main/java/com/oceanview/
│   │   ├── model/
│   │   │   ├── User.java
│   │   │   └── Reservation.java
│   │   ├── dao/
│   │   │   ├── UserDAO.java
│   │   │   └── ReservationDAO.java
│   │   ├── servlet/
│   │   │   ├── LoginServlet.java
│   │   │   ├── ReservationServlet.java
│   │   │   └── ReportServlet.java
│   │   └── util/
│   │       └── DatabaseConnection.java
│   ├── src/main/resources/
│   │   └── db.properties
│   ├── src/main/webapp/WEB-INF/
│   │   └── web.xml
│   └── pom.xml
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── config/
│       │   └── api.js
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Dashboard.jsx
│       │   ├── AddReservation.jsx
│       │   ├── ViewReservation.jsx
│       │   ├── Invoice.jsx
│       │   ├── Reports.jsx
│       │   └── Help.jsx
│       └── App.jsx
├── database/
│   └── schema.sql
├── github-workflow.md
├── prd.md
├── task.md
└── README.md
```

---

## 🌿 Branching Strategy

```
main  (stable production releases)
 └── develop  (integration branch)
      ├── feature/backend-api    (Java models, DAOs, Servlets)
      ├── feature/frontend-ui    (React pages & components)
      └── feature/reports        (Reports page & ReportServlet)
```

| Branch | Purpose |
|---|---|
| `main` | ⭐ Stable, production-ready releases |
| `develop` | 🔧 Integration branch — features merge here first |
| `feature/backend-api` | Java backend: models, DAOs, Servlets, DB connection |
| `feature/frontend-ui` | React frontend: Login, Dashboard, Reservations, Invoice, Help |
| `feature/reports` | Reports module: React page + ReportServlet |
| `hotfix/*` | Critical production bug fixes |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request against `develop`

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Ocean View Resort** · Galle, Sri Lanka · Version 1.0.0

*Built with ☕ Java & ⚛️ React*

</div>
