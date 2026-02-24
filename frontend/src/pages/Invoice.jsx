import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export default function Invoice() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [r, setR] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`${API_BASE_URL}/reservations/${id}`)
            .then(res => setR(res.data))
            .catch(() => setError('Could not load reservation. Please go back and try again.'));
    }, [id]);

    if (error) return (
        <div className="container py-5">
            <div className="alert alert-danger">⚠️ {error}</div>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>← Go Back</button>
        </div>
    );
    if (!r) return (
        <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-2 text-muted">Loading invoice...</p>
        </div>
    );

    const nights = r.checkIn && r.checkOut
        ? Math.round((new Date(r.checkOut) - new Date(r.checkIn)) / 86400000)
        : 0;

    const ratePerNight = nights > 0 && r.totalAmount ? (r.totalAmount / nights) : 0;

    return (
        <div className="container py-4 fade-in" style={{ maxWidth: 720 }}>
            {/* Print controls */}
            <div className="d-flex gap-2 mb-3 no-print">
                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>← Back</button>
                <button className="btn btn-primary fw-bold px-4" onClick={() => window.print()}>
                    🖨️ Print Invoice
                </button>
            </div>

            {/* Invoice document */}
            <div id="invoice-print" className="card border-0 shadow p-4 p-md-5">

                {/* Header */}
                <div className="text-center border-bottom pb-4 mb-4">
                    <h2 className="fw-bold text-primary mb-1">🏨 Ocean View Resort</h2>
                    <p className="text-muted mb-0">Marine Drive, Galle, Sri Lanka</p>
                    <p className="text-muted mb-0">📞 +94 91 2234567 &nbsp;|&nbsp; ✉️ info@oceanviewresort.lk</p>
                    <div className="mt-3">
                        <span className="badge bg-primary fs-6 px-3 py-2 text-uppercase fw-bold">Official Invoice</span>
                    </div>
                </div>

                {/* Invoice meta */}
                <div className="row mb-4">
                    <div className="col-6">
                        <div className="text-muted small">INVOICE NUMBER</div>
                        <div className="fw-bold">INV-{String(r.reservationId).padStart(4, '0')}</div>
                    </div>
                    <div className="col-6 text-end">
                        <div className="text-muted small">ISSUE DATE</div>
                        <div className="fw-bold">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                    </div>
                </div>

                {/* Guest information */}
                <div className="card bg-light p-3 mb-4 border-0">
                    <h6 className="fw-bold mb-3 text-secondary">BILLED TO</h6>
                    <div className="row g-2">
                        <div className="col-md-6">
                            <span className="text-muted small">Guest Name</span>
                            <div className="fw-semibold">{r.guestName}</div>
                        </div>
                        <div className="col-md-6">
                            <span className="text-muted small">Contact Number</span>
                            <div className="fw-semibold">{r.contactNumber}</div>
                        </div>
                        {r.address && (
                            <div className="col-12">
                                <span className="text-muted small">Address</span>
                                <div className="fw-semibold">{r.address}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Booking details table */}
                <table className="table table-bordered mb-4">
                    <thead style={{ background: '#0d47a1', color: 'white' }}>
                        <tr>
                            <th>Description</th>
                            <th className="text-center">Qty</th>
                            <th className="text-end">Rate (LKR)</th>
                            <th className="text-end">Amount (LKR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <strong>{r.roomType} Room</strong><br />
                                <small className="text-muted">
                                    Check-in: {r.checkIn} &nbsp;→&nbsp; Check-out: {r.checkOut}
                                </small>
                            </td>
                            <td className="text-center">{nights} night{nights !== 1 ? 's' : ''}</td>
                            <td className="text-end">{ratePerNight.toLocaleString()}</td>
                            <td className="text-end">{(r.totalAmount || 0).toLocaleString()}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr className="table-light">
                            <td colSpan="3" className="text-end fw-bold">Subtotal</td>
                            <td className="text-end">LKR {(r.totalAmount || 0).toLocaleString()}</td>
                        </tr>
                        <tr style={{ background: '#e8f5e9' }}>
                            <td colSpan="3" className="text-end fw-bold fs-5">TOTAL AMOUNT</td>
                            <td className="text-end fw-bold fs-5 text-success">LKR {(r.totalAmount || 0).toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* Footer */}
                <div className="text-center text-muted" style={{ fontSize: '0.85rem' }}>
                    <p className="mb-1">Thank you for choosing Ocean View Resort! 🌊</p>
                    <p className="mb-0">This is a computer-generated invoice. No signature required.</p>
                </div>
            </div>
        </div>
    );
}
