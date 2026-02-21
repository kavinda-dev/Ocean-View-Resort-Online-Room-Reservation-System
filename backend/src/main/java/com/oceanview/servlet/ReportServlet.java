package com.oceanview.servlet;

import com.google.gson.*;
import com.oceanview.dao.ReservationDAO;
import com.oceanview.model.Reservation;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.util.*;

/**
 * ReportServlet – Handles /api/reports/*
 * MVC Controller: generates daily, monthly, occupancy, and guest history
 * reports.
 */
@WebServlet("/api/reports/*")
public class ReportServlet extends HttpServlet {

    private final ReservationDAO dao = new ReservationDAO();
    private final Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDate.class,
                    (JsonSerializer<LocalDate>) (src, t, ctx) -> ctx.serialize(src.toString()))
            .create();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");
        resp.setHeader("Access-Control-Allow-Origin", "*");
        PrintWriter out = resp.getWriter();

        String pathInfo = req.getPathInfo();
        if (pathInfo == null) {
            resp.setStatus(400);
            out.print(error("Report type required."));
            return;
        }

        try {
            switch (pathInfo) {
                case "/daily":
                    handleDaily(req, out, resp);
                    break;
                case "/monthly":
                    handleMonthly(req, out, resp);
                    break;
                case "/occupancy":
                    handleOccupancy(out);
                    break;
                case "/guest-history":
                    handleGuestHistory(req, out, resp);
                    break;
                default:
                    resp.setStatus(404);
                    out.print(error("Unknown report type."));
            }
        } catch (Exception e) {
            resp.setStatus(500);
            out.print(error("Server error: " + e.getMessage()));
        }
    }

    /** GET /api/reports/daily?date=YYYY-MM-DD */
    private void handleDaily(HttpServletRequest req, PrintWriter out, HttpServletResponse resp) {
        String dateParam = req.getParameter("date");
        if (dateParam == null || dateParam.isBlank()) {
            resp.setStatus(400);
            out.print(error("Query param 'date' (YYYY-MM-DD) is required."));
            return;
        }
        LocalDate date = LocalDate.parse(dateParam);
        List<Reservation> list = dao.getReservationsByDate(date);

        JsonObject result = new JsonObject();
        result.addProperty("date", date.toString());
        result.addProperty("totalBookings", list.size());
        result.add("reservations", gson.toJsonTree(list));
        out.print(success("Daily report generated.", result));
    }

    /** GET /api/reports/monthly?month=YYYY-MM */
    private void handleMonthly(HttpServletRequest req, PrintWriter out, HttpServletResponse resp) {
        String month = req.getParameter("month");
        if (month == null || month.isBlank()) {
            resp.setStatus(400);
            out.print(error("Query param 'month' (YYYY-MM) is required."));
            return;
        }
        double income = dao.getMonthlyIncome(month);

        JsonObject result = new JsonObject();
        result.addProperty("month", month);
        result.addProperty("totalIncome", income);
        out.print(success("Monthly income report generated.", result));
    }

    /** GET /api/reports/occupancy */
    private void handleOccupancy(PrintWriter out) {
        List<Reservation> all = dao.getAllReservations();
        Map<String, Long> counts = new LinkedHashMap<>();
        counts.put("Single", all.stream().filter(r -> "Single".equals(r.getRoomType())).count());
        counts.put("Double", all.stream().filter(r -> "Double".equals(r.getRoomType())).count());
        counts.put("Deluxe", all.stream().filter(r -> "Deluxe".equals(r.getRoomType())).count());

        JsonObject result = new JsonObject();
        result.addProperty("totalReservations", all.size());
        result.add("byRoomType", gson.toJsonTree(counts));
        out.print(success("Occupancy report generated.", result));
    }

    /** GET /api/reports/guest-history?name=X */
    private void handleGuestHistory(HttpServletRequest req, PrintWriter out, HttpServletResponse resp) {
        String name = req.getParameter("name");
        if (name == null || name.isBlank()) {
            resp.setStatus(400);
            out.print(error("Query param 'name' is required."));
            return;
        }
        List<Reservation> list = dao.getGuestHistory(name);

        JsonObject result = new JsonObject();
        result.addProperty("searchName", name);
        result.addProperty("count", list.size());
        result.add("reservations", gson.toJsonTree(list));
        out.print(success("Guest history report generated.", result));
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setStatus(200);
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
