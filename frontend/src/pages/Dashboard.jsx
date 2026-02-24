import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { Link } from 'react-router-dom';

const QUICK_LINKS = [
    { to: '/reservations/add', label: 'New Reservation', icon: '➕', color: 'primary' },
    { to: '/reservations/view', label: 'View Reservation', icon: '🔍', color: 'secondary' },
    { to: '/reports', label: 'View Reports', icon: '📊', color: 'info' },
    { to: '/help', label: 'Help & Guide', icon: '❓', color: 'warning' },
];

export default function Dashboard({ user }) {
    const [stats, setStats] = useState({ total: 0, today: 0, monthly: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/reservations`)
            .then(res => {
                const all = Array.isArray(res.data) ? res.data : [];
                const today = new Date().toISOString().split('T')[0];
                const month = today.slice(0, 7); // YYYY-MM
                setStats({
                    total: all.length,
                    today: all.filter(r => r.checkIn === today).length,
                    monthly: all.filter(r => r.checkIn && r.checkIn.startsWith(month)).length,
                });
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const statCards = [
        { label: 'Total Reservations', value: stats.total, bg: 'primary', icon: '🛏️' },
        { label: "Today's Check-ins", value: stats.today, bg: 'success', icon: '📅' },
        { label: "This Month's Bookings", value: stats.monthly, bg: 'warning', icon: '📈' },
    ];

    return (
        <div className="container py-5 fade-in">
            {/* Greeting */}
            <div className="mb-4">
                <h2 className="fw-bold mb-1">Welcome back, {user?.username} 👋</h2>
                <p className="text-muted mb-0">
                    Ocean View Resort · {new Date().toLocaleDateString('en-LK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Stat Cards */}
            <div className="row g-4 mb-5">
                {loading ? (
                    <div className="text-center text-muted py-3">Loading stats...</div>
                ) : statCards.map((s, i) => (
                    <div className="col-md-4" key={i}>
                        <div className={`card text-white bg-${s.bg} shadow stat-card`}>
                            <div className="card-body text-center py-4">
                                <div style={{ fontSize: '2rem' }}>{s.icon}</div>
                                <h1 className="display-4 fw-bold my-1">{s.value}</h1>
                                <p className="mb-0 fw-semibold opacity-90">{s.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <h5 className="fw-bold text-secondary mb-3">Quick Actions</h5>
            <div className="row g-3">
                {QUICK_LINKS.map(btn => (
                    <div className="col-6 col-md-3" key={btn.to}>
                        <Link
                            to={btn.to}
                            className={`btn btn-${btn.color} w-100 py-3 fw-semibold`}
                            style={{ fontSize: '0.95rem' }}
                        >
                            <div style={{ fontSize: '1.4rem' }}>{btn.icon}</div>
                            {btn.label}
                        </Link>
                    </div>
                ))}
            </div>

            {/* Room Rates Reference */}
            <div className="card mt-5 p-4 bg-light border-0">
                <h6 className="fw-bold mb-3 text-secondary">💰 Room Rate Reference</h6>
                <div className="row text-center g-3">
                    {[
                        { type: 'Single', rate: 8000, icon: '🛏️' },
                        { type: 'Double', rate: 12000, icon: '🛏🛏' },
                        { type: 'Deluxe', rate: 18000, icon: '👑' },
                    ].map(r => (
                        <div className="col-4" key={r.type}>
                            <div className="card">
                                <div className="card-body py-3">
                                    <div>{r.icon}</div>
                                    <div className="fw-bold">{r.type}</div>
                                    <div className="text-primary fw-semibold">LKR {r.rate.toLocaleString()}/night</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
