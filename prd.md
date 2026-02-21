# 📘 Product Requirements Document (PRD)
# 🏨 Ocean View Resort – Online Room Reservation System
**Location:** Galle, Sri Lanka

---

## 1. Project Overview

### 1.1 Problem Statement

Ocean View Resort currently manages room reservations manually using paper records. This results in:

- Booking conflicts
- Billing calculation errors
- Slow customer service
- Poor data tracking

The management requires a **distributed web-based system** using modern technologies to improve efficiency and reliability.

---

## 2. Project Objectives

The system must:

- ✅ Provide secure login authentication
- ✅ Allow staff to manage reservations
- ✅ Automatically calculate guest bills
- ✅ Store reservation data in MySQL database
- ✅ Provide RESTful web services
- ✅ Follow 3-Tier Architecture
- ✅ Implement MVC, DAO, and Singleton patterns

---

## 3. System Architecture

### Architecture Style
- **3-Tier Architecture**
- **MVC Pattern**
- **RESTful Web Services**

### 3-Tier Architecture Design

#### 1️⃣ Presentation Layer (Frontend)
- **Technology:** React.js (Single Page Application)
- **Libraries:** Axios, HTML5, CSS3, Bootstrap

**Responsibilities:**
- Display UI
- Form validations
- API requests to backend
- Display results and reports

#### 2️⃣ Application Layer (Backend)
- **Technology:** Java, Java Servlets, Apache Tomcat
- **Libraries:** Gson (JSON conversion)

**Responsibilities:**
- Business logic processing
- Request handling
- Validation
- Bill calculation
- Returning JSON responses

#### 3️⃣ Data Layer
- **Technology:** MySQL, JDBC
- **Pattern:** DAO Pattern

**Responsibilities:**
- Store reservation data
- Execute queries
- Maintain data consistency

---

## 4. Functional Requirements

### 4.1 User Authentication

| Item        | Detail                                      |
|-------------|---------------------------------------------|
| Description | System must allow secure login              |
| Input       | Username, Password                          |
| Process     | Servlet verifies credentials via DAO; password encrypted |
| Output      | Login success message or invalid credential error |

### 4.2 Add New Reservation

**Required Fields:**

| Field             | Description                        |
|-------------------|------------------------------------|
| Reservation Number | Auto-generated                    |
| Guest Name        | Full name of guest                 |
| Address           | Guest address                      |
| Contact Number    | Phone number                       |
| Room Type         | Single / Double / Deluxe           |
| Check-in Date     | Arrival date                       |
| Check-out Date    | Departure date                     |

**Validations:**
- Empty field restriction
- Phone number format check
- Check-out date must be after check-in date
- No overlapping reservations for same room

### 4.3 View Reservation Details

- Search by Reservation Number
- Display: Guest details, Room type, Dates, Total amount

### 4.4 Calculate and Print Bill

**Business Logic:**

```
Number of Nights = CheckOut Date − CheckIn Date
Total Amount     = Nights × Room Rate
```

**Room Rates:**

| Room Type | Rate (LKR/night) |
|-----------|-----------------|
| Single    | LKR 8,000       |
| Double    | LKR 12,000      |
| Deluxe    | LKR 18,000      |

- Servlet calculates bill and returns JSON response
- React displays printable invoice format

### 4.5 Reports (Value Addition)

| Report                | Description                          |
|-----------------------|--------------------------------------|
| Daily Booking Report  | All bookings for a specific day      |
| Monthly Income Report | Total income generated per month     |
| Room Occupancy Report | Occupancy statistics per room type   |
| Guest History Report  | Past and upcoming reservations       |

### 4.6 Help Section

- Instructions for staff
- System usage guidelines
- Error message explanations

---

## 5. Non-Functional Requirements

### 5.1 Security
- Password hashing
- SQL Injection prevention
- Session handling
- Input validation

### 5.2 Performance
- API response < 2 seconds
- Optimized SQL queries
- Indexed reservation ID

### 5.3 Usability
- Clean UI
- Mobile responsive
- Clear error messages

---

## 6. Database Design

### 1️⃣ Users Table

| Field     | Type         | Notes           |
|-----------|--------------|-----------------|
| user_id   | INT          | Primary Key, AI |
| username  | VARCHAR(100) |                 |
| password  | VARCHAR(255) | Hashed          |
| role      | VARCHAR(50)  |                 |

### 2️⃣ Reservations Table

| Field          | Type         | Notes           |
|----------------|--------------|-----------------|
| reservation_id | INT          | Primary Key, AI |
| guest_name     | VARCHAR(150) |                 |
| address        | TEXT         |                 |
| contact_number | VARCHAR(20)  |                 |
| room_type      | VARCHAR(50)  |                 |
| check_in       | DATE         |                 |
| check_out      | DATE         |                 |
| total_amount   | DOUBLE       |                 |

---

## 7. Design Patterns Used

### 🔹 MVC Pattern

| Component  | Role              |
|------------|-------------------|
| Model      | Entity Classes    |
| View       | React UI          |
| Controller | Java Servlets     |

**Purpose:** Separation of concerns, clean structure, maintainability

### 🔹 DAO Pattern

**Classes:** `UserDAO`, `ReservationDAO`

**Purpose:** Separate database logic, easy database replacement, improved testability

### 🔹 Singleton Pattern

**Class:** `DatabaseConnection`

**Purpose:** Only one database connection instance, memory efficiency, controlled resource usage

---

## 8. REST API Design

### Sample Endpoints

| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| POST   | `/login`             | Authenticate user  |
| POST   | `/reservations`      | Add reservation    |
| GET    | `/reservations/{id}` | Get reservation    |
| GET    | `/reports/daily`     | Daily report       |
| DELETE | `/reservations/{id}` | Cancel booking     |

**Response Format:** JSON (using Gson)

---

## 9. Technology Stack Summary

| Layer             | Technology                     |
|-------------------|-------------------------------|
| Frontend          | React.js, Bootstrap            |
| API Communication | Axios                          |
| Backend           | Java Servlets                  |
| Server            | Apache Tomcat                  |
| JSON              | Gson                           |
| Database          | MySQL                          |
| Connectivity      | JDBC                           |

---

*Document Version: 1.0 | Date: February 2026*
