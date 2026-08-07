import { ImageResponse } from "next/og";

export const alt = "Une invitation — pour Sokhna";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Image Open Graph générée à la construction (aucun asset binaire à héberger). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#faf8f3 0%,#eef2ec 55%,#e8dcc6 100%)",
          color: "#414f3c",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 90, marginBottom: 24 }}>🌸</div>
        <div style={{ fontSize: 68, letterSpacing: -1 }}>Une invitation</div>
        <div style={{ fontSize: 30, marginTop: 18, color: "#5c6355" }}>
          Un moment agréable, à ton rythme.
        </div>
      </div>
    ),
    size,
  );
}
