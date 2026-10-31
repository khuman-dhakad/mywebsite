import { test, expect } from "@playwright/test";

test.describe("Admin Authentication & Security Controls", () => {
  test("should render login page with noindex header and no public signup option", async ({ page }) => {
    const response = await page.goto("/admin/login");
    expect(response?.status()).toBe(200);

    // Verify noindex robots header
    const headers = response?.headers();
    expect(headers?.["x-robots-tag"]).toContain("noindex");

    // Strictly ensure no sign up / register buttons exist
    const signupBtn = page.locator("a:has-text('Sign Up'), button:has-text('Sign Up'), a:has-text('Register')");
    await expect(signupBtn).toHaveCount(0);
  });

  test("should show generic error message on incorrect login credentials", async ({ page }) => {
    await page.goto("/admin/login");

    await page.fill("input#email", "unregistered@example.com");
    await page.fill("input#password", "WrongPassword123!");
    await page.click("button[type='submit']");

    const errorAlert = page.locator("[data-testid='login-error']");
    await expect(errorAlert).toBeVisible({ timeout: 15000 });
    await expect(errorAlert).toContainText(/Invalid email or password|An unexpected network error/i);
  });

  test("should redirect unauthenticated users away from /admin dashboard to /admin/login", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForURL(/\/admin\/login/, { timeout: 10000 });
    expect(page.url()).toContain("/admin/login");
  });
});
