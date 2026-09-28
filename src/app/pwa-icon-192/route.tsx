import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#20252A",
          borderRadius: 36,
          color: "#F7F5F2",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ fontSize: 68, fontWeight: 900, letterSpacing: -5 }}>OM</div>
          <div style={{ width: 62, height: 8, borderRadius: 999, background: "#C78D4E" }} />
        </div>
      </div>
    ),
    { width: 192, height: 192 }
  );
}
