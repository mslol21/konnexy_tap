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
          borderRadius: 96,
          color: "#F7F5F2",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 180, fontWeight: 900, letterSpacing: -5 }}>OM</div>
          <div style={{ width: 168, height: 20, borderRadius: 999, background: "#C78D4E" }} />
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
