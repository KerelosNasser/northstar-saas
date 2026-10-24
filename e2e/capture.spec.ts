import { test } from "@playwright/test";
import * as path from "node:path";
import * as fs from "node:fs";

const routes = [
  { name: "overview", path: "/" },
  { name: "revenue", path: "/revenue" },
  { name: "customers", path: "/customers" },
  { name: "reports", path: "/reports" },
  { name: "insights", path: "/insights" },
  { name: "settings", path: "/settings" },
];

const viewports = [
  { label: "1280px", width: 1280, height: 900 },
  { label: "1440px", width: 1440, height: 900 },
  { label: "1024px", width: 1024, height: 800 },
  { label: "768px", width: 768, height: 1024 },
  { label: "375px", width: 375, height: 812 },
];

test.describe("screenshot audit", () => {
  const screenshotDir = path.resolve(process.cwd(), "screenshots", "audit");

  test.beforeAll(async () => {
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
  });

  for (const vp of viewports) {
    for (const r of routes) {
      test(`capture ${r.name} @ ${vp.label}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(r.path, { waitUntil: "networkidle" });
        await page.waitForTimeout(300); // allow chart animations to settle

        const filename = `${r.name}-${vp.label}.png`;
        const filePath = path.join(screenshotDir, filename);

        await page.screenshot({
          path: filePath,
          fullPage: true,
        });
      });
    }
  }
});
