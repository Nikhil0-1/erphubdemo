"use client";

import { useEffect, useState } from "react";
import { Bus, MapPin, Navigation, Clock, RefreshCw, CheckCircle, Radio } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/dashboard/shared";

export default function PrincipalTransportPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      const res = await fetch("/api/transport");
      const json = await res.json();
      if (json.data) setData(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const buses = data?.buses || [];
  const routes = data?.routes || [];
  const activeTrip = data?.activeTrip;

  return (
    <div>
      <PageHeader
        title="Fleet & Smart Transport"
        subtitle="Live mobile GPS fleet tracking, driver assignments, and student transit routes"
      >
        <button onClick={loadData} className="btn btn-secondary" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <RefreshCw size={16} /> Refresh GPS
        </button>
      </PageHeader>

      {/* Fleet Status */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>School Fleet Size</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", marginTop: "4px" }}>{buses.length} Buses</div>
        </div>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>Active On-Road Trips</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: activeTrip ? "#16a34a" : "#64748b", marginTop: "4px" }}>
            {activeTrip ? "1 Active Route" : "0 Active (Idle)"}
          </div>
        </div>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>Transit Coverage</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#0ea5e9", marginTop: "4px" }}>{routes.length} Active Routes</div>
        </div>
      </div>

      {/* Active Trip Map Card */}
      <div className="card" style={{ padding: "24px", marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>Live Fleet Map Monitor</h3>
          {activeTrip ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#16a34a", fontWeight: 600, fontSize: "13px" }}>
              <Radio size={16} style={{ animation: "pulse 1.5s infinite" }} /> LIVE DRIVER GPS ACTIVE
            </span>
          ) : (
            <span style={{ fontSize: "13px", color: "#64748b" }}>Route Not Started · Standby</span>
          )}
        </div>

        {/* Visual Map Canvas */}
        <div
          style={{
            height: "280px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #0f172a, #1e293b)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "20px",
            color: "white",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 2 }}>
            <div>
              <div style={{ fontSize: "18px", fontWeight: 700 }}>BUS-07 · Route 3</div>
              <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>Driver: Rajesh Kumar (+91-91234-56789)</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>Coordinates:</div>
              <div style={{ fontSize: "13px", fontFamily: "monospace", color: "#38bdf8" }}>
                {activeTrip?.currentLocation ? `${activeTrip.currentLocation.latitude.toFixed(4)}° N, ${activeTrip.currentLocation.longitude.toFixed(4)}° E` : "28.5355° N, 77.2410° E"}
              </div>
            </div>
          </div>

          {/* Route Stop Line */}
          <div style={{ zIndex: 2, padding: "10px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
              {["Stop 1", "Main Market", "Metro Station", "Sector 15", "School"].map((stop, idx) => (
                <div key={stop} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: idx === 3 && activeTrip ? "#22c55e" : "#475569",
                      boxShadow: idx === 3 && activeTrip ? "0 0 12px #22c55e" : "none",
                      border: "2px solid white",
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "#cbd5e1" }}>{stop}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2, fontSize: "12px", color: "#94a3b8" }}>
            <span>Next Stop: Sector 15 Gate (Aarav Kumar boarding stop)</span>
            <span>GPS Frequency: 5s interval (Phone Geolocation)</span>
          </div>
        </div>
      </div>

      {/* Buses Table */}
      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#0f172a" }}>Fleet Details</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Bus Number</th>
                <th>Assigned Route</th>
                <th>Driver</th>
                <th>Capacity</th>
                <th>Current Status</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((b: any) => (
                <tr key={b.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
                      <Bus size={18} color="#f97316" /> {b.number}
                    </div>
                  </td>
                  <td>{b.routeName || "Route 3"}</td>
                  <td>{b.driverName || "Rajesh Kumar"}</td>
                  <td>{b.capacity || 40} Seats</td>
                  <td>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        background: activeTrip && b.status === "ROUTE_ACTIVE" ? "#f0fdf4" : "#f1f5f9",
                        color: activeTrip && b.status === "ROUTE_ACTIVE" ? "#16a34a" : "#64748b",
                      }}
                    >
                      {activeTrip && b.status === "ROUTE_ACTIVE" ? "ROUTE ACTIVE" : "STANDBY"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
