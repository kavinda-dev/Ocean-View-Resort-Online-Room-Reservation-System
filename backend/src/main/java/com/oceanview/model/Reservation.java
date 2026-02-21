package com.oceanview.model;

import java.time.LocalDate;

/**
 * Reservation entity representing a room booking.
 * Follows MVC Model pattern.
 */
public class Reservation {

    private int reservationId;
    private String guestName;
    private String address;
    private String contactNumber;
    private String roomType;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private double totalAmount;

    public Reservation() {
    }

    public Reservation(String guestName, String address, String contactNumber,
            String roomType, LocalDate checkIn, LocalDate checkOut, double totalAmount) {
        this.guestName = guestName;
        this.address = address;
        this.contactNumber = contactNumber;
        this.roomType = roomType;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.totalAmount = totalAmount;
    }

    // Getters and Setters
    public int getReservationId() {
        return reservationId;
    }

    public void setReservationId(int reservationId) {
        this.reservationId = reservationId;
    }

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public LocalDate getCheckIn() {
        return checkIn;
    }

    public void setCheckIn(LocalDate checkIn) {
        this.checkIn = checkIn;
    }

    public LocalDate getCheckOut() {
        return checkOut;
    }

    public void setCheckOut(LocalDate checkOut) {
        this.checkOut = checkOut;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    /**
     * Calculates number of nights between check-in and check-out.
     */
    public long getNights() {
        if (checkIn != null && checkOut != null) {
            return java.time.temporal.ChronoUnit.DAYS.between(checkIn, checkOut);
        }
        return 0;
    }

    @Override
    public String toString() {
        return "Reservation{id=" + reservationId +
                ", guest='" + guestName + "'" +
                ", room=" + roomType +
                ", checkIn=" + checkIn +
                ", checkOut=" + checkOut +
                ", total=" + totalAmount + "}";
    }
}
