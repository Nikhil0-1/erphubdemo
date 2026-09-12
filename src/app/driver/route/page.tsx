"use client";

import { useEffect, useState } from "react";
import { Map, MapPin, Clock, Users, CheckCircle2, Navigation } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function DriverRoutePage() {
  const [routes, setRoutes] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/transport")
      .then((r) => r.json())
      .then((res) => {
        if (res.data?.routes) setRoutes(res.data.routes);
      })
      .catch(console.error);
  }, []);

  const route = routes[0] || {
    name: "Route 3 - North Campus Loop",
    stops: [
      { name: "Sector 14 Community Gate", time: "07:30 AM", students: 8, status: "COMPLETED" },
      { name: "Greenwood Heights (Aarav Kumar)", time: "07:45 AM", students: 12, status: "NEXT" },
      { name: "Sunrise Apartments Main Rd", time: "08:00 AM", students: 10, status: "UPCOMING" },
      { name: "Green Valley School Gate 2", time: "08:15 AM", students: 0, status: "UPCOMING" },
    ],
  };

  return (
    <div>
      <PageHeader
        title="Current Scheduled Route"
        subtitle="Ordered pickup sequence, scheduled checkpoint arrival times, and passenger distribution"
      />

      <div className="card" style={{ padding: "24px", maxWidth: "800px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#2563eb" }}>
              Active Transit Route
            </span>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a" }}>{route.name}</h2>
          </div>
          <div
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              background: "#dbeafe",
              color: "#1d4ed8",
              fontWeight: 700,
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Navigation size={14} /> In Transit
          </div>
        </div>

        {/* STOPS TIMELINE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {(route.stops || []).map((stop: any, idx: number) => {
            const isCompleted = stop.status === "COMPLETED";
            const isNext = stop.status === "NEXT";

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                  padding: "16px",
                  borderRadius: "8px",
                  background: isNext ? "#eff6ff" : "#f8fafc",
                  border: `1px solid ${isNext ? "#93c5fd" : "#e2e8f0"}`,
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: isCompleted ? "#dcfce7" : isNext ? "#2563eb" : "#f1f5f9",
                    color: isCompleted ? "#16a34a" : isNext ? "#ffffff" : "#64748b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "14px",
                    flexShrink: 0,
                  }}
                >
                  {isCompleted ? <CheckCircle2 size={20} /> : idx + 1}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>{stop.name}</h4>
                    <span style={{ fontSize: "13px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={13} /> {stop.time}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "6px" }}>
                    <span style={{ fontSize: "12px", color: "#475569", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Users size={13} /> {stop.students} student{stop.students === 1 ? "" : "s"} at this stop
                    </span>

                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: isCompleted ? "#dcfce7" : isNext ? "#bfdbfe" : "#f1f5f9",
                        color: isCompleted ? "#15803d" : isNext ? "#1d4ed8" : "#64748b",
                      }}
                    >
                      {stop.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
