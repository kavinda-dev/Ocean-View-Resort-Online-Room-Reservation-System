import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { Link } from 'react-router-dom';

export default function Dashboard({ user }) {
    const [stats, setStats] = useState({ total: 0, today: 0 });

    useEffect(() => {
        axios.get(`${API_BASE_URL}/reservations`).then(res => {
            const all = Array.isArray(res.data) ? res.data : [];
            const today = new Date().toISOString().split('T')[0];
            setStats({ total: all.length, today: all.filter(r => r.checkIn === today).length });
        }).catch(() => { });
    }, []);

    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-1">Welcome, {user?.username} 👋</h2>
            <p className="text-muted mb-4">Ocean View Resort – Reservation Management</p>

            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card text-white bg-primary shadow">
                        <div className="card-body text-center">
                            <h1 className="display-4 fw-bold">{stats.total}</h1>
                            <p className="mb-0">Total Reservations</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-success shadow">
                        <div className="card-body text-center">
                            <h1 className="display-4 fw-bold">{stats.today}</h1>
                            <p className="mb-0">Today's Check-ins</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-warning shadow">
                        <div className="card-body text-center">
                            <h1 className="display-4 fw-bold">3</h1>
                            <p className="mb-0">Room Types Available</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3">
                {[
                    { to: '/reservations/add', label: '➕ New Reservation', color: 'primary' },
                    { to: '/reservations/view', label: '🔍 View Reservation', color: 'secondary' },
                    { to: '/reports', label: '📊 View Reports', color: 'info' },
                    { to: '/help', label: '❓ Help', color: 'light' },
                ].map(btn => (
                    <div className="col-6 col-md-3" key={btn.to}>
                        <Link to={btn.to} className={`btn btn-${btn.color} w-100 py-3 fw-semibold`}>{btn.label}</Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
