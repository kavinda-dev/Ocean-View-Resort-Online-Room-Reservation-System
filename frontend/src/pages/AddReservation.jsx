import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const ROOM_RATES = { Single: 8000, Double: 12000, Deluxe: 18000 };

export default function AddReservation() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ guestName: '', address: '', contactNumber: '', roomType: 'Single', checkIn: '', checkOut: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const nights = form.checkIn && form.checkOut
        ? Math.max(0, (new Date(form.checkOut) - new Date(form.checkIn)) / 86400000)
        : 0;
    const total = nights * (ROOM_RATES[form.roomType] || 0);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        if (!form.guestName || !form.contactNumber || !form.checkIn || !form.checkOut) {
            setError('Please fill all required fields.'); return;
        }
        if (!/^[0-9]{10}$/.test(form.contactNumber)) { setError('Contact must be 10 digits.'); return; }
        if (new Date(form.checkOut) <= new Date(form.checkIn)) { setError('Check-out must be after check-in.'); return; }

        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/reservations`, form);
            setSuccess(`✅ Reservation #${res.data.data.reservationId} created! Total: LKR ${res.data.data.totalAmount.toLocaleString()}`);
            setForm({ guestName: '', address: '', contactNumber: '', roomType: 'Single', checkIn: '', checkOut: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create reservation.');
        } finally { setLoading(false); }
    };

    return (
        <div className="container py-4" style={{ maxWidth: 650 }}>
            <h3 className="fw-bold mb-4">➕ New Reservation</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <div className="row g-3">
                    <div className="col-12">
                        <label className="form-label fw-semibold">Guest Name *</label>
                        <input name="guestName" className="form-control" value={form.guestName} onChange={handleChange} />
                    </div>
                    <div className="col-12">
                        <label className="form-label fw-semibold">Address</label>
                        <input name="address" className="form-control" value={form.address} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Contact Number *</label>
                        <input name="contactNumber" className="form-control" value={form.contactNumber} onChange={handleChange} placeholder="0771234567" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Room Type *</label>
                        <select name="roomType" className="form-select" value={form.roomType} onChange={handleChange}>
                            <option>Single</option><option>Double</option><option>Deluxe</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Check-in Date *</label>
                        <input name="checkIn" type="date" className="form-control" value={form.checkIn} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Check-out Date *</label>
                        <input name="checkOut" type="date" className="form-control" value={form.checkOut} onChange={handleChange} />
                    </div>
                    {nights > 0 && (
                        <div className="col-12">
                            <div className="alert alert-info mb-0">
                                <strong>{nights} night(s)</strong> × LKR {ROOM_RATES[form.roomType].toLocaleString()} = <strong>LKR {total.toLocaleString()}</strong>
                            </div>
                        </div>
                    )}
                </div>
                <div className="d-flex gap-2 mt-4">
                    <button type="submit" className="btn btn-primary fw-bold px-4" disabled={loading}>
                        {loading ? 'Saving...' : 'Confirm Reservation'}
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
                </div>
            </form>
        </div>
    );
}
