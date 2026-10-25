import { expect, test } from "@playwright/test";
import { cohortWeeks, trajectorySeries, trajectoryVariants } from "@/lib/data/overview";
import { retentionCohorts, waterfallLegend, waterfallSteps } from "@/lib/data/revenue";

test.describe("Analytics Visualization Data Integrity & Rendering", () => {
  test("MRR waterfall data model integrity & arithmetic", () => {
    // 1. Verify arithmetic
    const startStep = waterfallSteps.find((s) => s.id === "start")!;
    const endStep = waterfallSteps.find((s) => s.id === "end")!;
    const movements = waterfallSteps.filter((s) => s.kind === "increase" || s.kind === "decrease");

    const calculatedTotal =
      startStep.value + movements.reduce((sum, step) => sum + step.value, 0);

    expect(calculatedTotal).toBe(endStep.value);
    expect(endStep.value).toBe(148_250);

    // 2. Verify zero-grounded movement values & cumulative progression
    let running = 0;
    for (const step of waterfallSteps) {
      if (step.kind === "baseline") {
        expect(step.value).toBe(131_900);
        running = step.value;
      } else if (step.kind === "increase") {
        expect(step.value).toBeGreaterThan(0);
        running += step.value;
      } else if (step.kind === "decrease") {
        expect(step.value).toBeLessThan(0);
        running += step.value;
      } else if (step.kind === "total") {
        expect(step.value).toBe(running);
      }
    }

    // 3. Verify legend color mapping uses danger token for contractions
    const contractionLegend = waterfallLegend.find((item) => item.label === "Contractions");
    expect(contractionLegend?.color).toBe("var(--danger)");
  });

  test("Overview cohort flow arithmetic integrity", () => {
    for (const week of cohortWeeks) {
      const netCalculated = week.new + week.expansion - week.contraction - week.churn;
      const expectedNetString = `+${netCalculated} net`;
      expect(week.net.startsWith(expectedNetString)).toBe(true);
    }
  });

  test("Overview trajectory variant scaling integrity", () => {
    // Total revenue at day 30: 152,000
    const day30 = trajectorySeries[29];
    expect(day30.day).toBe(30);
    expect(day30.current).toBe(152_000);

    // ARPU variant
    const arpuVariant = trajectoryVariants.arpu;
    const scaledArpu = day30.current * arpuVariant.scale;
    expect(scaledArpu).toBeGreaterThan(50);
    expect(scaledArpu).toBeLessThan(200);
    expect(arpuVariant.domain[1]).toBe(120);
    expect(arpuVariant.format(scaledArpu)).toMatch(/^\$1[0-9]{2}\.[0-9]{2}$/);

    // MRR variant
    const mrrVariant = trajectoryVariants.mrr;
    const scaledMrr = day30.current * mrrVariant.scale;
    expect(scaledMrr).toBeGreaterThan(80_000);
    expect(scaledMrr).toBeLessThan(100_000);
    expect(mrrVariant.domain[1]).toBe(100_000);
  });

  test("Revenue screen: MRR waterfall chart rendering and view switching", async ({ page }) => {
    await page.goto("/revenue");
    await expect(page.getByRole("heading", { name: "Revenue Analytics" })).toBeVisible();

    const waterfallCard = page.locator('[data-slot="card"]', { has: page.getByText("MRR movement waterfall") });
    await expect(waterfallCard).toBeVisible();

    // Check legend items
    await expect(waterfallCard.getByText("Baseline")).toBeVisible();
    await expect(waterfallCard.getByText("Expansions")).toBeVisible();
    await expect(waterfallCard.getByText("Contractions")).toBeVisible();
    await expect(waterfallCard.getByText("Final MRR")).toBeVisible();

    // Verify SVG chart surface is rendered with valid dimensions (not collapsed/blank)
    const chartSurface = waterfallCard.locator(".recharts-surface");
    await expect(chartSurface).toBeVisible();
    const box = await chartSurface.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(200);
    expect(box!.height).toBeGreaterThan(150);

    // Verify all 7 bars exist in Bridge view
    const bridgeBars = waterfallCard.locator("path.recharts-rectangle, rect.recharts-bar-rectangle");
    await expect(bridgeBars.first()).toBeVisible();
    expect(await bridgeBars.count()).toBeGreaterThanOrEqual(7);

    // Verify switch to Cumulative view and check description
    await waterfallCard.getByRole("button", { name: "Bridge view" }).click();
    await page.getByRole("menuitem", { name: "Cumulative view" }).click();
    await expect(waterfallCard.getByText("Cumulative view: Total active MRR progression after each component.")).toBeVisible();

    // Verify bars exist in Cumulative view
    await expect(chartSurface).toBeVisible();
    const cumulativeBars = waterfallCard.locator("path.recharts-rectangle, rect.recharts-bar-rectangle");
    expect(await cumulativeBars.count()).toBeGreaterThanOrEqual(7);

    // Switch back to Bridge view
    await waterfallCard.getByRole("button", { name: "Cumulative view" }).click();
    await page.getByRole("menuitem", { name: "Bridge view" }).click();
    await expect(waterfallCard.getByText("Bridge view: Starting MRR bridges across net expansion and churn to Ending MRR.")).toBeVisible();
  });

  test("Overview screen: Revenue trajectory tabs scale correctly without label blowout", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Good morning, Alex." })).toBeVisible();

    const trajectoryCard = page.locator('[data-slot="card"]', { has: page.getByText("Revenue trajectory") });
    await expect(trajectoryCard).toBeVisible();

    // Revenue tab is active by default: should display Day 18 reference line
    await expect(trajectoryCard.getByText("Day 18: $80K launch")).toBeVisible();

    // Click ARPU tab
    await trajectoryCard.getByRole("tab", { name: "ARPU" }).click();

    // In ARPU tab, the 80K reference line should NOT be shown
    await expect(trajectoryCard.getByText("Day 18: $80K launch")).toHaveCount(0);

    // Y-axis should show ARPU ticks (e.g. $30, $60, $90, $120) and not $80000 or $120000
    const arpuYAxisTicks = trajectoryCard.locator("text", { hasText: /^\$(30|60|90|120)$/ });
    await expect(arpuYAxisTicks.first()).toBeVisible();

    // Click MRR Growth tab
    await trajectoryCard.getByRole("tab", { name: "MRR Growth" }).click();
    await expect(trajectoryCard.getByText("MRR Growth · hover any day to compare against the previous period.")).toBeVisible();
  });

  test("Revenue screen: Retention matrix renders valid percentages and accessible classes", async ({ page }) => {
    await page.goto("/revenue");
    const matrixCard = page.locator('[data-slot="card"]', { has: page.getByText("Customer cohort retention matrix") });
    await expect(matrixCard).toBeVisible();

    // Verify all 6 cohorts are present
    for (const cohort of retentionCohorts) {
      await expect(matrixCard.getByRole("rowheader", { name: cohort.month })).toBeVisible();
    }

    // Verify net retention cells have values formatted as percentages
    const sampleCells = matrixCard.locator("td span.tnum");
    const cellCount = await sampleCells.count();
    expect(cellCount).toBe(6 * 12); // 6 cohorts * 12 months = 72 cells

    const firstCellText = await sampleCells.first().innerText();
    expect(firstCellText).toBe("100%");
  });
});
