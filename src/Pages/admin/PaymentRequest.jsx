import { useState } from 'react';
import './PaymentRequest.css';

const initialPayments = [
  {
    id: 1,
    guest: 'Juan Dela Cruz',
    email: 'juan.delacruz@email.com',
    booking: 'BK-2026-001',
    type: 'Overnight',
    amount: '₱3,500',
    date: 'Aug 20, 2026',
    method: 'GCash',
    reference: 'GC-839201',
    status: 'Pending',
  },
  {
    id: 2,
    guest: 'Maria Santos',
    email: 'maria.santos@email.com',
    booking: 'BK-2026-002',
    type: 'Day Tour',
    amount: '₱1,200',
    date: 'Aug 20, 2026',
    method: 'Bank Transfer',
    reference: 'BT-291837',
    status: 'Pending',
  },
  {
    id: 3,
    guest: 'Pedro Reyes',
    email: 'pedro.reyes@email.com',
    booking: 'BK-2026-003',
    type: '22-Hour Stay',
    amount: '₱4,000',
    date: 'Aug 19, 2026',
    method: 'GCash',
    reference: 'GC-738291',
    status: 'Approved',
  },
  {
    id: 4,
    guest: 'Ana Lopez',
    email: 'ana.lopez@email.com',
    booking: 'BK-2026-004',
    type: 'Day Tour',
    amount: '₱1,200',
    date: 'Aug 19, 2026',
    method: 'Bank Transfer',
    reference: 'BT-102938',
    status: 'Rejected',
  },
];

function paymentStatusClass(status) {
  if (status === 'Approved') {
    return 'payment-status approved';
  }

  if (status === 'Pending') {
    return 'payment-status pending';
  }

  return 'payment-status rejected';
}

export default function PaymentRequests() {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.guest.toLowerCase().includes(search.toLowerCase()) ||
      payment.email.toLowerCase().includes(search.toLowerCase()) ||
      payment.booking.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ||
      payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updatePaymentStatus = (id, status) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === id
          ? { ...payment, status }
          : payment
      )
    );
  };

  return (
    <div className="payment-page">

      <div className="payment-header">
        <div>
          <h1>Payment Requests</h1>
          <p>Review and manage customer payment submissions.</p>
        </div>
      </div>

      <div className="payment-controls">

        <input
          type="text"
          placeholder="Search guest, email, or booking..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="payment-search"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="payment-filter"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

      </div>

      <div className="payment-table-card">

        <table className="payment-table">

          <thead>
            <tr>
              <th>Guest</th>
              <th>Booking</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Reference</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="9" className="payment-no-results">
                  No payment requests found.
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment) => (
                <tr key={payment.id}>

                  <td>
                    <strong>{payment.guest}</strong>
                    <small>{payment.email}</small>
                  </td>

                  <td>{payment.booking}</td>

                  <td>{payment.type}</td>

                  <td className="payment-amount">
                    {payment.amount}
                  </td>

                  <td>{payment.method}</td>

                  <td>{payment.reference}</td>

                  <td>{payment.date}</td>

                  <td>
                    <span className={paymentStatusClass(payment.status)}>
                      {payment.status}
                    </span>
                  </td>

                  <td>

                    {payment.status === 'Pending' ? (
                      <div className="payment-actions">

                        <button
                          className="approve-btn"
                          onClick={() =>
                            updatePaymentStatus(payment.id, 'Approved')
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() =>
                            updatePaymentStatus(payment.id, 'Rejected')
                          }
                        >
                          Reject
                        </button>

                      </div>
                    ) : (
                      <span className="action-done">
                        Completed
                      </span>
                    )}

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