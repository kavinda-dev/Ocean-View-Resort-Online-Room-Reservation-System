import React from 'react';

export default function Help() {
    const sections = [
        {
            title: '🔐 Login',
            items: [
                'Enter your username and password provided by the administrator.',
                'Default admin: username = admin, password = admin123.',
                'Your session expires after 1 hour of inactivity.',
            ],
        },
        {
            title: '➕ Adding a Reservation',
            items: [
                'Fill all required fields: Guest Name, Contact, Room Type, Check-in, Check-out.',
                'Contact number must be exactly 10 digits (e.g. 0771234567).',
                'Check-out date must be after the check-in date.',
                'The system automatically calculates and displays the total amount.',
            ],
        },
        {
            title: '🔍 Viewing a Reservation',
            items: [
                'Enter the Reservation ID in the search box.',
                'The system will display full guest and booking details.',
                'Use "Print Invoice" to generate a printable receipt.',
                'Use "Cancel Reservation" to delete a booking permanently.',
            ],
        },
        {
            title: '📊 Reports',
            items: [
                'Daily Booking Report: Select a date to view all check-ins for that day.',
                'Monthly Income Report: Select a month to see total revenue.',
                'Room Occupancy Report: View how many bookings each room type has.',
                'Guest History: Search by guest name to view all their past reservations.',
            ],
        },
        {
            title: '⚠️ Common Error Messages',
            items: [
                '"All fields are required" – Please fill in every mandatory field.',
                '"Contact number must be 10 digits" – Enter a valid Sri Lankan phone number.',
                '"Check-out must be after check-in" – Select valid date range.',
                '"Room not available for selected dates" – Choose different dates or room type.',
                '"Invalid username or password" – Check your credentials and try again.',
            ],
        },
    ];

    return (
        <div className="container py-4" style={{ maxWidth: 750 }}>
            <h3 className="fw-bold mb-2">❓ Help & User Guide</h3>
            <p className="text-muted mb-4">Ocean View Resort – Reservation Management System</p>
            {sections.map(s => (
                <div key={s.title} className="card mb-3 shadow-sm">
                    <div className="card-header fw-bold bg-primary text-white">{s.title}</div>
                    <ul className="list-group list-group-flush">
                        {s.items.map((item, i) => (
                            <li key={i} className="list-group-item">{item}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
