# ✅ Task Checklist
# 🏨 Ocean View Resort – Online Room Reservation System

---

## Phase 1: Project Setup

- [x] Create project folder structure (frontend & backend)
- [x] Set up React.js frontend project (Create React App or Vite)
- [x] Set up Java backend project (Maven/Gradle with Servlet support)
- [x] Configure Apache Tomcat server (web.xml configured)
- [x] Set up MySQL database (schema.sql ready)
- [x] Add project dependencies (Gson, JDBC driver, Bootstrap, Axios)
- [x] Configure CORS in the backend for React-Tomcat communication

---

## Phase 2: Database Setup

- [x] Create MySQL database: `ocean_view_resort`
- [x] Create `users` table (user_id, username, password, role)
- [x] Create `reservations` table (reservation_id, guest_name, address, contact_number, room_type, check_in, check_out, total_amount)
- [x] Seed default admin user (with hashed password)
- [x] Add indexes on `reservation_id` and `check_in` / `check_out` columns

---

## Phase 3: Backend – Design Patterns & Core Classes

### Singleton Pattern
- [x] Create `DatabaseConnection.java` class using Singleton pattern
- [x] Test single connection instance across multiple DAO calls

### DAO Pattern
- [x] Create `UserDAO.java` with:
  - [x] `getUserByUsername(String username)` method
  - [x] `validateLogin(String username, String password)` method
- [x] Create `ReservationDAO.java` with:
  - [x] `addReservation(Reservation r)` method
  - [x] `getReservationById(int id)` method
  - [x] `getAllReservations()` method
  - [x] `updateReservation(Reservation r)` method
  - [x] `deleteReservation(int id)` method
  - [x] `checkOverlap(String roomType, Date checkIn, Date checkOut)` method

### Model Classes (MVC – Model)
- [x] Create `User.java` entity class
- [x] Create `Reservation.java` entity class

---

## Phase 4: Backend – REST API (Servlets / Controllers)

### Authentication
- [x] Create `LoginServlet.java` mapped to `POST /login`
  - [x] Accept JSON body (username, password)
  - [x] Validate credentials via `UserDAO`
  - [x] Return JSON success/failure response using Gson
  - [x] Implement session handling

### Reservations
- [x] Create `ReservationServlet.java` mapped to `/reservations`
  - [x] `POST /reservations` – Add new reservation
    - [x] Validate all required fields
    - [x] Validate phone number format
    - [x] Validate check-out > check-in
    - [x] Check for room overlap
    - [x] Calculate total amount
    - [x] Save via `ReservationDAO`
    - [x] Return JSON response with reservation ID
  - [x] `GET /reservations/{id}` – Fetch reservation by ID
    - [x] Return guest details, room type, dates, total amount
  - [x] `DELETE /reservations/{id}` – Cancel/delete reservation

### Bill Calculation
- [x] Implement bill calculation logic in Servlet:
  - [x] `nights = checkOut - checkIn`
  - [x] Room rates: Single=8000, Double=12000, Deluxe=18000
  - [x] `totalAmount = nights × roomRate`

### Reports
- [x] Create `ReportServlet.java` mapped to `/reports`
  - [x] `GET /reports/daily` – Bookings for a specific date
  - [x] `GET /reports/monthly` – Income for a specific month
  - [x] `GET /reports/occupancy` – Room occupancy statistics
  - [x] `GET /reports/guest-history` – Guest reservation history

---

## Phase 5: Frontend – React.js UI

### Project Structure
- [x] Set up React Router for SPA navigation
- [x] Configure Axios base URL pointing to Tomcat backend
- [x] Set up Bootstrap for responsive layout

### Pages / Components

#### Login Page
- [x] Create `Login.jsx` component
  - [x] Username and password input fields
  - [x] Form validation (empty checks)
  - [x] Call `POST /login` via Axios
  - [x] Store session/token on success
  - [x] Display error message on failure
  - [x] Redirect to dashboard on success

#### Dashboard / Home
- [x] Create `Dashboard.jsx` component
  - [x] Navigation menu (Reservations, Reports, Help)
  - [x] Summary statistics (total bookings, today's check-ins)

#### Add Reservation Page
- [x] Create `AddReservation.jsx` component
  - [x] Form with all required fields
  - [x] Client-side validations:
    - [x] Empty field checks
    - [x] Phone number format validation
    - [x] Date logic validation (check-out > check-in)
  - [x] Call `POST /reservations` via Axios
  - [x] Display success message with reservation ID

#### View Reservation Page
- [x] Create `ViewReservation.jsx` component
  - [x] Search input for Reservation Number
  - [x] Call `GET /reservations/{id}` via Axios
  - [x] Display full reservation details in a card/table
  - [x] "Print Bill" button

#### Bill / Invoice Page
- [x] Create `Invoice.jsx` component
  - [x] Display resort header with logo
  - [x] Guest name, contact, address
  - [x] Room type, check-in, check-out, number of nights
  - [x] Total amount calculation displayed
  - [x] Print button (use `window.print()`)

#### Reports Page
- [x] Create `Reports.jsx` component
  - [x] Tab or dropdown to select report type
  - [x] Date/month picker inputs
  - [x] Display report data in table format
  - [x] Daily Booking Report view
  - [x] Monthly Income Report view
  - [x] Room Occupancy Report view
  - [x] Guest History Report view

#### Help Page
- [x] Create `Help.jsx` component
  - [x] Staff usage instructions
  - [x] System guidelines
  - [x] Common error message explanations

---

## Phase 6: Security Implementation

- [x] Hash passwords using bcrypt or SHA-256 before storing
- [x] Use PreparedStatements in all DAO methods (SQL injection prevention)
- [x] Implement session management in Servlets
- [x] Validate all inputs on both frontend and backend
- [x] Restrict report and reservation endpoints to authenticated users

---

## Phase 7: Testing

- [x] Test `DatabaseConnection` Singleton behavior
- [x] Test `UserDAO` login validation
- [x] Test `ReservationDAO` CRUD operations
- [x] Test `POST /login` endpoint (valid & invalid credentials)
- [x] Test `POST /reservations` endpoint (valid, missing fields, overlapping dates)
- [x] Test `GET /reservations/{id}` endpoint (valid ID, invalid ID)
- [x] Test `DELETE /reservations/{id}` endpoint
- [x] Test all report endpoints
- [x] Test frontend login flow
- [x] Test add reservation form validations
- [x] Test bill calculation display
- [x] Test print invoice functionality
- [x] Test responsive design on mobile screens

---

## Phase 8: Finalization & Documentation

- [x] Clean up unused code and comments
- [x] Ensure all API responses follow consistent JSON format
- [x] Write `README.md` with setup and run instructions
- [x] Add database SQL dump / setup script (`schema.sql`)
- [x] Final review of all pages and features
- [x] Prepare project for submission / deployment

---

## 📊 Progress Summary

| Phase                            | Status         |
|----------------------------------|----------------|
| Phase 1: Project Setup           | ✅ Complete    |
| Phase 2: Database Setup          | ✅ Complete    |
| Phase 3: Backend Core Classes    | ✅ Complete    |
| Phase 4: Backend REST API        | ✅ Complete    |
| Phase 5: Frontend React UI       | ✅ Complete    |
| Phase 6: Security                | ✅ Complete    |
| Phase 7: Testing                 | ✅ Complete    |
| Phase 8: Finalization            | ✅ Complete    |

---

*Task Version: 2.0 | Last Updated: March 2026*
