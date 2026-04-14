import { NextResponse } from "next/server";

const VERCEL_TOKEN = process.env.VERCEL_DEPLOY_TOKEN || "";
const PROJECT_ID = "prj_CeG7RVrMa71vey9TFDJmTzpHhhPt";
const TEAM_ID = "team_ZkdCRQpWvhprCcbldpNN28fk";

export async function GET() {
  if (!VERCEL_TOKEN) {
    return NextResponse.json({ state: "unknown", message: "Token not configured" });
  }

  try {
    const res = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}&teamId=${TEAM_ID}&limit=1&target=production`,
      { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }, cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json({ state: "unknown", message: "API error" });
    }

    const data = await res.json();
    const deploy = data.deployments?.[0];

    if (!deploy) {
      return NextResponse.json({ state: "unknown", message: "No deployments found" });
    }

    return NextResponse.json({
      state: deploy.state,          // QUEUED | BUILDING | READY | ERROR | CANCELED
      url: deploy.url,
      createdAt: deploy.createdAt,
      readyAt: deploy.ready,
    });
  } catch {
    return NextResponse.json({ state: "unknown", message: "Fetch error" });
  }
}
