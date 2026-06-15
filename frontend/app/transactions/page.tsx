"use client";

import { useState } from "react";
import api from "../../lib/api";

export default function TransactionsPage() {
  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  const borrow = async () => {
    try {
      await api.post("/transactions/borrow", {
        book_id: Number(bookId),
        member_id: Number(memberId),
      });

      alert("Book borrowed successfully");

      if (memberId) {
        loadHistory();
      }
    } catch (err) {
      console.log(err);
      alert("Borrow failed");
    }
  };

  const returnBook = async () => {
    try {
      await api.post(`/transactions/return/${transactionId}`);

      alert("Book returned successfully");

      if (memberId) {
        loadHistory();
      }
    } catch (err) {
      console.log(err);
      alert("Return failed");
    }
  };

  const returnTransaction = async (id: number) => {
    try {
      await api.post(`/transactions/return/${id}`);

      alert("Book returned successfully");

      loadHistory();
    } catch (err) {
      console.log(err);
      alert("Return failed");
    }
  };

  const loadHistory = async () => {
    try {
      const res = await api.get(
        `/transactions/member/${memberId}`
      );

      setHistory(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load history");
    }
  };

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 1000,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>
        🔄 Transactions
      </h1>

      {/* Borrow */}
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 10,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <h3>📖 Borrow Book</h3>

        <input
          placeholder="Book ID"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Member ID"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          style={inputStyle}
        />

        <button onClick={borrow} style={btnStyle}>
          Borrow
        </button>
      </div>

      {/* Optional Manual Return */}
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 10,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <h3>↩️ Return Book (Manual)</h3>

        <input
          placeholder="Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          style={inputStyle}
        />

        <button onClick={returnBook} style={btnStyle}>
          Return
        </button>
      </div>

      {/* History */}
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 10,
          padding: 16,
        }}
      >
        <h3>📜 Borrow History</h3>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 15,
            alignItems: "center",
          }}
        >
          <input
            placeholder="Member ID"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            style={inputStyle}
          />

          <button onClick={loadHistory} style={btnStyle}>
            Load History
          </button>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              <th style={thStyle}>Txn ID</th>
              <th style={thStyle}>Book ID</th>
              <th style={thStyle}>Borrowed</th>
              <th style={thStyle}>Returned</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {history.map((t: any) => (
              <tr
                key={t.id}
                style={{
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <td style={tdStyle}>{t.id}</td>

                <td style={tdStyle}>{t.book_id}</td>

                <td style={tdStyle}>
                  {new Date(
                    t.borrowed_at
                  ).toLocaleString()}
                </td>

                <td style={tdStyle}>
                  {t.returned_at
                    ? new Date(
                        t.returned_at
                      ).toLocaleString()
                    : "Not Returned"}
                </td>

                <td style={tdStyle}>
                  {!t.returned_at ? (
                    <button
                      onClick={() =>
                        returnTransaction(t.id)
                      }
                      style={{
                        ...btnStyle,
                        padding: "6px 10px",
                      }}
                    >
                      Return
                    </button>
                  ) : (
                    "✓ Returned"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: 8,
  width: 220,
};

const btnStyle: React.CSSProperties = {
  padding: "8px 14px",
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const thStyle: React.CSSProperties = {
  padding: 10,
};

const tdStyle: React.CSSProperties = {
  padding: 10,
};