import React, { useState } from 'react';

const SECTIONS = [
    {
        icon: '🔐',
        title: 'Login',
        color: 'primary',
        items: [
            'Enter your staff username and password to access the system.',
            'Default credentials: username = admin, password = admin123.',
            'Your session expires automatically after 1 hour of inactivity.',
            'Contact your system administrator if you forgot your password.',
        ],
    },
    {
        icon: '➕',
        title: 'Adding a Reservation',
        color: 'success',
        items: [
            'Click "New Booking" in the navigation menu.',
            'Fill in all required fields: Guest Name, Contact Number, Room Type, Check-in and Check-out dates.',
            'Contact number must be exactly 10 digits (e.g. 0771234567).',
            'Check-out date must always be after the check-in date.',
            'The system automatically calculates and displays the total amount as a live bill preview.',
            'Click "Confirm Reservation" to save. You can view the invoice directly after booking.',
        ],
    },
    {
        icon: '🔍',
        title: 'Viewing a Reservation',
        color: 'info',
        items: [
            'Click "View Booking" in the navigation menu.',
            'Enter the Reservation ID in the search box and click "Search".',
            'The system will display full guest and booking details including the total amount.',
            'Click "Print Invoice" to generate and print an official receipt.',
            'Click "Cancel Reservation" to permanently delete a booking (this cannot be undone).',
        ],
    },
    {
        icon: '📊',
        title: 'Reports',
        color: 'warning',
        items: [
            'Daily Booking Report: Select a specific date to view all check-ins for that day.',
            'Monthly Income Report: Select a month (YYYY-MM) to see the total revenue earned.',
            'Room Occupancy Report: View how many bookings each room type (Single, Double, Deluxe) has received.',
            'Guest History Report: Search by guest name to view all past reservations for that guest.',
        ],
    },
    {
        icon: '🧾',
        title: 'Printing Invoices',
        color: 'secondary',
        items: [
            'Navigate to View Booking, search for the reservation, and click "Print Invoice".',
            'The invoice page will open — click the "🖨️ Print Invoice" button to print.',
            'The navigation bar and buttons are automatically hidden when printing.',
            'You can also navigate to /invoice/{id} directly in the browser.',
        ],
    },
    {
        icon: '⚠️',
        title: 'Common Error Messages',
        color: 'danger',
        items: [
            '"All fields are required" – Fill in every mandatory field before submitting.',
            '"Contact number must be 10 digits" – Enter a valid Sri Lankan mobile number.',
            '"Check-out must be after check-in" – Select a valid date range (minimum 1 night).',
            '"Room not available for selected dates" – Choose different dates or a different room type.',
            '"Invalid username or password" – Double-check your credentials and try again.',
            '"Reservation not found" – Verify the Reservation ID is correct.',
        ],
    },
];

export default function Help() {
    const [open, setOpen] = useState(null);

    return (
        <div className="container py-4 fade-in" style={{ maxWidth: 780 }}>
            <div className="page-header">
                <h3>❓ Help & User Guide</h3>
            </div>
            <p className="text-muted mb-4">
                Ocean View Resort – Reservation Management System &nbsp;·&nbsp; Staff Reference Guide
            </p>

            {SECTIONS.map((s, i) => (
                <div key={s.title} className="card mb-3 shadow-sm">
                    <div
                        className={`card-header d-flex justify-content-between align-items-center bg-${s.color} ${s.color === 'warning' ? 'text-dark' : 'text-white'}`}
                        style={{ cursor: 'pointer', borderRadius: open === i ? '14px 14px 0 0' : '14px' }}
                        onClick={() => setOpen(open === i ? null : i)}
                    >
                        <span className="fw-bold">{s.icon} {s.title}</span>
                        <span>{open === i ? '▲' : '▼'}</span>
                    </div>
                    {open === i && (
                        <ul className="list-group list-group-flush">
                            {s.items.map((item, j) => (
                                <li key={j} className="list-group-item d-flex align-items-start gap-2">
                                    <span className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>●</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}

            <div className="card bg-light mt-4 p-3 text-center text-muted" style={{ fontSize: '0.85rem' }}>
                Ocean View Resort | Galle, Sri Lanka | System v1.0.0 | © 2026
            </div>
        </div>
    );
}
