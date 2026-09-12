"use client";

import { useEffect, useState } from "react";
import { Navigation, Wifi, MapPin, Gauge, Radio, ShieldCheck, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

import { updateGpsTelemetry } from "@/lib/firestore-service";

export default function DriverGPSPage() {
  const [coords, setCoords] = useState({ lat: 28.6139, lng: 77.209 });
  const [speed, setSpeed] = useState(38);
  const [accuracy, setAccuracy] = useState(4.2);
  const [satellites, setSatellites] = useState(14);
  const [logs, setLogs] = useState<string[]>([
    "GPS daemon initialized (Firebase Realtime Firestore Link)",
    "Satellite lock established (14 SVs visible)",
    "Telemetry broadcast live to Parents and School Dispatch",
  ]);
  const [pinging, setPinging] = useState(false);

  useEffect(() => {
    // Try browser geolocation if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          if (pos.coords.accuracy) setAccuracy(pos.coords.accuracy);
        },
        () => {
          // fallback default coordinates
        }
      );
    }
  }, []);

  async function handleSendPing() {
    setPinging(true);
    try {
      // 1. Sync to Firebase Cloud Firestore directly
      await updateGpsTelemetry({
        vehicleId: "BUS-07",
        latitude: coords.lat,
        longitude: coords.lng,
        speed,
        accuracy,
        routeName: "Route 3 - North Campus Loop",
        status: "ACTIVE",
      });

      // 2. Also send to standard API endpoint
      await fetch("/api/gps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: "active-trip-01",
          latitude: coords.lat,
          longitude: coords.lng,
          accuracy,
        }),
      }).catch(() => {});

      const now = new Date().toLocaleTimeString();
      setLogs((prev) => [`[${now}] Firebase live sync: (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}) • 38 km/h`, ...prev.slice(0, 9)]);
    } catch (err) {
      console.error(err);
    } finally {
      setPinging(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Live GPS Telemetry & Satellite Link"
        subtitle="Hardware telemetry, geolocation beaconing, and live carrier gateway diagnostics"
      >
        <button
          onClick={handleSendPing}
          disabled={pinging}
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <RefreshCw size={16} className={pinging ? "animate-spin" : ""} /> Transmit Manual Ping
        </button>
      </PageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {/* GPS TELEMETRY READINGS */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Navigation size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>GNSS Receiver Status</h3>
                <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>Active • 3D Fix</span>
              </div>
            </div>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 0 4px #d1fae5",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>LATITUDE</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>{coords.lat.toFixed(6)}° N</div>
            </div>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>LONGITUDE</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>{coords.lng.toFixed(6)}° E</div>
            </div>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>CURRENT SPEED</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#2563eb" }}>{speed} km/h</div>
            </div>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>PRECISION ACCURACY</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#16a34a" }}>±{accuracy.toFixed(1)} m</div>
            </div>
          </div>
        </div>

        {/* TRANSMIT LOG */}
        <div className="card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Radio size={18} color="#2563eb" /> Telemetry Beacon Log
          </h3>

          <div
            style={{
              background: "#0f172a",
              color: "#38bdf8",
              fontFamily: "monospace",
              fontSize: "12px",
              padding: "16px",
              borderRadius: "8px",
              minHeight: "180px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {logs.map((log, i) => (
              <div key={i} style={{ opacity: i === 0 ? 1 : 0.7 }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
