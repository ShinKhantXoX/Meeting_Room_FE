import { test, expect } from "@playwright/test";

test.describe("F2. Role-Based Navigation", () => {
  test("F2.1 User (Charlie) sees only Bookings nav link", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Charlie/ }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("link", { name: "Bookings" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Summary" })).not.toBeVisible();
    await expect(page.getByRole("link", { name: "Users" })).not.toBeVisible();
  });

  test("F2.2 Owner (Bob) sees Bookings + Summary nav links", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Bob/ }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("link", { name: "Bookings" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Summary" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Users" })).not.toBeVisible();
  });

  test("F2.3 Admin (Alice) sees Bookings + Summary + Users nav links", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Alice/ }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("link", { name: "Bookings" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Summary" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Users" })).toBeVisible();
  });

  test("F2.4 User navigating to /admin is redirected to /", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Charlie/ }).click();
    await expect(page).toHaveURL("/");
    await page.goto("/admin");
    await expect(page).toHaveURL("/");
  });

  test("F2.5 User navigating to /summary is redirected to /", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Diana/ }).click();
    await expect(page).toHaveURL("/");
    await page.goto("/summary");
    await expect(page).toHaveURL("/");
  });
});
