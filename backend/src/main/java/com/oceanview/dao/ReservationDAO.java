package com.oceanview.dao;

import com.oceanview.model.Reservation;
import com.oceanview.util.DatabaseConnection;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * ReservationDAO – Data Access Object for Reservation operations.
 * Follows DAO Pattern: all database logic for reservations is isolated here.
 */
public class ReservationDAO {

    // Room rates (LKR per night)
    public static final double RATE_SINGLE = 8000.0;
    public static final double RATE_DOUBLE = 12000.0;
    public static final double RATE_DELUXE = 18000.0;

    private Connection getConnection() {
        return DatabaseConnection.getInstance().getConnection();
    }

    /**
     * Adds a new reservation to the database.
     * 
     * @return generated reservation_id, or -1 on failure.
     */
    public int addReservation(Reservation r) {
        String sql = "INSERT INTO reservations (guest_name, address, contact_number, room_type, check_in, check_out, total_amount) "
                +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = getConnection().prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, r.getGuestName());
            stmt.setString(2, r.getAddress());
            stmt.setString(3, r.getContactNumber());
            stmt.setString(4, r.getRoomType());
            stmt.setDate(5, Date.valueOf(r.getCheckIn()));
            stmt.setDate(6, Date.valueOf(r.getCheckOut()));
            stmt.setDouble(7, r.getTotalAmount());
            stmt.executeUpdate();

            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next())
                    return keys.getInt(1);
            }
        } catch (SQLException e) {
            System.err.println("[ReservationDAO] addReservation error: " + e.getMessage());
        }
        return -1;
    }

    /**
     * Retrieves a reservation by ID.
     */
    public Reservation getReservationById(int id) {
        String sql = "SELECT * FROM reservations WHERE reservation_id = ?";
        try (PreparedStatement stmt = getConnection().prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next())
                    return mapRow(rs);
            }
        } catch (SQLException e) {
            System.err.println("[ReservationDAO] getReservationById error: " + e.getMessage());
        }
        return null;
    }

    /**
     * Returns all reservations.
     */
    public List<Reservation> getAllReservations() {
        List<Reservation> list = new ArrayList<>();
        String sql = "SELECT * FROM reservations ORDER BY check_in DESC";
        try (PreparedStatement stmt = getConnection().prepareStatement(sql);
                ResultSet rs = stmt.executeQuery()) {
            while (rs.next())
                list.add(mapRow(rs));
        } catch (SQLException e) {
            System.err.println("[ReservationDAO] getAllReservations error: " + e.getMessage());
        }
        return list;
    }

    /**
     * Deletes a reservation by ID.
     * 
     * @return true if deleted, false otherwise.
     */
    public boolean deleteReservation(int id) {
        String sql = "DELETE FROM reservations WHERE reservation_id = ?";
        try (PreparedStatement stmt = getConnection().prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[ReservationDAO] deleteReservation error: " + e.getMessage());
        }
        return false;
    }

    /**
     * Checks if a room is already booked for the given date range.
     * Prevents overlapping reservations.
     */
    public boolean checkOverlap(String roomType, LocalDate checkIn, LocalDate checkOut) {
        String sql = "SELECT COUNT(*) FROM reservations " +
                "WHERE room_type = ? AND check_in < ? AND check_out > ?";
        try (PreparedStatement stmt = getConnection().prepareStatement(sql)) {
            stmt.setString(1, roomType);
            stmt.setDate(2, Date.valueOf(checkOut));
            stmt.setDate(3, Date.valueOf(checkIn));
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next())
                    return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            System.err.println("[ReservationDAO] checkOverlap error: " + e.getMessage());
        }
        return false;
    }

    /**
     * Returns all reservations for a specific check-in date.
     */
    public List<Reservation> getReservationsByDate(LocalDate date) {
        List<Reservation> list = new ArrayList<>();
        String sql = "SELECT * FROM reservations WHERE check_in = ? ORDER BY reservation_id";
        try (PreparedStatement stmt = getConnection().prepareStatement(sql)) {
            stmt.setDate(1, Date.valueOf(date));
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next())
                    list.add(mapRow(rs));
            }
        } catch (SQLException e) {
            System.err.println("[ReservationDAO] getReservationsByDate error: " + e.getMessage());
        }
        return list;
    }

    /**
     * Returns total income for a specific month (format: YYYY-MM).
     */
    public double getMonthlyIncome(String yearMonth) {
        String sql = "SELECT COALESCE(SUM(total_amount), 0) FROM reservations " +
                "WHERE DATE_FORMAT(check_in, '%Y-%m') = ?";
        try (PreparedStatement stmt = getConnection().prepareStatement(sql)) {
            stmt.setString(1, yearMonth);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next())
                    return rs.getDouble(1);
            }
        } catch (SQLException e) {
            System.err.println("[ReservationDAO] getMonthlyIncome error: " + e.getMessage());
        }
        return 0.0;
    }

    /**
     * Returns guest reservation history by guest name (partial match).
     */
    public List<Reservation> getGuestHistory(String guestName) {
        List<Reservation> list = new ArrayList<>();
        String sql = "SELECT * FROM reservations WHERE guest_name LIKE ? ORDER BY check_in DESC";
        try (PreparedStatement stmt = getConnection().prepareStatement(sql)) {
            stmt.setString(1, "%" + guestName + "%");
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next())
                    list.add(mapRow(rs));
            }
        } catch (SQLException e) {
            System.err.println("[ReservationDAO] getGuestHistory error: " + e.getMessage());
        }
        return list;
    }

    /**
     * Calculates total amount based on room type and nights.
     */
    public static double calculateAmount(String roomType, long nights) {
        double rate;
        switch (roomType.toLowerCase()) {
            case "single":
                rate = RATE_SINGLE;
                break;
            case "double":
                rate = RATE_DOUBLE;
                break;
            case "deluxe":
                rate = RATE_DELUXE;
                break;
            default:
                rate = 0.0;
                break;
        }
        return rate * nights;
    }

    /**
     * Maps a ResultSet row to a Reservation object.
     */
    private Reservation mapRow(ResultSet rs) throws SQLException {
        Reservation r = new Reservation();
        r.setReservationId(rs.getInt("reservation_id"));
        r.setGuestName(rs.getString("guest_name"));
        r.setAddress(rs.getString("address"));
        r.setContactNumber(rs.getString("contact_number"));
        r.setRoomType(rs.getString("room_type"));
        r.setCheckIn(rs.getDate("check_in").toLocalDate());
        r.setCheckOut(rs.getDate("check_out").toLocalDate());
        r.setTotalAmount(rs.getDouble("total_amount"));
        return r;
    }
}
