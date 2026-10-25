import { type Page, test } from "@playwright/test";
import * as path from "node:path";
import * as fs from "node:fs";

const outDir = path.resolve(process.cwd(), "screenshots", "visual-audit");

test.describe.configure({ mode: "serial" });

test.describe("visual audit capture", () => {
  test.beforeAll(async () => {
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
  });

  const setTheme = async (page: Page, theme: "light" | "dark") => {
    await page.evaluate((t: string) => {
      window.localStorage.setItem("northstar-theme", t);
      if (t === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, theme);
    await page.waitForTimeout(200);
  };

  test("Capture Revenue Analytics - Light & Dark, Bridge & Cumulative, Retention", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto("/revenue", { waitUntil: "networkidle" });

    // 1. Light - Bridge
    await setTheme(page, "light");
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, "revenue-light-full.png"), fullPage: true });

    const waterfallCard = page.locator('[data-slot="card"]', { has: page.getByText("MRR movement waterfall") });
    await waterfallCard.screenshot({ path: path.join(outDir, "revenue-light-waterfall-bridge.png") });

    // 2. Light - Cumulative
    await waterfallCard.getByRole("button", { name: "Bridge view" }).click();
    await page.getByRole("menuitem", { name: "Cumulative view" }).click();
    await page.waitForTimeout(300);
    await waterfallCard.screenshot({ path: path.join(outDir, "revenue-light-waterfall-cumulative.png") });

    // 3. Light - Retention Matrix
    const retentionCard = page.locator('[data-slot="card"]', { has: page.getByText("Customer cohort retention matrix") });
    await retentionCard.screenshot({ path: path.join(outDir, "revenue-light-retention-matrix.png") });

    // 4. Dark - Bridge
    await setTheme(page, "dark");
    await waterfallCard.getByRole("button", { name: "Cumulative view" }).click();
    await page.getByRole("menuitem", { name: "Bridge view" }).click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, "revenue-dark-full.png"), fullPage: true });
    await waterfallCard.screenshot({ path: path.join(outDir, "revenue-dark-waterfall-bridge.png") });

    // 5. Dark - Cumulative
    await waterfallCard.getByRole("button", { name: "Bridge view" }).click();
    await page.getByRole("menuitem", { name: "Cumulative view" }).click();
    await page.waitForTimeout(300);
    await waterfallCard.screenshot({ path: path.join(outDir, "revenue-dark-waterfall-cumulative.png") });

    // 6. Dark - Retention Matrix
    await retentionCard.screenshot({ path: path.join(outDir, "revenue-dark-retention-matrix.png") });
  });

  test("Capture Overview - Light & Dark, all 4 Trajectory Tabs, Cohort Flow", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto("/", { waitUntil: "networkidle" });

    // 1. Light - Revenue tab
    await setTheme(page, "light");
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, "overview-light-full.png"), fullPage: true });

    const trajectoryCard = page.locator('[data-slot="card"]', { has: page.getByText("Revenue trajectory") });
    await trajectoryCard.screenshot({ path: path.join(outDir, "overview-light-trajectory-revenue.png") });

    // 2. Light - MRR tab
    await trajectoryCard.getByRole("tab", { name: "MRR Growth" }).click();
    await page.waitForTimeout(300);
    await trajectoryCard.screenshot({ path: path.join(outDir, "overview-light-trajectory-mrr.png") });

    // 3. Light - ARPU tab
    await trajectoryCard.getByRole("tab", { name: "ARPU" }).click();
    await page.waitForTimeout(300);
    await trajectoryCard.screenshot({ path: path.join(outDir, "overview-light-trajectory-arpu.png") });

    // 4. Light - LTV tab
    await trajectoryCard.getByRole("tab", { name: "LTV" }).click();
    await page.waitForTimeout(300);
    await trajectoryCard.screenshot({ path: path.join(outDir, "overview-light-trajectory-ltv.png") });

    // 5. Light - Cohort Flow & Plan Distribution
    const cohortCard = page.locator('[data-slot="card"]', { has: page.getByText("Account cohort flow") });
    await cohortCard.screenshot({ path: path.join(outDir, "overview-light-cohort-flow.png") });

    const planCard = page.locator('[data-slot="card"]', { has: page.getByText("Plan distribution") });
    await planCard.screenshot({ path: path.join(outDir, "overview-light-plan-distribution.png") });

    // 6. Dark - Revenue tab & ARPU tab
    await setTheme(page, "dark");
    await trajectoryCard.getByRole("tab", { name: "Total Revenue" }).click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, "overview-dark-full.png"), fullPage: true });
    await trajectoryCard.screenshot({ path: path.join(outDir, "overview-dark-trajectory-revenue.png") });

    await trajectoryCard.getByRole("tab", { name: "ARPU" }).click();
    await page.waitForTimeout(300);
    await trajectoryCard.screenshot({ path: path.join(outDir, "overview-dark-trajectory-arpu.png") });

    await cohortCard.screenshot({ path: path.join(outDir, "overview-dark-cohort-flow.png") });
    await planCard.screenshot({ path: path.join(outDir, "overview-dark-plan-distribution.png") });
  });

  test("Capture Remaining 4 routes - Light & Dark", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });

    const routes = [
      { name: "customers", path: "/customers" },
      { name: "reports", path: "/reports" },
      { name: "insights", path: "/insights" },
      { name: "settings", path: "/settings" },
    ];

    for (const r of routes) {
      await page.goto(r.path, { waitUntil: "networkidle" });

      // Light
      await setTheme(page, "light");
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(outDir, `${r.name}-light-full.png`), fullPage: true });

      // Dark
      await setTheme(page, "dark");
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(outDir, `${r.name}-dark-full.png`), fullPage: true });
    }
  });
});
