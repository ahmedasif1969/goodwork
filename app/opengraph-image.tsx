import { ImageResponse } from "next/og";
export const alt = "Goodwork Digital — Websites, Software & AI Automation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#050507",
          color: "#f5f3fa",
          display: "flex",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage:
              "radial-gradient(ellipse at 50% 115%, #652ad5 0%, #1c0f36 30%, #050507 65%)",
          }}
        >
          <div style={{ fontSize: 19, color: "#c5a9fa", letterSpacing: 5 }}>
            GOODWORK DIGITAL
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 130,
              letterSpacing: -8,
              marginTop: 20,
            }}
          >
            Goodwork<span style={{ color: "#a181ee" }}>.</span>
          </div>
          <div style={{ fontSize: 30, marginTop: 25 }}>
            Websites · Software · AI Automation
          </div>
          <div style={{ fontSize: 21, color: "#b4aebd", marginTop: 22 }}>
            Thoughtful technology. Better ways of working.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
