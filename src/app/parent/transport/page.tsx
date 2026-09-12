"use client";

import { useEffect, useState } from "react";
import { Bus, MapPin, Navigation, Clock, Phone, ShieldCheck, Radio, AlertCircle, Zap } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";
import { subscribeToGpsTelemetry, GpsTelemetryData } from "@/lib/firestore-service";

export default function ParentTransportPage() {
  const [transport, setTransport] = useState<any>(null);
  const [etaMins, setEtaMins] = useState(6);
  const [liveTelemetry, setLiveTelemetry] = useState<GpsTelemetryData | null>(null);
  const [firebaseActive, setFirebaseActive] = useState(false);

  useEffect(() => {
    loadTransport();

    // Subscribe to Firebase Firestore real-time GPS channel
    const unsubscribe = subscribeToGpsTelemetry(
      "BUS-07",
      (telemetry) => {
        setLiveTelemetry(telemetry);
        setFirebaseActive(true);
        if (telemetry.speed > 0) {
          setEtaMins(Math.max(2, Math.round(1.4 / (telemetry.speed / 60))));
        }
      },
      () => {
        setFirebaseActive(false);
      }
    );

    const interval = setInterval(loadTransport, 10000);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  async function loadTransport() {
    try {
      const res = await fetch("/api/transport");
      const json = await res.json();
      if (json.data) setTransport(json.data);
    } catch (err) {
      console.error(err);
    }
  }

  const bus = transport?.buses?.[0] || { number: "BUS-07", status: "ACTIVE" };
  const route = transport?.routes?.[0] || { name: "Route 3 - North Campus Loop" };
  const activeTrip = transport?.activeTrip;

  return (
    <div>
      <PageHeader
        title="Live Bus Transit & GPS Tracking"
        subtitle="Real-time vehicle location beacon, next stop ETA, and driver communications"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {/* LIVE TRACKING DISPLAY */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bus size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>{bus.number}</h3>
                <div style={{ fontSize: "13px", color: "#64748b" }}>{route.name}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              {firebaseActive && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "6px 10px",
                    borderRadius: "20px",
                    background: "#fef3c7",
                    color: "#b45309",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  <Zap size={13} color="#f59e0b" /> FIREBASE SYNC
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  background: "#dcfce7",
                  color: "#15803d",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                <Radio size={14} className="animate-pulse" /> LIVE TRACKING
              </div>
            </div>
          </div>

          {/* ETA HERO BOX */}
          <div
            style={{
              background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
              color: "#ffffff",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            <div style={{ fontSize: "12px", opacity: 0.9, textTransform: "uppercase", fontWeight: 700 }}>
              Estimated Arrival at Child Stop
            </div>
            <div style={{ fontSize: "36px", fontWeight: 900, marginTop: "4px" }}>
              {etaMins} mins away
            </div>
            <div style={{ fontSize: "13px", opacity: 0.95, marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
              <MapPin size={15} /> Greenwood Heights (Aarav Kumar) • Approx 1.4 km
            </div>
            {liveTelemetry && (
              <div style={{ fontSize: "11px", opacity: 0.85, marginTop: "8px", background: "rgba(255,255,255,0.15)", padding: "4px 8px", borderRadius: "6px", display: "inline-block" }}>
                🛰️ Live GPS: {liveTelemetry.latitude.toFixed(4)}° N, {liveTelemetry.longitude.toFixed(4)}° E • {liveTelemetry.speed} km/h
              </div>
            )}
          </div>

          {/* DRIVER CONTACT */}
          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                  Assigned Driver
                </div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
                  Rajesh Kumar
                </div>
                <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                  <ShieldCheck size={14} /> Police & Medical Verified
                </div>
              </div>

              <a
                href="tel:+919876543214"
                className="btn btn-secondary btn-sm"
                style={{ display: "flex", alignItems: "center", gap: "6px", color: "#2563eb" }}
              >
                <Phone size={14} /> Call Driver
              </a>
            </div>
          </div>
        </div>

        {/* ROUTE PROGRESSION */}
        <div className="card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>
            Route Progression & Stops
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { name: "Sector 14 Community Gate", time: "07:30 AM", status: "PASSED" },
              { name: "Greenwood Heights (Your Stop)", time: "07:45 AM (Approaching)", status: "NEXT" },
              { name: "Sunrise Apartments Main Rd", time: "08:00 AM", status: "UPCOMING" },
              { name: "Green Valley School Gate 2", time: "08:15 AM", status: "UPCOMING" },
            ].map((stop, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  background: stop.status === "NEXT" ? "#eff6ff" : "#f8fafc",
                  border: `1px solid ${stop.status === "NEXT" ? "#bfdbfe" : "#e2e8f0"}`,
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: stop.status === "PASSED" ? "#dcfce7" : stop.status === "NEXT" ? "#2563eb" : "#e2e8f0",
                    color: stop.status === "PASSED" ? "#16a34a" : stop.status === "NEXT" ? "#ffffff" : "#64748b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {stop.status === "PASSED" ? "✓" : i + 1}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{stop.name}</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>{stop.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
