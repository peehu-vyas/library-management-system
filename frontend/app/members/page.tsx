"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const loadMembers = async () => {
    const res = await api.get("/members/");
    setMembers(res.data);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const addMember = async () => {
    await api.post("/members/", form);

    setForm({ name: "", email: "" });
    loadMembers();
  };

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>
        👤 Members Management
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
        
        {/* FORM */}
        <div
          style={{
            padding: 16,
            border: "1px solid #eee",
            borderRadius: 10,
            background: "#fafafa",
          }}
        >
          <h3>Add Member</h3>

          <div style={{ display: "grid", gap: 10 }}>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              style={{ padding: 8 }}
            />

            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              style={{ padding: 8 }}
            />

            <button
              onClick={addMember}
              style={{
                padding: 10,
                background: "#111",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Add Member
            </button>
          </div>
        </div>

        {/* TABLE */}
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
            👥 Member List
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafafa" }}>
                <th style={{ padding: 10 }}>ID</th>
                <th style={{ padding: 10 }}>Name</th>
                <th style={{ padding: 10 }}>Email</th>
              </tr>
            </thead>

            <tbody>
              {members.map((m: any) => (
                <tr key={m.id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: 10 }}>{m.id}</td>
                  <td style={{ padding: 10 }}>{m.name}</td>
                  <td style={{ padding: 10 }}>{m.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}