import { test, expect } from "@playwright/test";

test.describe("F1. Login Flow", () => {
  test("F1.1 Login page shows all seeded users (Alice, Bob, Charlie, Diana)", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(page.getByText("Meeting Room Booking")).toBeVisible();
    await expect(page.getByText("Select a user to sign in")).toBeVisible();
    await expect(page.getByRole("button", { name: /Alice/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Bob/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Charlie/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Diana/ })).toBeVisible();
  });

  test("F1.2 Each user shows correct role badge", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: /Alice/ })).toContainText(
      "admin",
    );
    await expect(page.getByRole("button", { name: /Bob/ })).toContainText(
      "owner",
    );
    await expect(page.getByRole("button", { name: /Charlie/ })).toContainText(
      "user",
    );
    await expect(page.getByRole("button", { name: /Diana/ })).toContainText(
      "user",
    );
  });

  test("F1.3 Clicking a user logs in and redirects to bookings page", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Charlie/ }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: /Bookings/ })).toBeVisible();
  });

  test("F1.4 Header shows logged-in user name and role badge", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Bob/ }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByText("Bob").first()).toBeVisible();
    await expect(page.locator("header").getByText("owner")).toBeVisible();
  });

  test("F1.5 Logout button returns to login page", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Alice/ }).click();
    await expect(page).toHaveURL("/");
    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page).toHaveURL("/login");
    await expect(page.getByText("Select a user to sign in")).toBeVisible();
  });
});
