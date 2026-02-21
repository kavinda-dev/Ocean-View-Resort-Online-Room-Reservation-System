import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
    const navigate = useNavigate();
    const handleLogout = () => { onLogout(); navigate('/login'); };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/dashboard">🏨 Ocean View Resort</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navMenu">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/reservations/add">New Booking</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/reservations/view">View Booking</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/reports">Reports</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/help">Help</Link></li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item dropdown">
                            <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                                👤 {user?.username}
                            </span>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><span className="dropdown-item-text text-muted small">Role: {user?.role}</span></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item text-danger" onClick={handleLogout}>🚪 Logout</button></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
