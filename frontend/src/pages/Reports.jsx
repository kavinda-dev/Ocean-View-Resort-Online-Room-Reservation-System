import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export default function Reports() {
    const [type, setType] = useState('daily');
    const [params, setParams] = useState({ date: '', month: '', name: '' });
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFetch = async () => {
        setError(''); setResult(null); setLoading(true);
        try {
            let url = `${API_BASE_URL}/reports/`;
            if (type === 'daily') url += `daily?date=${params.date}`;
            else if (type === 'monthly') url += `monthly?month=${params.month}`;
            else if (type === 'occupancy') url += 'occupancy';
            else if (type === 'history') url += `guest-history?name=${params.name}`;
            const res = await axios.get(url);
            setResult(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load report.');
        } finally { setLoading(false); }
    };

    return (
        <div className="container py-4" style={{ maxWidth: 800 }}>
            <h3 className="fw-bold mb-4">📊 Reports</h3>
            <div className="card p-4 shadow-sm mb-4">
                <div className="mb-3">
                    <label className="form-label fw-semibold">Report Type</label>
                    <select className="form-select" value={type} onChange={e => { setType(e.target.value); setResult(null); }}>
                        <option value="daily">Daily Booking Report</option>
                        <option value="monthly">Monthly Income Report</option>
                        <option value="occupancy">Room Occupancy Report</option>
                        <option value="history">Guest History Report</option>
                    </select>
                </div>
                {type === 'daily' && <div className="mb-3"><label className="form-label fw-semibold">Date</label><input type="date" className="form-control" value={params.date} onChange={e => setParams({ ...params, date: e.target.value })} /></div>}
                {type === 'monthly' && <div className="mb-3"><label className="form-label fw-semibold">Month</label><input type="month" className="form-control" value={params.month} onChange={e => setParams({ ...params, month: e.target.value })} /></div>}
                {type === 'history' && <div className="mb-3"><label className="form-label fw-semibold">Guest Name</label><input type="text" className="form-control" value={params.name} onChange={e => setParams({ ...params, name: e.target.value })} placeholder="Search guest name..." /></div>}
                <button className="btn btn-primary fw-bold" onClick={handleFetch} disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Report'}
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {result && (
                <div className="card p-4 shadow-sm">
                    <h5 className="fw-bold mb-3">Report Results</h5>
                    {type === 'daily' && (
                        <>
                            <p><strong>Date:</strong> {result.date} | <strong>Total Bookings:</strong> {result.totalBookings}</p>
                            <ReservationTable data={result.reservations} />
                        </>
                    )}
                    {type === 'monthly' && (
                        <p className="fs-5"><strong>Month:</strong> {result.month} | <strong>Total Income:</strong> LKR {(result.totalIncome || 0).toLocaleString()}</p>
                    )}
                    {type === 'occupancy' && (
                        <>
                            <p><strong>Total Reservations:</strong> {result.totalReservations}</p>
                            <table className="table table-bordered">
                                <thead className="table-primary"><tr><th>Room Type</th><th>Bookings</th></tr></thead>
                                <tbody>
                                    {Object.entries(result.byRoomType || {}).map(([rt, cnt]) => (
                                        <tr key={rt}><td>{rt}</td><td>{cnt}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                    {type === 'history' && (
                        <>
                            <p><strong>Guest:</strong> {result.searchName} | <strong>Records:</strong> {result.count}</p>
                            <ReservationTable data={result.reservations} />
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

function ReservationTable({ data }) {
    if (!data || data.length === 0) return <p className="text-muted">No records found.</p>;
    return (
        <table className="table table-striped table-bordered">
            <thead className="table-dark"><tr><th>ID</th><th>Guest</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Total (LKR)</th></tr></thead>
            <tbody>
                {data.map(r => (
                    <tr key={r.reservationId}>
                        <td>{r.reservationId}</td><td>{r.guestName}</td><td>{r.roomType}</td>
                        <td>{r.checkIn}</td><td>{r.checkOut}</td><td>{(r.totalAmount || 0).toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
