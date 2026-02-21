package com.oceanview.servlet;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.oceanview.dao.ReservationDAO;
import com.oceanview.model.Reservation;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

/**
 * ReservationServlet – Handles /api/reservations
 * MVC Controller: manages CRUD operations for reservations.
 *
 * POST /api/reservations → Create reservation
 * GET /api/reservations → Get all reservations
 * GET /api/reservations/{id} → Get reservation by ID
 * DELETE /api/reservations/{id} → Cancel reservation
 */
@WebServlet("/api/reservations/*")
public class ReservationServlet extends HttpServlet {

    private final ReservationDAO dao = new ReservationDAO();
    private final Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDate.class,
                    (com.google.gson.JsonSerializer<LocalDate>) (src, t, ctx) -> ctx.serialize(src.toString()))
            .create();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setHeaders(resp);
        PrintWriter out = resp.getWriter();

        try {
            JsonObject body = gson.fromJson(req.getReader(), JsonObject.class);

            String guestName = body.get("guestName").getAsString().trim();
            String address = body.get("address").getAsString().trim();
            String contactNumber = body.get("contactNumber").getAsString().trim();
            String roomType = body.get("roomType").getAsString().trim();
            String checkInStr = body.get("checkIn").getAsString().trim();
            String checkOutStr = body.get("checkOut").getAsString().trim();

            // Validate required fields
            if (guestName.isEmpty() || contactNumber.isEmpty() || roomType.isEmpty()
                    || checkInStr.isEmpty() || checkOutStr.isEmpty()) {
                resp.setStatus(400);
                out.print(error("All fields are required."));
                return;
            }

            // Validate phone number format
            if (!contactNumber.matches("^[0-9]{10}$")) {
                resp.setStatus(400);
                out.print(error("Contact number must be 10 digits."));
                return;
            }

            LocalDate checkIn = LocalDate.parse(checkInStr);
            LocalDate checkOut = LocalDate.parse(checkOutStr);

            // Validate date logic
            if (!checkOut.isAfter(checkIn)) {
                resp.setStatus(400);
                out.print(error("Check-out date must be after check-in date."));
                return;
            }

            // Check room overlap
            if (dao.checkOverlap(roomType, checkIn, checkOut)) {
                resp.setStatus(409);
                out.print(error("Room not available for the selected dates."));
                return;
            }

            // Calculate bill
            long nights = java.time.temporal.ChronoUnit.DAYS.between(checkIn, checkOut);
            double totalAmount = ReservationDAO.calculateAmount(roomType, nights);

            // Build and save reservation
            Reservation r = new Reservation(guestName, address, contactNumber, roomType, checkIn, checkOut,
                    totalAmount);
            int id = dao.addReservation(r);

            if (id > 0) {
                JsonObject data = new JsonObject();
                data.addProperty("reservationId", id);
                data.addProperty("totalAmount", totalAmount);
                data.addProperty("nights", nights);
                out.print(success("Reservation created successfully.", data));
            } else {
                resp.setStatus(500);
                out.print(error("Failed to save reservation."));
            }
        } catch (DateTimeParseException e) {
            resp.setStatus(400);
            out.print(error("Invalid date format. Use YYYY-MM-DD."));
        } catch (Exception e) {
            resp.setStatus(500);
            out.print(error("Server error: " + e.getMessage()));
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setHeaders(resp);
        PrintWriter out = resp.getWriter();

        String pathInfo = req.getPathInfo();

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                // GET all reservations
                List<Reservation> list = dao.getAllReservations();
                out.print(gson.toJson(list));
            } else {
                // GET by ID
                int id = Integer.parseInt(pathInfo.substring(1));
                Reservation r = dao.getReservationById(id);
                if (r != null) {
                    out.print(gson.toJson(r));
                } else {
                    resp.setStatus(404);
                    out.print(error("Reservation not found."));
                }
            }
        } catch (NumberFormatException e) {
            resp.setStatus(400);
            out.print(error("Invalid reservation ID."));
        } catch (Exception e) {
            resp.setStatus(500);
            out.print(error("Server error: " + e.getMessage()));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setHeaders(resp);
        PrintWriter out = resp.getWriter();

        String pathInfo = req.getPathInfo();
        try {
            if (pathInfo == null) {
                resp.setStatus(400);
                out.print(error("Reservation ID required."));
                return;
            }
            int id = Integer.parseInt(pathInfo.substring(1));
            boolean deleted = dao.deleteReservation(id);
            if (deleted) {
                out.print(success("Reservation cancelled successfully.", new JsonObject()));
            } else {
                resp.setStatus(404);
                out.print(error("Reservation not found."));
            }
        } catch (NumberFormatException e) {
            resp.setStatus(400);
            out.print(error("Invalid reservation ID."));
        }
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setStatus(200);
    }

    private void setHeaders(HttpServletResponse resp) {
        resp.setContentType("application/json;charset=UTF-8");
        resp.setHeader("Access-Control-Allow-Origin", "*");
    }

    private String success(String msg, JsonObject data) {
        JsonObject o = new JsonObject();
        o.addProperty("status", "success");
        o.addProperty("message", msg);
        o.add("data", data);
        return gson.toJson(o);
    }

    private String error(String msg) {
        JsonObject o = new JsonObject();
        o.addProperty("status", "error");
        o.addProperty("message", msg);
        return gson.toJson(o);
    }
}
