import { useState } from "react";
import "./CustomerHistory.css";

const customerHistory = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    email: "juan.delacruz@email.com",
    type: "Overnight",
    date: "Aug 20, 2026",
    amount: "₱3,500",
    status: "Confirmed",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@email.com",
    type: "Day Tour",
    date: "Aug 20, 2026",
    amount: "₱1,200",
    status: "Pending",
  },
  {
    id: 3,
    name: "Juan Dela Cruz",
    email: "juan.delacruz@email.com",
    type: "Day Tour",
    date: "Jul 15, 2026",
    amount: "₱1,200",
    status: "Confirmed",
  },
  {
    id: 4,
    name: "Pedro Reyes",
    email: "pedro.reyes@email.com",
    type: "22-Hour Stay",
    date: "Aug 19, 2026",
    amount: "₱4,000",
    status: "Confirmed",
  },
  {
    id: 5,
    name: "Ana Lopez",
    email: "ana.lopez@email.com",
    type: "Day Tour",
    date: "Aug 19, 2026",
    amount: "₱1,200",
    status: "Cancelled",
  },
  {
    id: 6,
    name: "Mark Torres",
    email: "mark.torres@email.com",
    type: "Overnight",
    date: "Aug 18, 2026",
    amount: "₱3,500",
    status: "Confirmed",
  },
  {
    id: 7,
    name: "Maria Santos",
    email: "maria.santos@email.com",
    type: "Overnight",
    date: "Jun 02, 2026",
    amount: "₱3,500",
    status: "Confirmed",
  },
];

function statusClass(status) {
  if (status === "Confirmed") {
    return "history-status confirmed";
  }

  if (status === "Pending") {
    return "history-status pending";
  }

  return "history-status cancelled";
}

export default function CustomerHistory() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = customerHistory.filter((entry) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      entry.name.toLowerCase().includes(searchText) ||
      entry.email.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      entry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="history-page">
      <header className="history-header">
        <h1>Customer History</h1>
        <p>
          Review previous and current customer booking records.
        </p>
      </header>

      <div className="history-controls">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          className="history-search"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
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
              <tr className="history-empty-row">
                <td
                  colSpan="6"
                  className="no-results"
                >
                  No matching records found.
                </td>
              </tr>
            ) : (
              filtered.map((entry) => (
                <tr key={entry.id}>
                  <td data-label="Guest">
                    {entry.name}
                  </td>

                  <td data-label="Email">
                    {entry.email}
                  </td>

                  <td data-label="Type">
                    {entry.type}
                  </td>

                  <td data-label="Date">
                    {entry.date}
                  </td>

                  <td data-label="Amount">
                    {entry.amount}
                  </td>

                  <td data-label="Status">
                    <span
                      className={statusClass(
                        entry.status
                      )}
                    >
                      {entry.status}
                    </span>
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
