import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    activity: {
      title: "Memory Garden",
      duration: "5 minutes",
      instruction:
        "Look at these shapes quietly. Close your eyes and recall them slowly.",
    },
  });
}