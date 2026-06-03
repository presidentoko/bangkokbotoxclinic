import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbf4f1",
          borderRadius: "7px",
        }}
      >
        {/* Serif "B" in rose-500 */}
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "22px",
            fontWeight: "700",
            color: "#e0607e",
            lineHeight: 1,
          }}
        >
          B
        </div>
      </div>
    ),
    { ...size }
  );
}
