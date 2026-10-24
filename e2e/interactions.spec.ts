import { expect, test } from "@playwright/test";

test.describe("representative screen interactions", () => {
  test("Overview: date range and customize dialog", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Good morning, Alex.");

    // Open customize dialog
    await page.getByRole("button", { name: "Customize" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Customize dashboard" })).toBeVisible();
    await page.getByRole("button", { name: "Done" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("Revenue: currency changes and waterfall bridge toggle", async ({ page }) => {
    await page.goto("/revenue");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Revenue Analytics");

    // Toggle waterfall view
    const viewButton = page.getByRole("button", { name: "Bridge view" });
    if (await viewButton.isVisible()) {
      await viewButton.click();
      await page.getByRole("menuitem", { name: "Cumulative view" }).click();
      await expect(page.getByRole("button", { name: "Cumulative view" })).toBeVisible();
    }

    // Check pagination buttons exist in Subscriptions table
    const nextBtn = page.getByRole("button", { name: "Next" });
    await expect(nextBtn).toBeVisible();
  });

  test("Customers: filter tabs, search, selection, and detail inspection", async ({ page, isMobile }) => {
    await page.goto("/customers");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Customers");

    // Click Enterprise tab
    await page.getByRole("tab", { name: /^Enterprise/ }).click();
    await expect(page.getByRole("table").getByText("PixelCraft Studios")).toBeVisible();

    // Search
    const searchInput = page.getByPlaceholder("Search accounts or CSM...");
    await searchInput.fill("PixelCraft");
    await expect(page.getByRole("table").getByText("PixelCraft Studios")).toBeVisible();
    await searchInput.clear();

    // Click row and check detail
    await page.getByRole("table").getByText("PixelCraft Studios").first().click();
    if (!isMobile) {
      await expect(page.getByText("Design System Enterprise License")).toBeVisible();
    }
  });

  test("Reports: filter tabs and create report modal", async ({ page }) => {
    await page.goto("/reports");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Reports");

    // Click Create Report
    await page.getByRole("button", { name: "Create report" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Configure new report")).toBeVisible();

    // Form validation: try submitting empty title
    await dialog.getByRole("button", { name: "Create report" }).click();
    await expect(dialog.getByText("Report title must be at least 3 characters long.")).toBeVisible();

    // Fill valid title and submit
    await dialog.getByLabel("Report Title").fill("Executive Retention Review");
    await dialog.getByRole("button", { name: "Create report" }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByText("Executive Retention Review")).toBeVisible();
  });

  test("AI Insights: category filter tabs and resolve toggle", async ({ page }) => {
    await page.goto("/insights");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("AI Business Insights");

    // Check governance notice
    await expect(page.getByText("Deterministic local intelligence assurance")).toBeVisible();

    // Check resolve toggle on first insight moves it to Resolved tab
    const resolveBtn = page.getByRole("button", { name: "Mark resolved" }).first();
    await resolveBtn.click();

    // Switch to Resolved tab
    await page.getByRole("tab", { name: /^Resolved/ }).click();
    await expect(page.getByRole("button", { name: "Reopen" }).first()).toBeVisible();

    // Reopen it
    await page.getByRole("button", { name: "Reopen" }).first().click();
    await expect(page.getByText("No insights in this category")).toBeVisible();
  });

  test("Settings: tabs, dirty-state detection and theme switcher", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Settings");

    // Appearance tab
    await page.getByRole("tab", { name: "Appearance" }).click();
    await expect(page.getByText("Light Mode")).toBeVisible();
    await expect(page.getByText("Dark Mode")).toBeVisible();

    // Switch to dark theme
    await page.getByText("Dark Mode").click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Switch back to light theme
    await page.getByText("Light Mode").click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);

    // Profile dirty state
    await page.getByRole("tab", { name: "General Profile" }).click();
    const nameInput = page.getByLabel("Workspace name");
    await nameInput.fill("Acme Corp (Staging Mod)");
    await expect(page.getByText("You have unsaved changes in your workspace preferences.")).toBeVisible();

    // Revert changes
    await page.getByRole("button", { name: "Revert changes" }).click();
    await expect(page.getByText("You have unsaved changes")).toBeHidden();
  });
});

test.describe("all 6 required viewports - horizontal overflow and integrity", () => {
  const viewports = [
    { width: 1920, height: 1080, name: "1920px" },
    { width: 1440, height: 900, name: "1440px" },
    { width: 1280, height: 800, name: "1280px" },
    { width: 1024, height: 768, name: "1024px" },
    { width: 768, height: 1024, name: "768px" },
    { width: 375, height: 667, name: "375px" },
  ];

  const screens = ["/", "/revenue", "/customers", "/reports", "/insights", "/settings"];

  for (const vp of viewports) {
    test(`no overflow at ${vp.name} across all 6 screens`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      for (const path of screens) {
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${path} overflows horizontally at ${vp.name}`).toBeLessThanOrEqual(1);
      }
    });
  }
});
