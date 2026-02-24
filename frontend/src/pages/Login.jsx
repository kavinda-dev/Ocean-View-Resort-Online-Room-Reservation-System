import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export default function Login({ onLogin }) {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.username.trim() || !form.password.trim()) {
            setError('Please enter your username and password.');
            return;
        }
        // ── TEMP: static credentials for frontend preview (remove when backend is live) ──
        const STATIC_USERS = {
            admin: { username: 'admin', password: 'admin123', role: 'admin', userId: 1 },
            staff1: { username: 'staff1', password: 'staff123', role: 'staff', userId: 2 },
        };
        const staticMatch = STATIC_USERS[form.username];
        if (staticMatch && staticMatch.password === form.password) {
            onLogin({ userId: staticMatch.userId, username: staticMatch.username, role: staticMatch.role });
            return;
        }
        // ── END TEMP ──

        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/login`, form);
            onLogin(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{ background: 'linear-gradient(135deg, #0d47a1 0%, #1a936f 100%)' }}
        >
            <div className="card shadow-lg p-4 p-md-5 fade-in" style={{ width: '100%', maxWidth: 440 }}>
                {/* Header */}
                <div className="text-center mb-4">
                    <div style={{ fontSize: '3rem', lineHeight: 1 }}>🏨</div>
                    <h2 className="fw-bold text-primary mt-2 mb-1">Ocean View Resort</h2>
                    <p className="text-muted mb-0">Galle, Sri Lanka</p>
                    <hr className="my-3" />
                    <h5 className="fw-semibold text-secondary">Staff Login Portal</h5>
                </div>

                {error && (
                    <div className="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label fw-semibold">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            className="form-control"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            autoComplete="username"
                            autoFocus
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="form-label fw-semibold">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="form-control"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />
                    </div>
                    <button
                        id="login-btn"
                        type="submit"
                        className="btn btn-primary w-100 py-2 fw-bold"
                        disabled={loading}
                    >
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm me-2" role="status" />Signing in...</>
                        ) : (
                            '🔑 Sign In'
                        )}
                    </button>
                </form>

                <p className="text-center text-muted mt-4 mb-0" style={{ fontSize: '0.8rem' }}>
                    🔒 Authorized staff only · Session expires after 1 hour
                </p>
            </div>
        </div>
    );
}
