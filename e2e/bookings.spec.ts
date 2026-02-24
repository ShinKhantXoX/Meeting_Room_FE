import { test, expect } from "@playwright/test";

test.describe("F3. Booking Creation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Charlie/ }).click();
    await expect(page).toHaveURL("/");
  });

  test("F3.1 Fill start/end times and click Create; new booking appears in list", async ({
    page,
  }) => {
    const start = "2026-08-01T10:00";
    const end = "2026-08-01T11:00";
    await page.getByLabel("Start").fill(start);
    await page.getByLabel("End").fill(end);
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("8/1/26, 10:00 AM")).toBeVisible();
    await expect(page.getByText("8/1/26, 11:00 AM")).toBeVisible();
  });

  test("F3.2 Create with end before start; modal appears with error message; OK dismisses", async ({
    page,
  }) => {
    await page.getByLabel("Start").fill("2026-08-02T11:00");
    await page.getByLabel("End").fill("2026-08-02T10:00");
    await page.getByRole("button", { name: "Create" }).click();
    await expect(
      page.getByText("End date and time must be after start date and time."),
    ).toBeVisible();
    await page.getByRole("button", { name: "OK" }).click();
    await expect(
      page.getByText("End date and time must be after start date and time."),
    ).not.toBeVisible();
  });

  test("F3.3 Create overlapping booking; inline error shows overlaps", async ({
    page,
  }) => {
    await page.getByLabel("Start").fill("2026-08-03T10:00");
    await page.getByLabel("End").fill("2026-08-03T11:00");
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("8/3/26").first()).toBeVisible();
    await page.getByLabel("Start").fill("2026-08-03T10:30");
    await page.getByLabel("End").fill("2026-08-03T11:30");
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText(/overlaps/i)).toBeVisible();
  });
});

test.describe("F4. Booking Deletion", () => {
  test("F4.1 User (Charlie) sees Delete button only on own bookings", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Charlie/ }).click();
    await expect(page).toHaveURL("/");
    const deleteButtons = page.getByRole("button", { name: "Delete" });
    const count = await deleteButtons.count();
    expect(count).toBeGreaterThanOrEqual(1);
    const listItems = page
      .locator("ul li")
      .filter({ has: page.getByRole("button", { name: "Delete" }) });
    for (let i = 0; i < (await listItems.count()); i++) {
      await expect(listItems.nth(i)).toContainText("Charlie");
    }
  });

  test("F4.2 Owner (Bob) sees Delete button on all bookings", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Bob/ }).click();
    await expect(page).toHaveURL("/");
    const listItems = page
      .locator("ul li")
      .filter({ hasNot: page.getByText("No bookings yet") });
    const count = await listItems.count();
    if (count > 0) {
      const deleteButtons = page.getByRole("button", { name: "Delete" });
      await expect(deleteButtons).toHaveCount(count);
    }
  });

  test("F4.3 Admin (Alice) sees Delete button on all bookings", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Alice/ }).click();
    await expect(page).toHaveURL("/");
    const listItems = page
      .locator("ul li")
      .filter({ hasNot: page.getByText("No bookings yet") });
    const count = await listItems.count();
    if (count > 0) {
      const deleteButtons = page.getByRole("button", { name: "Delete" });
      await expect(deleteButtons).toHaveCount(count);
    }
  });

  test("F4.4 Clicking Delete removes booking from list", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Charlie/ }).click();
    await expect(page).toHaveURL("/");
    const firstDelete = page.getByRole("button", { name: "Delete" }).first();
    const listCountBefore = await page.locator("ul li").count();
    await firstDelete.click();
    await expect(page.locator("ul li")).toHaveCount(listCountBefore - 1);
  });
});
