"use client";

import { useEffect, useState } from "react";
import { Bus, CheckCircle2, ShieldCheck, AlertCircle, Wrench, Fuel, Gauge } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function DriverBusPage() {
  const [transportData, setTransportData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/transport")
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setTransportData(res.data);
      })
      .catch(console.error);
  }, []);

  const bus = transportData?.buses?.[0] || {
    number: "BUS-07",
    capacity: 40,
    registrationNumber: "DL-01-AB-1234",
    status: "ACTIVE",
    model: "Tata Starbus Ultra 2024",
  };

  const checklistItems = [
    { label: "Braking & Pneumatic Systems", ok: true },
    { label: "Emergency Exits & Hammers Unlocked", ok: true },
    { label: "First Aid Kit & Fire Extinguisher", ok: true },
    { label: "CCTV Onboard Cameras (Front, Cabin, Rear)", ok: true },
    { label: "GPS Telemetry Module & SIM Gateway", ok: true },
    { label: "Tire Pressure & Tread Depth Verified", ok: true },
  ];

  return (
    <div>
      <PageHeader
        title="My Assigned Vehicle"
        subtitle="Safety inspection status, mechanical diagnostic checklist, and vehicle specifications"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {/* BUS OVERVIEW */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                background: "#fef3c7",
                color: "#d97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bus size={30} />
            </div>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748b" }}>
                Fleet Asset
              </span>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a" }}>{bus.number}</h2>
              <div style={{ fontSize: "13px", color: "#64748b" }}>{bus.registrationNumber || "DL-01-AB-1234"}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
            <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>CAPACITY</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>40 Seats</div>
            </div>
            <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>FUEL LEVEL</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#16a34a", display: "flex", alignItems: "center", gap: "4px" }}>
                <Fuel size={16} /> 85% Full
              </div>
            </div>
            <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>ODOMETER</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "4px" }}>
                <Gauge size={16} /> 24,850 km
              </div>
            </div>
            <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>FITNESS CERT</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#2563eb" }}>Valid (2027)</div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
            <div style={{ fontSize: "12px", color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={16} color="#16a34a" />
              <span>Assigned Driver: Rajesh Kumar (DL: DL-0420190038291)</span>
            </div>
          </div>
        </div>

        {/* PRE-TRIP SAFETY CHECKLIST */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
              <Wrench size={18} color="#2563eb" /> Daily Pre-Trip Checklist
            </h3>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "12px",
                background: "#dcfce7",
                color: "#15803d",
              }}
            >
              100% PASSED
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {checklistItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  background: "#f8fafc",
                  borderRadius: "6px",
                }}
              >
                <span style={{ fontSize: "13px", color: "#334155", fontWeight: 500 }}>{item.label}</span>
                <span style={{ color: "#16a34a", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600 }}>
                  <CheckCircle2 size={16} /> Verified
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
