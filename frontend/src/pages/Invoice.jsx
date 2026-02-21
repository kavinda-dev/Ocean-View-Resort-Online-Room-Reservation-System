import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export default function Invoice() {
    const { id } = useParams();
    const [r, setR] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`${API_BASE_URL}/reservations/${id}`)
            .then(res => setR(res.data))
            .catch(() => setError('Could not load reservation.'));
    }, [id]);

    if (error) return <div className="container py-5 alert alert-danger">{error}</div>;
    if (!r) return <div className="container py-5 text-center">Loading invoice...</div>;

    const nights = r.checkIn && r.checkOut
        ? Math.round((new Date(r.checkOut) - new Date(r.checkIn)) / 86400000) : 0;

    return (
        <div className="container py-4" style={{ maxWidth: 680 }}>
            <div id="invoice-print" className="card border-0 shadow p-4">
                {/* Header */}
                <div className="text-center border-bottom pb-3 mb-4">
                    <h2 className="fw-bold text-primary mb-0">🏨 Ocean View Resort</h2>
                    <p className="text-muted mb-0">Galle, Sri Lanka | +94 91 2234567</p>
                    <h5 className="mt-2 fw-bold text-uppercase text-secondary">Official Invoice</h5>
                </div>
                {/* Meta */}
                <div className="row mb-3">
                    <div className="col-6"><strong>Invoice #:</strong> INV-{String(r.reservationId).padStart(4, '0')}</div>
                    <div className="col-6 text-end"><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
                </div>
                {/* Guest */}
                <div className="card bg-light p-3 mb-4">
                    <h6 className="fw-bold mb-2">Guest Information</h6>
                    <div><strong>Name:</strong> {r.guestName}</div>
                    <div><strong>Contact:</strong> {r.contactNumber}</div>
                    <div><strong>Address:</strong> {r.address}</div>
                </div>
                {/* Booking */}
                <table className="table table-bordered mb-4">
                    <thead className="table-primary">
                        <tr><th>Description</th><th>Details</th><th className="text-end">Amount (LKR)</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{r.roomType} Room</td>
                            <td>{r.checkIn} → {r.checkOut} ({nights} night{nights !== 1 ? 's' : ''})</td>
                            <td className="text-end">{(r.totalAmount || 0).toLocaleString()}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr className="table-success">
                            <th colSpan="2" className="text-end">Total Amount</th>
                            <th className="text-end">LKR {(r.totalAmount || 0).toLocaleString()}</th>
                        </tr>
                    </tfoot>
                </table>
                <p className="text-muted text-center">Thank you for choosing Ocean View Resort! 🌊</p>
            </div>
            <div className="text-center mt-3">
                <button className="btn btn-primary px-5 fw-bold" onClick={() => window.print()}>🖨️ Print Invoice</button>
            </div>
        </div>
    );
}
