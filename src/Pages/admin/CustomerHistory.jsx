import { useState } from 'react';
import './CustomerHistory.css';

const customerHistory = [
  { id: 1, name: 'Juan Dela Cruz', email: 'juan.delacruz@email.com', type: 'Overnight', date: 'Aug 20, 2026', amount: '₱3,500', status: 'Confirmed' },
  { id: 2, name: 'Maria Santos', email: 'maria.santos@email.com', type: 'Day Tour', date: 'Aug 20, 2026', amount: '₱1,200', status: 'Pending' },
  { id: 3, name: 'Juan Dela Cruz', email: 'juan.delacruz@email.com', type: 'Day Tour', date: 'Jul 15, 2026', amount: '₱1,200', status: 'Confirmed' },
  { id: 4, name: 'Pedro Reyes', email: 'pedro.reyes@email.com', type: '22-Hour Stay', date: 'Aug 19, 2026', amount: '₱4,000', status: 'Confirmed' },
  { id: 5, name: 'Ana Lopez', email: 'ana.lopez@email.com', type: 'Day Tour', date: 'Aug 19, 2026', amount: '₱1,200', status: 'Cancelled' },
  { id: 6, name: 'Mark Torres', email: 'mark.torres@email.com', type: 'Overnight', date: 'Aug 18, 2026', amount: '₱3,500', status: 'Confirmed' },
  { id: 7, name: 'Maria Santos', email: 'maria.santos@email.com', type: 'Overnight', date: 'Jun 02, 2026', amount: '₱3,500', status: 'Confirmed' },
];

function statusClass(status) {
  if (status === 'Confirmed') return 'status-badge confirmed';
  if (status === 'Pending') return 'status-badge pending';
  return 'status-badge cancelled';
}

export default function CustomerHistory() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = customerHistory.filter((entry) => {
    const matchesSearch =
      entry.name.toLowerCase().includes(search.toLowerCase()) ||
      entry.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="history-page">
      <h1>Customer History</h1>

      <div className="history-controls">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="history-search"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="history-filter"
        >
          <option value="All">All Statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="history-table-card">
        <table className="history-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Email</th>
              <th>Type</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-results">
                  No matching records found.
                </td>
              </tr>
            ) : (
              filtered.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.name}</td>
                  <td>{entry.email}</td>
                  <td>{entry.type}</td>
                  <td>{entry.date}</td>
                  <td>{entry.amount}</td>
                  <td>
                    <span className={statusClass(entry.status)}>{entry.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}