"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);

  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    total_copies: 1,
  });

  const loadBooks = async () => {
    const res = await api.get("/books/");
    setBooks(res.data);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const addBook = async () => {
    await api.post("/books/", form);

    setForm({
      title: "",
      author: "",
      isbn: "",
      total_copies: 1,
    });

    loadBooks();
  };

  return (
  <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
    {/* HEADER */}
    <h1 style={{ fontSize: 28, marginBottom: 20 }}>
      📚 Books Management
    </h1>

    <p style={{ color: "#666", marginBottom: 20 }}>
      Add, view, and manage library books
    </p>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
      
      {/* LEFT: FORM CARD */}
      <div
        style={{
          padding: 16,
          border: "1px solid #eee",
          borderRadius: 10,
          background: "#fafafa",
          height: "fit-content",
        }}
      >
        <h3 style={{ marginBottom: 12 }}>➕ Add Book</h3>

        <div style={{ display: "grid", gap: 10 }}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            style={{ padding: 8 }}
          />

          <input
            placeholder="Author"
            value={form.author}
            onChange={(e) =>
              setForm({ ...form, author: e.target.value })
            }
            style={{ padding: 8 }}
          />

          <input
            placeholder="ISBN"
            value={form.isbn}
            onChange={(e) =>
              setForm({ ...form, isbn: e.target.value })
            }
            style={{ padding: 8 }}
          />

          <input
            type="number"
            placeholder="Copies"
            value={form.total_copies}
            onChange={(e) =>
              setForm({
                ...form,
                total_copies: Number(e.target.value),
              })
            }
            style={{ padding: 8 }}
          />

          <button
            onClick={addBook}
            style={{
              padding: 10,
              background: "#111",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: 6,
            }}
          >
            Add Book
          </button>
        </div>
      </div>

      {/* RIGHT: TABLE CARD */}
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: 12,
            background: "#f5f5f5",
            fontWeight: "bold",
          }}
        >
          📖 Book List
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th style={{ padding: 10, textAlign: "left" }}>ID</th>
              <th style={{ padding: 10, textAlign: "left" }}>Title</th>
              <th style={{ padding: 10, textAlign: "left" }}>Author</th>
              <th style={{ padding: 10, textAlign: "left" }}>ISBN</th>
              <th style={{ padding: 10, textAlign: "left" }}>
                Available
              </th>
            </tr>
          </thead>

          <tbody>
            {books.map((book: any) => (
              <tr
                key={book.id}
                style={{ borderTop: "1px solid #eee" }}
              >
                <td style={{ padding: 10 }}>{book.id}</td>
                <td style={{ padding: 10 }}>{book.title}</td>
                <td style={{ padding: 10 }}>{book.author}</td>
                <td style={{ padding: 10 }}>{book.isbn}</td>
                <td style={{ padding: 10 }}>
                  {book.available_copies}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)
};