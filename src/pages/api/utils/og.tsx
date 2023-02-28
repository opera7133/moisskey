import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const Noto_JP_Bold = fetch(
  new URL("../../../assets/NotoSansJP-Bold.otf", import.meta.url)
).then((res) => res.arrayBuffer());
const Noto_JP_Medium = fetch(
  new URL("../../../assets/NotoSansJP-Medium.otf", import.meta.url)
).then((res) => res.arrayBuffer());
const Noto_JP_Regular = fetch(
  new URL("../../../assets/NotoSansJP-Regular.otf", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function (req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.has("title")
    ? searchParams.get("title")?.slice(0, 100)
    : "Moisskeyまとめ";
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          width: "100%",
          height: "100%",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Noto Sans JP"',
          background: "white",
          backgroundImage: "url(https://i.imgur.com/uBzHodG.png)",
        }}
      >
        <p style={{ maxWidth: "60%" }}>{title}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Noto Sans JP",
          data: await Noto_JP_Bold,
          style: "normal",
          weight: 700,
        },
        {
          name: "Noto Sans JP",
          data: await Noto_JP_Medium,
          style: "normal",
          weight: 500,
        },
        {
          name: "Noto Sans JP",
          data: await Noto_JP_Regular,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
