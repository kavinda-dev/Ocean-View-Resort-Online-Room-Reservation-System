import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const ROOM_RATES = { Single: 8000, Double: 12000, Deluxe: 18000 };
const today = new Date().toISOString().split('T')[0];

export default function AddReservation() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        guestName: '', address: '', contactNumber: '',
        roomType: 'Single', checkIn: '', checkOut: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const nights = form.checkIn && form.checkOut
        ? Math.max(0, Math.round((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000))
        : 0;
    const total = nights * (ROOM_RATES[form.roomType] || 0);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess(null);

        if (!form.guestName.trim() || !form.contactNumber.trim() || !form.checkIn || !form.checkOut) {
            setError('Please fill in all required fields.'); return;
        }
        if (!/^[0-9]{10}$/.test(form.contactNumber)) {
            setError('Contact number must be exactly 10 digits (e.g. 0771234567).'); return;
        }
        if (new Date(form.checkOut) <= new Date(form.checkIn)) {
            setError('Check-out date must be after check-in date.'); return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/reservations`, form);
            const { reservationId, totalAmount, nights: n } = res.data.data;
            setSuccess({ reservationId, totalAmount, nights: n });
            setForm({ guestName: '', address: '', contactNumber: '', roomType: 'Single', checkIn: '', checkOut: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create reservation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4 fade-in" style={{ maxWidth: 680 }}>
            <div className="page-header">
                <h3>➕ New Reservation</h3>
            </div>

            {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2">
                    <span>⚠️</span> {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    <h6 className="fw-bold mb-1">✅ Reservation Confirmed!</h6>
                    <p className="mb-1">Reservation <strong>#{success.reservationId}</strong> has been created.</p>
                    <p className="mb-2">
                        {success.nights} night(s) · Total: <strong>LKR {(success.totalAmount || 0).toLocaleString()}</strong>
                    </p>
                    <button
                        className="btn btn-sm btn-success"
                        onClick={() => navigate(`/invoice/${success.reservationId}`)}
                    >
                        🧾 View Invoice
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <div className="row g-3">
                    <div className="col-12">
                        <label className="form-label fw-semibold">Guest Name <span className="text-danger">*</span></label>
                        <input
                            name="guestName" className="form-control"
                            value={form.guestName} onChange={handleChange}
                            placeholder="e.g. Kamal Perera"
                        />
                    </div>
                    <div className="col-12">
                        <label className="form-label fw-semibold">Address</label>
                        <input
                            name="address" className="form-control"
                            value={form.address} onChange={handleChange}
                            placeholder="e.g. 45, Galle Road, Colombo 03"
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Contact Number <span className="text-danger">*</span></label>
                        <input
                            name="contactNumber" className="form-control"
                            value={form.contactNumber} onChange={handleChange}
                            placeholder="0771234567" maxLength={10}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Room Type <span className="text-danger">*</span></label>
                        <select name="roomType" className="form-select" value={form.roomType} onChange={handleChange}>
                            <option value="Single">🛏️ Single — LKR 8,000/night</option>
                            <option value="Double">🛏🛏 Double — LKR 12,000/night</option>
                            <option value="Deluxe">👑 Deluxe — LKR 18,000/night</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Check-in Date <span className="text-danger">*</span></label>
                        <input
                            name="checkIn" type="date" className="form-control"
                            value={form.checkIn} min={today} onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Check-out Date <span className="text-danger">*</span></label>
                        <input
                            name="checkOut" type="date" className="form-control"
                            value={form.checkOut} min={form.checkIn || today} onChange={handleChange}
                        />
                    </div>

                    {/* Live Bill Preview */}
                    {nights > 0 && (
                        <div className="col-12">
                            <div className="card bg-primary text-white p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <div className="fw-semibold">💰 Bill Preview</div>
                                        <div className="opacity-90 small">
                                            {nights} night(s) × LKR {ROOM_RATES[form.roomType].toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="fs-4 fw-bold">LKR {total.toLocaleString()}</div>
                                        <div className="opacity-90 small">{form.roomType} Room</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="d-flex gap-2 mt-4">
                    <button type="submit" className="btn btn-primary fw-bold px-4" disabled={loading}>
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                        ) : (
                            '✅ Confirm Reservation'
                        )}
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
