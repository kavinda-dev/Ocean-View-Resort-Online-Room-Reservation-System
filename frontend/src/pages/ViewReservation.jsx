import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

export default function ViewReservation() {
    const [id, setId] = useState('');
    const [reservation, setRes] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        setError(''); setRes(null);
        if (!id) { setError('Please enter a Reservation ID.'); return; }
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/reservations/${id}`);
            setRes(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Reservation not found.');
        } finally { setLoading(false); }
    };

    const handleCancel = async () => {
        if (!window.confirm('Cancel this reservation?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/reservations/${id}`);
            setRes(null); setId('');
            alert('Reservation cancelled successfully.');
        } catch (err) {
            setError('Failed to cancel reservation.');
        }
    };

    return (
        <div className="container py-4" style={{ maxWidth: 700 }}>
            <h3 className="fw-bold mb-4">🔍 View Reservation</h3>
            <form onSubmit={handleSearch} className="d-flex gap-2 mb-4">
                <input className="form-control" type="number" placeholder="Enter Reservation ID"
                    value={id} onChange={e => setId(e.target.value)} />
                <button type="submit" className="btn btn-primary fw-bold px-4" disabled={loading}>
                    {loading ? '...' : 'Search'}
                </button>
            </form>
            {error && <div className="alert alert-danger">{error}</div>}
            {reservation && (
                <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">Reservation #{reservation.reservationId}</h5>
                    </div>
                    <div className="card-body">
                        <table className="table table-borderless mb-0">
                            <tbody>
                                {[
                                    ['Guest Name', reservation.guestName],
                                    ['Address', reservation.address],
                                    ['Contact', reservation.contactNumber],
                                    ['Room Type', reservation.roomType],
                                    ['Check-in', reservation.checkIn],
                                    ['Check-out', reservation.checkOut],
                                    ['Total Amount', `LKR ${(reservation.totalAmount || 0).toLocaleString()}`],
                                ].map(([label, val]) => (
                                    <tr key={label}>
                                        <td className="fw-semibold text-muted" style={{ width: 160 }}>{label}</td>
                                        <td>{val}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card-footer d-flex gap-2">
                        <button className="btn btn-success fw-bold" onClick={() => navigate(`/invoice/${reservation.reservationId}`)}>
                            🧾 Print Invoice
                        </button>
                        <button className="btn btn-outline-danger" onClick={handleCancel}>Cancel Reservation</button>
                    </div>
                </div>
            )}
        </div>
    );
}
