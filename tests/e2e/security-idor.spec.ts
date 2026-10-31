import { test, expect } from "@playwright/test";

test.describe("Security, Access Control & IDOR Prevention", () => {
  test("unauthenticated visitor attempting to access /admin is redirected to /admin/login", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForURL(/\/admin\/login/);
    expect(page.url()).toContain("/admin/login");
  });

  test("unauthenticated visitor attempting to access /admin subpaths is redirected", async ({ page }) => {
    await page.goto("/admin/rooms");
    await page.waitForURL(/\/admin\/login/);
    expect(page.url()).toContain("/admin/login");
  });

  test("POST mutation to /admin without valid session cookie is rejected or redirected", async ({ request }) => {
    const response = await request.post("/admin", {
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      data: {
        name: "Hacked Hotel Name",
        phone: "+91 98290 12345",
      },
    });

    // An unauthenticated POST to /admin must be redirected (302/307/308) or rejected (401/403/404/405)
    expect([302, 307, 308, 401, 403, 404, 405]).toContain(response.status());
  });

  test("attempting to spoof tenant with forged site_id query does not bypass auth", async ({ page }) => {
    await page.goto("/admin?site_id=another-hotel-tenant-bypass");
    await page.waitForURL(/\/admin\/login/);
    expect(page.url()).toContain("/admin/login");
  });
});
