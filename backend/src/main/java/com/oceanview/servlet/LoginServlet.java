package com.oceanview.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.oceanview.dao.UserDAO;
import com.oceanview.model.User;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * LoginServlet – Handles POST /api/login
 * MVC Controller: authenticates users and returns JSON response.
 */
@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {

    private final UserDAO userDAO = new UserDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");
        resp.setHeader("Access-Control-Allow-Origin", "*");
        PrintWriter out = resp.getWriter();

        try {
            // Parse JSON body
            JsonObject body = gson.fromJson(req.getReader(), JsonObject.class);
            String username = body.get("username").getAsString().trim();
            String password = body.get("password").getAsString().trim();

            // Validate input
            if (username.isEmpty() || password.isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print(errorResponse("Username and password are required."));
                return;
            }

            // Authenticate via DAO
            User user = userDAO.validateLogin(username, password);

            if (user != null) {
                // Create session
                HttpSession session = req.getSession(true);
                session.setAttribute("userId", user.getUserId());
                session.setAttribute("username", user.getUsername());
                session.setAttribute("role", user.getRole());
                session.setMaxInactiveInterval(60 * 60); // 1 hour

                JsonObject data = new JsonObject();
                data.addProperty("userId", user.getUserId());
                data.addProperty("username", user.getUsername());
                data.addProperty("role", user.getRole());

                out.print(successResponse("Login successful.", data));
            } else {
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                out.print(errorResponse("Invalid username or password."));
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(errorResponse("Server error: " + e.getMessage()));
        }
    }

    /** Handles CORS preflight requests */
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    private String successResponse(String message, JsonObject data) {
        JsonObject obj = new JsonObject();
        obj.addProperty("status", "success");
        obj.addProperty("message", message);
        obj.add("data", data);
        return gson.toJson(obj);
    }

    private String errorResponse(String message) {
        JsonObject obj = new JsonObject();
        obj.addProperty("status", "error");
        obj.addProperty("message", message);
        return gson.toJson(obj);
    }
}
