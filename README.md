# 🏨 Ocean View Resort – Online Room Reservation System

> A distributed web-based reservation management system for Ocean View Resort, Galle, Sri Lanka.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](pom.xml)
[![Java](https://img.shields.io/badge/Java-11+-orange.svg)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Branching Strategy](#branching-strategy)
- [Contributing](#contributing)

---

## 📖 Project Overview

Ocean View Resort's Online Room Reservation System replaces manual paper-based booking with a modern, distributed web application. It enables resort staff to manage reservations, calculate bills, and generate reports efficiently.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Secure Login | JWT-based authentication with hashed passwords |
| 📅 Reservations | Add, view, update, and cancel room bookings |
| 🧾 Bill Calculation | Automatic nightly rate calculation with printable invoice |
| 📊 Reports | Daily, monthly, occupancy, and guest history reports |
| 🛡️ Security | SQL injection prevention, input validation, session management |
| 📱 Responsive UI | Mobile-friendly React frontend with Bootstrap |

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js 18, Bootstrap 5, Axios |
| Backend | Java 11, Java Servlets, Apache Tomcat 10 |
| JSON Processing | Gson 2.10 |
| Database | MySQL 8.0, JDBC |
| Build Tool | Maven 3.8+ |

---

## 🏗️ Architecture

This project follows a **3-Tier Architecture** with MVC, DAO, and Singleton design patterns:

```
┌─────────────────────────────────────────┐
│      Presentation Layer (React.js)       │
│   Login | Dashboard | Reservations       │
│   Invoice | Reports | Help               │
└────────────────┬────────────────────────┘
                 │ HTTP / REST API (JSON)
┌────────────────▼────────────────────────┐
│     Application Layer (Java Servlets)    │
│   LoginServlet | ReservationServlet      │
│   ReportServlet                          │
│   DAO: UserDAO | ReservationDAO          │
│   Singleton: DatabaseConnection          │
└────────────────┬────────────────────────┘
                 │ JDBC
┌────────────────▼────────────────────────┐
│        Data Layer (MySQL 8.0)            │
│   Tables: users | reservations           │
└─────────────────────────────────────────┘
```

---

## ✅ Prerequisites

Before you begin, ensure you have installed:

- **Java JDK 11+** – [Download](https://www.oracle.com/java/technologies/downloads/)
- **Apache Tomcat 10+** – [Download](https://tomcat.apache.org/download-10.cgi)
- **Maven 3.8+** – [Download](https://maven.apache.org/download.cgi)
- **MySQL 8.0+** – [Download](https://dev.mysql.com/downloads/)
- **Node.js 18+ & npm** – [Download](https://nodejs.org/)
- **Git** – [Download](https://git-scm.com/)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/kavinda-dev/Ocean-View-Resort-Online-Room-Reservation-System.git
cd Ocean-View-Resort-Online-Room-Reservation-System
```

### 2. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the schema script
source database/schema.sql;
```

This will:
- Create the `ocean_view_resort` database
- Create `users` and `reservations` tables
- Insert a default admin user

**Default Admin Credentials:**
| Field | Value |
|---|---|
| Username | `admin` |
| Password | `admin123` |

### 3. Configure Database Connection

Edit `backend/src/main/resources/db.properties`:

```properties
db.url=jdbc:mysql://localhost:3306/ocean_view_resort
db.username=root
db.password=your_mysql_password
```

### 4. Build & Deploy Backend

```bash
cd backend
mvn clean package

# Copy the WAR file to Tomcat webapps
cp target/ocean-view-resort-1.0.0.war /path/to/tomcat/webapps/

# Start Tomcat
/path/to/tomcat/bin/startup.sh   # Linux/Mac
/path/to/tomcat/bin/startup.bat  # Windows
```

Backend will be available at: `http://localhost:8080/ocean-view-resort`

### 5. Setup Frontend

```bash
cd frontend
npm install
```

Edit `frontend/src/config/api.js` and set your backend URL:

```js
export const API_BASE_URL = "http://localhost:8080/ocean-view-resort/api";
```

### 6. Run Frontend

```bash
cd frontend
npm start
```

Frontend will be available at: `http://localhost:3000`

---

## 🗄️ Database Setup

The full schema is available at [`database/schema.sql`](database/schema.sql).

### Tables

**`users`**
```sql
CREATE TABLE users (
    user_id   INT AUTO_INCREMENT PRIMARY KEY,
    username  VARCHAR(100) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL,
    role      VARCHAR(50)  NOT NULL DEFAULT 'staff'
);
```

**`reservations`**
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

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/login` | Authenticate user | ❌ |
| `POST` | `/api/reservations` | Create reservation | ✅ |
| `GET` | `/api/reservations/{id}` | Get reservation by ID | ✅ |
| `GET` | `/api/reservations` | Get all reservations | ✅ |
| `DELETE` | `/api/reservations/{id}` | Cancel reservation | ✅ |
| `GET` | `/api/reports/daily?date=YYYY-MM-DD` | Daily bookings | ✅ |
| `GET` | `/api/reports/monthly?month=YYYY-MM` | Monthly income | ✅ |
| `GET` | `/api/reports/occupancy` | Room occupancy | ✅ |
| `GET` | `/api/reports/guest-history?name=X` | Guest history | ✅ |

**Sample Response:**
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

## 🌿 Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Stable production-ready releases |
| `develop` | Integration branch for features |
| `feature/backend-api` | Backend servlet and DAO development |
| `feature/frontend-ui` | React UI development |
| `feature/reports` | Reports module |
| `hotfix/*` | Critical bug fixes |

---

## 💰 Room Rates

| Room Type | Rate (LKR/night) |
|---|---|
| Single | LKR 8,000 |
| Double | LKR 12,000 |
| Deluxe | LKR 18,000 |

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
│   ├── src/main/webapp/
│   │   └── WEB-INF/
│   │       └── web.xml
│   └── pom.xml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AddReservation.jsx
│   │   │   ├── ViewReservation.jsx
│   │   │   ├── Invoice.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── Help.jsx
│   │   ├── config/
│   │   │   └── api.js
│   │   └── App.jsx
│   └── package.json
├── database/
│   └── schema.sql
├── prd.md
├── task.md
└── README.md
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

*Ocean View Resort, Galle, Sri Lanka | Version 1.0.0*
