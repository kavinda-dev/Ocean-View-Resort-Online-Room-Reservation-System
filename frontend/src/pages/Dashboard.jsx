import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { Link, useNavigate } from 'react-router-dom';

const QUICK_LINKS = [
    { to: '/reservations/add', label: 'New Reservation', icon: '➕', color: 'primary' },
    { to: '/reservations/view', label: 'View Reservation', icon: '🔍', color: 'secondary' },
    { to: '/reports', label: 'View Reports', icon: '📊', color: 'info' },
    { to: '/help', label: 'Help & Guide', icon: '❓', color: 'warning' },
];

const ROOM_RATES = { Single: 8000, Double: 12000, Deluxe: 18000 };

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

function nightsBetween(checkIn, checkOut) {
    if (!checkIn || !checkOut) return '—';
    const n = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
    return n > 0 ? `${n}` : '—';
}

export default function Dashboard({ user }) {
    const [stats, setStats] = useState({ total: 0, today: 0, monthly: 0 });
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/reservations`)
            .then(res => {
                const all = Array.isArray(res.data) ? res.data : [];
                const today = new Date().toISOString().split('T')[0];
                const month = today.slice(0, 7);
                setStats({
                    total: all.length,
                    today: all.filter(r => r.checkIn === today).length,
                    monthly: all.filter(r => r.checkIn && r.checkIn.startsWith(month)).length,
                });
                // Sort by reservationId desc and take last 5
                const sorted = [...all].sort((a, b) => (b.reservationId || 0) - (a.reservationId || 0));
                setRecent(sorted.slice(0, 5));
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
                <h2 className="fw-bold mb-1">{getGreeting()}, {user?.username} 👋</h2>
                <p className="text-muted mb-0">
                    Ocean View Resort · {new Date().toLocaleDateString('en-LK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Stat Cards */}
            <div className="row g-4 mb-5">
                {loading ? (
                    <div className="text-center text-muted py-3">
                        <span className="spinner-border spinner-border-sm me-2" />Loading stats...
                    </div>
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
            <div className="row g-3 mb-5">
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

            {/* Recent Reservations */}
            <div className="card shadow-sm mb-5">
                <div
                    className="card-header fw-bold d-flex justify-content-between align-items-center"
                    style={{ background: 'linear-gradient(135deg, #0d47a1, #1565c0)', color: 'white', borderRadius: '14px 14px 0 0' }}
                >
                    <span>📋 Recent Reservations</span>
                    <Link to="/reservations/view" className="btn btn-sm btn-light fw-semibold">View All</Link>
                </div>
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center text-muted py-4">
                            <span className="spinner-border spinner-border-sm me-2" />Loading...
                        </div>
                    ) : recent.length === 0 ? (
                        <div className="text-center text-muted py-4">No reservations yet.</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0 align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-3">#ID</th>
                                        <th>Guest</th>
                                        <th>Room</th>
                                        <th>Check-in</th>
                                        <th>Nights</th>
                                        <th>Amount</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recent.map(r => (
                                        <tr key={r.reservationId}>
                                            <td className="ps-3 text-muted fw-bold">#{r.reservationId}</td>
                                            <td className="fw-semibold">{r.guestName}</td>
                                            <td>
                                                <span className={`badge bg-${r.roomType === 'Deluxe' ? 'warning text-dark' : r.roomType === 'Double' ? 'info text-dark' : 'secondary'}`}>
                                                    {r.roomType}
                                                </span>
                                            </td>
                                            <td>{r.checkIn}</td>
                                            <td>{nightsBetween(r.checkIn, r.checkOut)}</td>
                                            <td className="text-primary fw-semibold">
                                                LKR {(r.totalAmount || 0).toLocaleString()}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => navigate(`/invoice/${r.reservationId}`)}
                                                >
                                                    🧾
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Room Rates Reference */}
            <div className="card p-4 bg-light border-0">
                <h6 className="fw-bold mb-3 text-secondary">💰 Room Rate Reference</h6>
                <div className="row text-center g-3">
                    {Object.entries(ROOM_RATES).map(([type, rate]) => (
                        <div className="col-4" key={type}>
                            <div className="card h-100">
                                <div className="card-body py-3">
                                    <div style={{ fontSize: '1.5rem' }}>
                                        {type === 'Single' ? '🛏️' : type === 'Double' ? '🛏🛏' : '👑'}
                                    </div>
                                    <div className="fw-bold">{type}</div>
                                    <div className="text-primary fw-semibold">LKR {rate.toLocaleString()}/night</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
