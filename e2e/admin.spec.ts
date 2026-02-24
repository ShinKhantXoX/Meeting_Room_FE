import { test, expect } from "@playwright/test";

test.describe("F5. Admin - User Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Alice/ }).click();
    await expect(page).toHaveURL("/");
    await page.getByRole("link", { name: "Users" }).click();
    await expect(page).toHaveURL("/admin");
  });

  test("F5.1 Admin creates a new user with a chosen role", async ({ page }) => {
    await page.getByPlaceholder("New user name").fill("E2EUser");
    await page.locator("form").getByRole("combobox").selectOption("owner");
    await page.getByRole("button", { name: "Add user" }).click();
    const cell = page.getByRole("cell", { name: "E2EUser" }).last();
    await expect(cell).toBeVisible();
    const row = cell.locator("..");
    await expect(row.getByRole("combobox")).toHaveValue("owner");
  });

  test("F5.2 New user appears in user table", async ({ page }) => {
    await page.getByPlaceholder("New user name").fill("NewUser");
    await page.getByRole("button", { name: "Add user" }).click();
    await expect(page.getByRole("cell", { name: "NewUser" })).toBeVisible();
  });

  test("F5.3 Admin changes a user's role via dropdown", async ({ page }) => {
    const dianaRow = page.locator("tr").filter({ hasText: "Diana" });
    await dianaRow.getByRole("combobox").selectOption("owner");
    await expect(dianaRow.getByRole("combobox")).toHaveValue("owner");
    // Restore Diana's role so other tests (e.g. F1.2, F2.5) are not polluted
    await dianaRow.getByRole("combobox").selectOption("user");
    await expect(dianaRow.getByRole("combobox")).toHaveValue("user");
  });

  test("F5.4 Admin deletes a user; user disappears from table", async ({
    page,
  }) => {
    await page.getByPlaceholder("New user name").fill("ToDelete");
    await page.getByRole("button", { name: "Add user" }).click();
    await expect(page.getByRole("cell", { name: "ToDelete" })).toBeVisible();
    await page
      .locator("tr")
      .filter({ hasText: "ToDelete" })
      .getByRole("button", { name: "Delete" })
      .click();
    await expect(
      page.getByRole("cell", { name: "ToDelete" }),
    ).not.toBeVisible();
  });

  test("F5.5 Deleted user's bookings are also removed from bookings list", async ({
    page,
  }) => {
    await page.goto("/");
    const list = page.locator("ul li");
    const countWithCharlie = await page.getByText("(Charlie)").count();
    if (countWithCharlie === 0) {
      test.skip();
      return;
    }
    const totalBefore = await list.count();
    await page.getByRole("link", { name: "Users" }).click();
    await page
      .locator("tr")
      .filter({ hasText: "Charlie" })
      .getByRole("button", { name: "Delete" })
      .click();
    await page.getByRole("link", { name: "Bookings" }).click();
    await expect(page.getByText("(Charlie)")).not.toBeVisible();
    await expect(list).toHaveCount(totalBefore - countWithCharlie);
  });
});
