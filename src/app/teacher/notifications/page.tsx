"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle, Clock, BookOpen, User, AlertTriangle, Send, Zap } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";
import { subscribeToNotifications, dispatchNotification, ErpNotification } from "@/lib/firestore-service";

export default function TeacherNotificationsPage() {
  const [firebaseNotifications, setFirebaseNotifications] = useState<ErpNotification[]>([]);
  const [broadcasting, setBroadcasting] = useState(false);
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    // Subscribe to real-time Firestore notifications for TEACHER / ALL
    const unsubscribe = subscribeToNotifications(
      { schoolId: "school_1", role: "TEACHER" },
      (items) => {
        setFirebaseNotifications(items);
      }
    );
    return () => unsubscribe();
  }, []);

  async function handleSendBroadcast(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;
    setBroadcasting(true);
    try {
      await dispatchNotification({
        title: newTitle,
        desc: newDesc,
        type: "ALERT",
        schoolId: "school_1",
        targetRole: "ALL",
        senderName: "Teacher Dispatch",
      });
      setNewTitle("");
      setNewDesc("");
      setShowBroadcastForm(false);
    } catch (err) {
      console.error("Failed to broadcast notification:", err);
    } finally {
      setBroadcasting(false);
    }
  }

  const staticNotifications = [
    {
      id: "s-1",
      title: "RFID Gate Tap Recorded",
      desc: "Aarav Kumar scanned their badge entering Class 7-A (RFID: RFID-AARAV-001).",
      time: "25 mins ago",
      type: "ATTENDANCE",
      icon: Clock,
      color: "#0ea5e9",
      bg: "#e0f2fe",
    },
    {
      id: "s-2",
      title: "New Student Submission",
      desc: "Aarav Kumar submitted homework for 'Mathematics: Quadratic Equations Drill'.",
      time: "1 hour ago",
      type: "ASSIGNMENT",
      icon: BookOpen,
      color: "#10b981",
      bg: "#d1fae5",
    },
    {
      id: "s-3",
      title: "Parent Connected",
      desc: "Raj Kumar (Parent) verified phone and linked with Aarav Kumar.",
      time: "4 hours ago",
      type: "PARENT",
      icon: User,
      color: "#8b5cf6",
      bg: "#ede9fe",
    },
    {
      id: "s-4",
      title: "AI Assistant Insight Generated",
      desc: "NurtureKernel Assistant flagged: Class 7-A average marks in Geometry increased by +12%.",
      time: "Yesterday",
      type: "INSIGHT",
      icon: CheckCircle,
      color: "#f59e0b",
      bg: "#fef3c7",
    },
  ];

  return (
    <div style={{ maxWidth: "800px" }}>
      <PageHeader
        title="Teacher Notifications & Alerts"
        subtitle="Real-time campus signals, homework submissions, and system events"
      >
        <button
          onClick={() => setShowBroadcastForm(!showBroadcastForm)}
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Send size={15} /> Broadcast Alert
        </button>
      </PageHeader>

      {/* Broadcast Form */}
      {showBroadcastForm && (
        <form
          onSubmit={handleSendBroadcast}
          className="card"
          style={{ padding: "20px", marginBottom: "20px", background: "#f8fafc", border: "1px solid #cbd5e1" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", fontWeight: 700, color: "#0f172a" }}>
            <Zap size={16} color="#2563eb" /> Send Real-Time Firebase Broadcast
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="text"
              placeholder="Notification Title (e.g. Science Lab Schedule Update)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="form-input"
              required
            />
            <textarea
              placeholder="Notification Message..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="form-input"
              rows={2}
              required
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button type="button" onClick={() => setShowBroadcastForm(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button type="submit" disabled={broadcasting} className="btn btn-primary btn-sm">
                {broadcasting ? "Broadcasting..." : "Send to All Devices"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Live Firestore Notifications */}
        {firebaseNotifications.map((n) => (
          <div
            key={n.id}
            className="card"
            style={{
              padding: "16px 20px",
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
              borderLeft: "4px solid #2563eb",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "#eff6ff",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Bell size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "6px" }}>
                  {n.title}
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "10px", background: "#dbeafe", color: "#1e40af", fontWeight: 600 }}>
                    FIREBASE LIVE
                  </span>
                </h4>
                <span style={{ fontSize: "12px", color: "#64748b" }}>Just now</span>
              </div>
              <p style={{ fontSize: "13px", color: "#475569", marginTop: "3px" }}>{n.desc}</p>
            </div>
          </div>
        ))}

        {/* Static Seed Notifications */}
        {staticNotifications.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className="card"
              style={{
                padding: "16px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: n.bg,
                  color: n.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{n.title}</h4>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{n.time}</span>
                </div>
                <p style={{ fontSize: "13px", color: "#475569", marginTop: "3px" }}>{n.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
