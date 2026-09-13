import { describe, expect, it } from "vitest";

import { DISPLAY_TIME_ZONE, formatDate, formatDateTime } from "@/lib/format";

describe("date formatting", () => {
  it("renders timestamps in Nepal time, not the server timezone", () => {
    // 18:30 UTC is 00:15 the next day in Asia/Kathmandu (UTC+05:45).
    const instant = "2026-09-13T18:30:00.000Z";
    expect(formatDate(instant, "en")).toBe("14/09/2026");
    expect(formatDateTime(instant, "en")).toContain("14/09/2026");
  });

  it("pins the display timezone", () => {
    expect(DISPLAY_TIME_ZONE).toBe("Asia/Kathmandu");
  });
});
