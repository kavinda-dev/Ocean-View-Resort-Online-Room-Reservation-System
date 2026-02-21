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
        if (!form.username || !form.password) { setError('All fields are required.'); return; }
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/login`, form);
            onLogin(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{ background: 'linear-gradient(135deg, #0f4c81, #1a936f)' }}>
            <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: 420 }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">🏨 Ocean View Resort</h2>
                    <p className="text-muted">Staff Login Portal</p>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Username</label>
                        <input id="username" name="username" type="text" className="form-control"
                            value={form.username} onChange={handleChange} placeholder="Enter username" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Password</label>
                        <input id="password" name="password" type="password" className="form-control"
                            value={form.password} onChange={handleChange} placeholder="Enter password" />
                    </div>
                    <button id="login-btn" type="submit" className="btn btn-primary w-100 fw-bold"
                        disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
