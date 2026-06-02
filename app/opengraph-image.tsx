import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

// Next.js convention: `app/opengraph-image.tsx` exports a 1200×630 PNG
// that platforms (WhatsApp, Facebook, LinkedIn, X…) pick up as the
// preview card when the URL is shared. Next.js auto-wires the result
// into <meta property="og:image"> — no extra metadata config required.

export const alt =
  "Krys Madagascar — Votre opticien de référence à Madagascar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Inline the brand logo as a data URI so the rendered image is fully
  // self-contained (no external fetch at edge runtime).
  const svgPath = path.join(process.cwd(), "public", "krys.svg");
  const svg = fs.readFileSync(svgPath, "utf-8");
  const logo = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

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
          background: "white",
          padding: 80,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={360} alt="" />
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            marginTop: 48,
            color: "#0c0d10",
            letterSpacing: -2,
          }}
        >
          Krys Madagascar
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            marginTop: 20,
            color: "#414249",
            textAlign: "center",
            maxWidth: 920,
          }}
        >
          Votre opticien de référence à Antananarivo, Nosy Be & Antsiranana
        </div>
      </div>
    ),
    { ...size },
  );
}
