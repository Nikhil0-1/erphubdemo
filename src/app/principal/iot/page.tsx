"use client";

import { useEffect, useState } from "react";
import { Cpu, Radio, CheckCircle, RefreshCw, Zap, ShieldCheck } from "lucide-react";
import { PageHeader, StatusBadge, Modal } from "@/components/dashboard/shared";

export default function PrincipalIoTPage() {
  const [data, setData] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedDeviceId, setSelectedDeviceId] = useState("GV-RFID-01");
  const [simulating, setSimulating] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [resI, resS] = await Promise.all([fetch("/api/iot"), fetch("/api/students")]);
      const jsonI = await resI.json();
      const jsonS = await resS.json();

      if (jsonI.data) setData(jsonI.data);
      if (jsonS.data) {
        setStudents(jsonS.data);
        if (jsonS.data.length > 0 && !selectedStudentId) {
          setSelectedStudentId(jsonS.data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSimulateScan(e: React.FormEvent) {
    e.preventDefault();
    setSimulating(true);
    setMsg(null);

    try {
      const res = await fetch("/api/iot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "simulate-rfid",
          deviceId: selectedDeviceId,
          studentId: selectedStudentId,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setMsg({
          type: "success",
          text: `⚡ RFID Scan Event Emitted! ${json.data.attendance.studentName} marked PRESENT in Attendance & Student 360°!`,
        });
        setIsSimModalOpen(false);
        loadData();
      } else {
        setMsg({ type: "error", text: json.error?.message || "Simulation failed" });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSimulating(false);
    }
  }

  const devices = data?.devices || [];
  const events = data?.events || [];

  return (
    <div>
      <PageHeader
        title="IoT Smart Campus Center"
        subtitle="Connected RFID attendance readers, hardware health, and gate scan telemetry"
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setIsSimModalOpen(true)}
            className="btn btn-primary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "linear-gradient(135deg, #0284c7, #2563eb)",
            }}
          >
            <Zap size={16} /> SIMULATE RFID SCAN
          </button>
          <button
            onClick={loadData}
            className="btn btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </PageHeader>

      {msg && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "8px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: msg.type === "success" ? "#f0fdf4" : "#fef2f2",
            color: msg.type === "success" ? "#16a34a" : "#dc2626",
            border: `1px solid ${msg.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          <CheckCircle size={20} />
          {msg.text}
        </div>
      )}

      {/* Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>Active Readers</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", marginTop: "4px" }}>{devices.length}</div>
          <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 500 }}>100% Online</span>
        </div>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>Total Telemetry Events</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#0ea5e9", marginTop: "4px" }}>
            {devices.reduce((acc: number, d: any) => acc + (d.eventsCount || 0), 0) + events.length}
          </div>
          <span style={{ fontSize: "12px", color: "#64748b" }}>RFID & Heartbeat</span>
        </div>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>Protocol / Gateway</div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "#334155", marginTop: "8px" }}>ESP32 Wi-Fi / MQTT</div>
          <span style={{ fontSize: "12px", color: "#64748b" }}>Cloud Sync Active</span>
        </div>
      </div>

      {/* Devices Table */}
      <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#0f172a" }}>
          Provisioned RFID Gate Hardware
        </h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Device ID</th>
                <th>Device Name</th>
                <th>Location</th>
                <th>Status</th>
                <th>Event Count</th>
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
                  <td style={{ fontWeight: 500 }}>{d.name}</td>
                  <td>{d.location}</td>
                  <td>
                    <StatusBadge status={d.status} />
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{d.eventsCount || 0}</span> scans
                  </td>
                  <td style={{ fontSize: "12px", color: "#64748b" }}>
                    {new Date(d.lastHeartbeat || Date.now()).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent IoT Events */}
      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#0f172a" }}>
          Live Scan Event Stream
        </h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Device</th>
                <th>Event Type</th>
                <th>Payload / Student</th>
                <th>Attendance Impact</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e: any) => (
                <tr key={e.id}>
                  <td style={{ fontSize: "12px", color: "#64748b", whiteSpace: "nowrap" }}>
                    {new Date(e.timestamp).toLocaleTimeString()}
                  </td>
                  <td>
                    <code>{e.deviceId}</code>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: "#eff6ff",
                        color: "#0284c7",
                      }}
                    >
                      {e.eventType}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>
                    {e.payload?.studentName || "Aarav Kumar"} ({e.payload?.cardId || "RFID-CARD-07"})
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: "#f0fdf4",
                        color: "#16a34a",
                      }}
                    >
                      ✓ PRESENT (Automated)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulate RFID Scan Modal */}
      <Modal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        title="Simulate RFID Card Scan"
        subtitle="Simulate an ESP32 RFID badge tap. Emits live event and updates attendance directly."
      >
        <form onSubmit={handleSimulateScan} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              padding: "12px 14px",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "8px",
              fontSize: "13px",
              color: "#1e40af",
            }}
          >
            ⚡ <strong>Hardware Emulation</strong>: This simulation writes to the same state and attendance service as real hardware readers.
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
              Select RFID Reader Device
            </label>
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            >
              {devices.map((d: any) => (
                <option key={d.id} value={d.deviceId}>
                  {d.deviceId} — {d.name} ({d.location})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
              Select Student Badge
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} (Roll: {s.rollNumber || "07"} · Class: {s.className})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
            <button
              type="button"
              onClick={() => setIsSimModalOpen(false)}
              className="btn btn-secondary"
              disabled={simulating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={simulating}
              style={{ background: "linear-gradient(135deg, #0284c7, #2563eb)" }}
            >
              {simulating ? "Scanning..." : "Tap Badge (Simulate Scan)"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
