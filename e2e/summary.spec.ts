import { test, expect } from "@playwright/test";

test.describe("F6. Summary Page", () => {
  test("F6.1 Owner/Admin sees usage summary table (user, role, total bookings)", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Bob/ }).click();
    await expect(page).toHaveURL("/");
    await page.getByRole("link", { name: "Summary" }).click();
    await expect(page).toHaveURL("/summary");
    await expect(
      page.getByRole("heading", { name: "Usage summary" }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Total bookings" }),
    ).toBeVisible();
    await expect(page.locator("table")).toBeVisible();
  });

  test("F6.2 Owner/Admin sees bookings grouped by user with time ranges", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Alice/ }).click();
    await page.getByRole("link", { name: "Summary" }).click();
    await expect(
      page.getByRole("heading", { name: "Bookings by user" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Alice", level: 3 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Bob", level: 3 }),
    ).toBeVisible();
  });

  test("F6.3 Summary reflects current data (create a booking, check summary updates)", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Charlie/ }).click();
    await page.getByLabel("Start").fill("2026-09-01T08:00");
    await page.getByLabel("End").fill("2026-09-01T09:00");
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("9/1/26").first()).toBeVisible();
    await page.getByRole("button", { name: "Logout" }).click();
    await page.getByRole("button", { name: /Bob/ }).click();
    await page.getByRole("link", { name: "Summary" }).click();
    await expect(
      page.getByRole("heading", { name: "Charlie", level: 3 }),
    ).toBeVisible();
    await expect(page.getByText("9/1/26").first()).toBeVisible();
  });
});
