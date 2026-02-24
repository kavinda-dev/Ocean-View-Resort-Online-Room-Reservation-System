import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const REPORT_TYPES = [
    { value: 'daily', label: '📅 Daily Booking Report' },
    { value: 'monthly', label: '💰 Monthly Income Report' },
    { value: 'occupancy', label: '🛏️ Room Occupancy Report' },
    { value: 'history', label: '👤 Guest History Report' },
];

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
            else if (type === 'history') url += `guest-history?name=${encodeURIComponent(params.name)}`;
            const res = await axios.get(url);
            setResult(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load report. Please try again.');
        } finally { setLoading(false); }
    };

    return (
        <div className="container py-4 fade-in" style={{ maxWidth: 900 }}>
            <div className="page-header">
                <h3>📊 Reports</h3>
            </div>

            {/* Controls */}
            <div className="card p-4 shadow-sm mb-4">
                <div className="row g-3 align-items-end">
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">Report Type</label>
                        <select className="form-select" value={type} onChange={e => { setType(e.target.value); setResult(null); }}>
                            {REPORT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>

                    {type === 'daily' && (
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Select Date</label>
                            <input type="date" className="form-control"
                                value={params.date} onChange={e => setParams({ ...params, date: e.target.value })} />
                        </div>
                    )}
                    {type === 'monthly' && (
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Select Month</label>
                            <input type="month" className="form-control"
                                value={params.month} onChange={e => setParams({ ...params, month: e.target.value })} />
                        </div>
                    )}
                    {type === 'history' && (
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Guest Name</label>
                            <input type="text" className="form-control" placeholder="e.g. Perera"
                                value={params.name} onChange={e => setParams({ ...params, name: e.target.value })} />
                        </div>
                    )}

                    <div className={type === 'occupancy' ? 'col-md-8' : 'col-md-4'}>
                        <button className="btn btn-primary fw-bold w-100" onClick={handleFetch} disabled={loading}>
                            {loading
                                ? <><span className="spinner-border spinner-border-sm me-2" />Generating...</>
                                : '📊 Generate Report'
                            }
                        </button>
                    </div>
                </div>
            </div>

            {error && <div className="alert alert-danger">⚠️ {error}</div>}

            {/* Results */}
            {result && (
                <div className="card p-4 shadow-sm fade-in">
                    {type === 'daily' && (
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0">📅 Daily Report — {result.date}</h5>
                                <span className="badge bg-primary fs-6">{result.totalBookings} booking(s)</span>
                            </div>
                            <ReservationTable data={result.reservations} />
                        </>
                    )}
                    {type === 'monthly' && (
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="card text-white bg-success text-center p-4">
                                    <p className="mb-1 opacity-90">Total Income for {result.month}</p>
                                    <h2 className="fw-bold">LKR {(result.totalIncome || 0).toLocaleString()}</h2>
                                </div>
                            </div>
                        </div>
                    )}
                    {type === 'occupancy' && (
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0">🛏️ Room Occupancy Report</h5>
                                <span className="badge bg-secondary">{result.totalReservations} total</span>
                            </div>
                            <div className="row g-3">
                                {Object.entries(result.byRoomType || {}).map(([rt, cnt]) => (
                                    <div className="col-md-4" key={rt}>
                                        <div className="card text-center p-3">
                                            <div style={{ fontSize: '2rem' }}>
                                                {rt === 'Single' ? '🛏️' : rt === 'Double' ? '🛏🛏' : '👑'}
                                            </div>
                                            <h3 className="fw-bold text-primary">{cnt}</h3>
                                            <div className="text-muted">{rt} Room</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    {type === 'history' && (
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0">👤 Guest History — "{result.searchName}"</h5>
                                <span className="badge bg-info text-dark">{result.count} record(s)</span>
                            </div>
                            <ReservationTable data={result.reservations} />
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

function ReservationTable({ data }) {
    if (!data || data.length === 0) return (
        <p className="text-muted text-center my-3">No records found for the selected criteria.</p>
    );
    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>#ID</th>
                        <th>Guest Name</th>
                        <th>Room</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th className="text-end">Total (LKR)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(r => (
                        <tr key={r.reservationId}>
                            <td><span className="badge bg-secondary">{r.reservationId}</span></td>
                            <td>{r.guestName}</td>
                            <td><span className="badge bg-info text-dark">{r.roomType}</span></td>
                            <td>{r.checkIn}</td>
                            <td>{r.checkOut}</td>
                            <td className="text-end fw-semibold">{(r.totalAmount || 0).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
