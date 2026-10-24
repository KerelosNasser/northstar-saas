import { expect, test } from "@playwright/test";

// `nav` is the link name inside the sidebar `aside` (primary nav or the bottom
// settings link). AI Insights carries a badge digit in its accessible name.
const screens = [
  { path: "/", heading: "Good morning, Alex.", nav: null },
  { path: "/revenue", heading: "Revenue Analytics", nav: "Revenue" },
  { path: "/customers", heading: "Customers", nav: "Customers" },
  { path: "/reports", heading: "Reports", nav: "Reports" },
  { path: "/insights", heading: "AI Business Insights", nav: /^AI Insights/ },
  { path: "/settings", heading: "Settings", nav: "Settings" },
] as const;

test.describe("shell and navigation", () => {
  for (const screen of screens) {
    test(`${screen.path} renders without console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(error.message));

      await page.goto(screen.path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(screen.heading);

      expect(errors).toEqual([]);
    });
  }

  test("sidebar navigation reaches every screen", async ({ page, isMobile }) => {
    test.skip(isMobile, "sidebar is a drawer on mobile; covered separately");
    await page.goto("/");

    const sidebar = page.locator("aside").first();
    for (const screen of screens) {
      if (!screen.nav) continue;
      await sidebar.getByRole("link", { name: screen.nav }).first().click();
      await expect(page).toHaveURL(new RegExp(`${screen.path}$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(screen.heading);
    }
  });

  test("mobile drawer opens and navigates", async ({ page, isMobile }) => {
    test.skip(!isMobile, "desktop uses the fixed sidebar");
    await page.goto("/");

    await page.getByRole("button", { name: "Open navigation" }).click();
    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible();
    await drawer.getByRole("link", { name: "Revenue" }).click();

    await expect(page).toHaveURL(/\/revenue$/);
    await expect(drawer).toBeHidden();
  });

  test("page does not overflow horizontally", async ({ page }) => {
    for (const screen of screens) {
      await page.goto(screen.path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${screen.path} overflows horizontally`).toBeLessThanOrEqual(1);
    }
  });
});
