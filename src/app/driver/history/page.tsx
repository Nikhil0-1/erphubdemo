"use client";

import { History, Calendar, Clock, CheckCircle2, Bus, MapPin } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function DriverHistoryPage() {
  const history = [
    {
      id: "trip-001",
      date: "Today, Morning",
      route: "Route 3 - North Campus Loop",
      bus: "BUS-07",
      started: "07:30 AM",
      ended: "08:15 AM",
      duration: "45 mins",
      stops: 4,
      studentsTransported: 32,
      status: "COMPLETED",
    },
    {
      id: "trip-002",
      date: "Yesterday, Afternoon",
      route: "Route 3 - Return Loop",
      bus: "BUS-07",
      started: "02:30 PM",
      ended: "03:18 PM",
      duration: "48 mins",
      stops: 4,
      studentsTransported: 32,
      status: "COMPLETED",
    },
    {
      id: "trip-003",
      date: "Yesterday, Morning",
      route: "Route 3 - North Campus Loop",
      bus: "BUS-07",
      started: "07:28 AM",
      ended: "08:12 AM",
      duration: "44 mins",
      stops: 4,
      studentsTransported: 31,
      status: "COMPLETED",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Completed Trip History"
        subtitle="Historical transit logs, route durations, and passenger counts"
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "900px" }}>
        {history.map((h) => (
          <div
            key={h.id}
            className="card"
            style={{
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "12px",
                    background: "#dcfce7",
                    color: "#15803d",
                  }}
                >
                  ✓ {h.status}
                </span>
                <span style={{ fontSize: "13px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Calendar size={13} /> {h.date}
                </span>
              </div>

              <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>{h.route}</h4>

              <div style={{ display: "flex", gap: "16px", marginTop: "8px", fontSize: "13px", color: "#475569" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Bus size={14} /> {h.bus}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock size={14} /> {h.started} – {h.ended} ({h.duration})
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <MapPin size={14} /> {h.stops} Stops
                </span>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "12px", color: "#64748b" }}>STUDENTS DELIVERED</div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#16a34a" }}>{h.studentsTransported}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
