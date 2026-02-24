import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

export default function ViewReservation() {
    const [id, setId] = useState('');
    const [reservation, setRes] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        setError(''); setRes(null);
        if (!id) { setError('Please enter a Reservation ID.'); return; }
        if (isNaN(id) || Number(id) <= 0) { setError('Please enter a valid numeric Reservation ID.'); return; }
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/reservations/${id}`);
            setRes(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Reservation not found. Please check the ID.');
        } finally { setLoading(false); }
    };

    const handleCancel = async () => {
        if (!window.confirm(`Are you sure you want to cancel Reservation #${reservation?.reservationId}? This cannot be undone.`)) return;
        setCancelling(true);
        try {
            await axios.delete(`${API_BASE_URL}/reservations/${id}`);
            setRes(null); setId('');
            setError('');
            alert('✅ Reservation cancelled successfully.');
        } catch {
            setError('Failed to cancel reservation. Please try again.');
        } finally { setCancelling(false); }
    };

    const FIELDS = reservation ? [
        ['👤 Guest Name', reservation.guestName],
        ['📍 Address', reservation.address || '—'],
        ['📞 Contact', reservation.contactNumber],
        ['🛏️ Room Type', reservation.roomType],
        ['📅 Check-in', reservation.checkIn],
        ['📅 Check-out', reservation.checkOut],
        ['🌙 Nights', (() => {
            if (!reservation.checkIn || !reservation.checkOut) return '—';
            return Math.round((new Date(reservation.checkOut) - new Date(reservation.checkIn)) / 86400000) + ' night(s)';
        })()],
        ['💰 Total Amount', `LKR ${(reservation.totalAmount || 0).toLocaleString()}`],
    ] : [];

    return (
        <div className="container py-4 fade-in" style={{ maxWidth: 720 }}>
            <div className="page-header">
                <h3>🔍 View Reservation</h3>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="card p-3 shadow-sm mb-4">
                <div className="d-flex gap-2">
                    <input
                        id="reservation-id"
                        className="form-control"
                        type="number"
                        min="1"
                        placeholder="Enter Reservation ID (e.g. 1001)"
                        value={id}
                        onChange={e => setId(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary fw-bold px-4" disabled={loading}>
                        {loading
                            ? <><span className="spinner-border spinner-border-sm me-1" />Searching...</>
                            : '🔍 Search'
                        }
                    </button>
                </div>
            </form>

            {error && <div className="alert alert-danger">⚠️ {error}</div>}

            {/* Result Card */}
            {reservation && (
                <div className="card shadow-sm fade-in">
                    <div className="card-header d-flex justify-content-between align-items-center"
                        style={{ background: 'linear-gradient(135deg, #0d47a1, #1565c0)', color: 'white', borderRadius: '14px 14px 0 0' }}>
                        <h5 className="mb-0">📋 Reservation #{reservation.reservationId}</h5>
                        <span className="badge bg-light text-dark">{reservation.roomType} Room</span>
                    </div>
                    <div className="card-body p-0">
                        <table className="table table-hover mb-0">
                            <tbody>
                                {FIELDS.map(([label, val]) => (
                                    <tr key={label}>
                                        <td className="fw-semibold text-muted ps-4 py-2" style={{ width: 200 }}>{label}</td>
                                        <td className="py-2">{val}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card-footer bg-white d-flex gap-2 flex-wrap p-3">
                        <button
                            className="btn btn-success fw-bold"
                            onClick={() => navigate(`/invoice/${reservation.reservationId}`)}
                        >
                            🧾 Print Invoice
                        </button>
                        <button
                            className="btn btn-outline-danger fw-semibold"
                            onClick={handleCancel}
                            disabled={cancelling}
                        >
                            {cancelling ? 'Cancelling...' : '🗑️ Cancel Reservation'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
