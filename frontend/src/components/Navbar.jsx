import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = [
    { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/reservations/add', label: 'New Booking', icon: '➕' },
    { to: '/reservations/view', label: 'View Booking', icon: '🔍' },
    { to: '/reports', label: 'Reports', icon: '📊' },
    { to: '/help', label: 'Help', icon: '❓' },
];

export default function Navbar({ user, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = () => { onLogout(); navigate('/login'); };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/dashboard">
                    🏨 Ocean View Resort
                </Link>
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navMenu"
                    aria-controls="navMenu"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navMenu">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {NAV_LINKS.map(({ to, label, icon }) => (
                            <li className="nav-item" key={to}>
                                <Link
                                    className={`nav-link px-3 ${location.pathname === to ? 'active fw-bold' : ''}`}
                                    to={to}
                                >
                                    {icon} {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item dropdown">
                            <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" style={{ cursor: 'pointer' }}>
                                👤 {user?.username}
                            </span>
                            <ul className="dropdown-menu dropdown-menu-end shadow">
                                <li><span className="dropdown-item-text text-muted small">Role: <strong>{user?.role}</strong></span></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="dropdown-item text-danger fw-semibold" onClick={handleLogout}>
                                        🚪 Logout
                                    </button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
