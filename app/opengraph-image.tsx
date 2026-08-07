import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Une invitation — pour Sokhna";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(160deg, #05070D 0%, #0B1120 50%, #131B35 100%)",
          color: "#DCE7FF",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>✦</div>
        <div style={{ fontSize: 52, marginBottom: 12 }}>Une invitation</div>
        <div style={{ fontSize: 24, color: "#AFC6FF", opacity: 0.8 }}>pour Sokhna</div>
      </div>
    ),
    { ...size }
  );
}
