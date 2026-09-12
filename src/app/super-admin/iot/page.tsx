"use client";

import { useEffect, useState } from "react";
import { Cpu, Wifi, WifiOff, RefreshCw, Radio } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/dashboard/shared";

export default function SuperAdminIoTPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch("/api/iot");
      const json = await res.json();
      if (json.data) setData(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const devices = data?.devices || [];
  const events = data?.events || [];

  return (
    <div>
      <PageHeader
        title="IoT Device Overview"
        subtitle="Hardware telemetry, RFID readers, and attendance gate monitors across all schools"
      >
        <button
          onClick={loadData}
          className="btn btn-secondary"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <RefreshCw size={16} /> Refresh Telemetry
        </button>
      </PageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>Total Hardware Units</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", marginTop: "4px" }}>{devices.length}</div>
        </div>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>Online & Reporting</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#16a34a", marginTop: "4px" }}>
            {devices.filter((d: any) => d.status === "ONLINE").length}
          </div>
        </div>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>Total Processed Scans</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#0ea5e9", marginTop: "4px" }}>
            {devices.reduce((acc: number, d: any) => acc + (d.eventsCount || 0), 0) + events.length}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: "24px", marginBottom: "28px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", marginBottom: "16px" }}>Provisioned IoT Hardware</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Device ID</th>
                <th>Device Type</th>
                <th>Location / Gate</th>
                <th>School Context</th>
                <th>Status</th>
                <th>Total Events</th>
                <th>Last Heartbeat</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d: any) => (
                <tr key={d.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                      <Radio size={16} color="#0ea5e9" /> {d.deviceId}
                    </div>
                  </td>
                  <td>{d.type}</td>
                  <td>{d.location}</td>
                  <td>Green Valley School</td>
                  <td>
                    <StatusBadge status={d.status} />
                  </td>
                  <td>{d.eventsCount || 0} scans</td>
                  <td style={{ fontSize: "12px", color: "#64748b" }}>
                    {new Date(d.lastHeartbeat || Date.now()).toLocaleTimeString()}
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
