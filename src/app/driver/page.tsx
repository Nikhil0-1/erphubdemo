"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  Bus,
  MapPin,
  Navigation,
  Clock,
  Play,
  Square,
  Loader2,
  AlertCircle,
  CheckCircle,
  Wifi,
  WifiOff,
  Route,
} from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/dashboard/shared";
import { getGreeting, formatRelativeTime } from "@/lib/utils";
import { SessionUser } from "@/types";

interface DriverInfo {
  busNumber: string;
  routeName: string;
  routeId: string;
  busId: string;
  driverId: string;
  activeTrip: {
    id: string;
    status: string;
    startedAt: string;
  } | null;
}

export default function DriverDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [routeActive, setRouteActive] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "active" | "updating" | "unavailable">("idle");
  const [lastLocation, setLastLocation] = useState<{ lat: number; lng: number; timestamp: Date } | null>(null);
  const [tripDuration, setTripDuration] = useState("00:00");
  const [actionLoading, setActionLoading] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const user = session?.user as unknown as SessionUser;

  useEffect(() => {
    loadDriverInfo();
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  async function loadDriverInfo() {
    try {
      const res = await fetch("/api/transport/driver-info");
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setDriverInfo(data.data);
          if (data.data.activeTrip?.status === "ACTIVE") {
            setRouteActive(true);
            startGPSTracking(data.data.activeTrip.id);
            startTripTimer(new Date(data.data.activeTrip.startedAt));
          }
        }
      }
    } catch {
      // Handle silently
    } finally {
      setLoading(false);
    }
  }

  function startTripTimer(startTime: Date) {
    const update = () => {
      const diff = Date.now() - startTime.getTime();
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTripDuration(`${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`);
    };
    update();
    intervalRef.current = setInterval(update, 1000);
  }

  function startGPSTracking(tripId: string) {
    if (!navigator.geolocation) {
      setGpsStatus("unavailable");
      return;
    }

    setGpsStatus("active");

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLastLocation({ lat: latitude, lng: longitude, timestamp: new Date() });
        setGpsStatus("updating");

        try {
          await fetch("/api/gps", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tripId,
              latitude,
              longitude,
              accuracy,
              timestamp: new Date().toISOString(),
            }),
          });
          setGpsStatus("active");
        } catch {
          // Retry will happen on next position update
        }
      },
      (error) => {
        console.error("GPS error:", error);
        setGpsStatus("unavailable");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );
  }

  async function startRoute() {
    if (!driverInfo) return;
    setActionLoading(true);

    try {
      const res = await fetch("/api/transport/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          busId: driverInfo.busId,
          routeId: driverInfo.routeId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const trip = data.data;
        setRouteActive(true);
        setDriverInfo((prev) => prev ? { ...prev, activeTrip: trip } : null);
        startGPSTracking(trip.id);
        startTripTimer(new Date(trip.startedAt));
      }
    } catch (err) {
      console.error("Failed to start route:", err);
    } finally {
      setActionLoading(false);
    }
  }

  async function endRoute() {
    if (!driverInfo?.activeTrip) return;
    setActionLoading(true);

    try {
      await fetch(`/api/transport/trips/${driverInfo.activeTrip.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });

      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setRouteActive(false);
      setGpsStatus("idle");
      setDriverInfo((prev) => prev ? { ...prev, activeTrip: null } : null);
      setTripDuration("00:00");
    } catch (err) {
      console.error("Failed to end route:", err);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "var(--sky-500)" }} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        greeting={`${getGreeting()}, ${user?.firstName || "Driver"}`}
        title={driverInfo?.busNumber || "My Bus"}
        subtitle={`Assigned Route: ${driverInfo?.routeName || "—"}`}
      />

      {/* Route Status Card */}
      <div
        className="card"
        style={{
          padding: "28px",
          marginBottom: "24px",
          background: routeActive
            ? "linear-gradient(135deg, #ecfdf5, #f0fdf4)"
            : "var(--surface-card)",
          borderColor: routeActive ? "#86efac" : "var(--border-default)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          {/* Status indicator */}
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: routeActive ? "#22c55e" : "var(--surface-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: routeActive ? "0 0 0 8px rgba(34,197,94,0.15)" : "none",
            }}
          >
            {routeActive ? (
              <Navigation size={28} color="white" />
            ) : (
              <Bus size={28} color="var(--text-tertiary)" />
            )}
          </div>

          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>
            {routeActive ? "ROUTE ACTIVE" : "Route Not Started"}
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px" }}>
            {routeActive ? `Trip duration: ${tripDuration}` : "Tap Start Route to begin GPS tracking"}
          </p>

          {/* Action Button */}
          {routeActive ? (
            <button
              className="btn btn-danger btn-lg"
              onClick={endRoute}
              disabled={actionLoading}
              style={{ minWidth: "200px" }}
            >
              {actionLoading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Square size={18} />}
              END ROUTE
            </button>
          ) : (
            <button
              className="btn btn-accent btn-lg"
              onClick={startRoute}
              disabled={actionLoading || !driverInfo}
              style={{ minWidth: "200px" }}
            >
              {actionLoading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Play size={18} />}
              START ROUTE
            </button>
          )}
        </div>
      </div>

      {/* GPS & Trip Info */}
      {routeActive && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          <div className="card" style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              {gpsStatus === "active" || gpsStatus === "updating" ? (
                <Wifi size={16} color="#22c55e" />
              ) : (
                <WifiOff size={16} color="#ef4444" />
              )}
              <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)" }}>GPS Status</span>
            </div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: gpsStatus === "unavailable" ? "#ef4444" : "#22c55e" }}>
              {gpsStatus === "active" ? "GPS Active" : gpsStatus === "updating" ? "Updating Location" : gpsStatus === "unavailable" ? "Location Unavailable" : "Idle"}
            </div>
          </div>

          <div className="card" style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <MapPin size={16} color="var(--text-tertiary)" />
              <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)" }}>Current Location</span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 500 }}>
              {lastLocation ? `${lastLocation.lat.toFixed(4)}, ${lastLocation.lng.toFixed(4)}` : "Waiting for GPS..."}
            </div>
          </div>

          <div className="card" style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Clock size={16} color="var(--text-tertiary)" />
              <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)" }}>Last Update</span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 500 }}>
              {lastLocation ? formatRelativeTime(lastLocation.timestamp) : "—"}
            </div>
          </div>

          <div className="card" style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Route size={16} color="var(--text-tertiary)" />
              <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)" }}>Route</span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 500 }}>
              {driverInfo?.routeName || "—"}
            </div>
          </div>
        </div>
      )}

      {/* Bus Info */}
      <div className="card" style={{ padding: "20px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "16px" }}>Bus Information</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "12px", color: "var(--text-tertiary)", marginBottom: "4px" }}>Bus Number</div>
            <div style={{ fontSize: "15px", fontWeight: 600 }}>{driverInfo?.busNumber || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "var(--text-tertiary)", marginBottom: "4px" }}>Route</div>
            <div style={{ fontSize: "15px", fontWeight: 600 }}>{driverInfo?.routeName || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "var(--text-tertiary)", marginBottom: "4px" }}>Status</div>
            <StatusBadge status={routeActive ? "ACTIVE" : "NOT_STARTED"} variant="dot" />
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "var(--text-tertiary)", marginBottom: "4px" }}>Trip Duration</div>
            <div style={{ fontSize: "15px", fontWeight: 600 }}>{routeActive ? tripDuration : "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
