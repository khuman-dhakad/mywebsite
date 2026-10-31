import { test, expect } from "@playwright/test";

test.describe("Visitor Experience & Mobile Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should render semantic HTML with lang=en-IN and exactly one h1", async ({ page }) => {
    const htmlLang = await page.locator("html").getAttribute("lang");
    expect(htmlLang).toBe("en-IN");

    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);

    const h1Text = await page.locator("h1").textContent();
    expect(h1Text).toContain("Shanti Nivas Heritage Lodge");
  });

  test("should render valid WhatsApp and Tel call action links", async ({ page }) => {
    // Check Hero WhatsApp CTA
    const heroWhatsApp = page.locator("a:has-text('Book on WhatsApp')").first();
    await expect(heroWhatsApp).toBeVisible();
    const waHref = await heroWhatsApp.getAttribute("href");
    expect(waHref).toMatch(/^https:\/\/wa\.me\/91\d{10}\?text=/);

    // Check Call Now CTA
    const callBtn = page.locator("a:has-text('Call Now')").first();
    await expect(callBtn).toBeVisible();
    const telHref = await callBtn.getAttribute("href");
    expect(telHref).toMatch(/^tel:\+?91/);
  });

  test("should display rooms with Indian Rupee pricing and room-specific booking", async ({ page }) => {
    const roomsSection = page.locator("#rooms");
    await expect(roomsSection).toBeVisible();

    const priceTags = roomsSection.locator("text=/₹[0-9,]+/");
    await expect(priceTags.first()).toBeVisible();

    // Specific room booking button
    const roomBookBtn = roomsSection.locator("a:has-text('Book This Room on WhatsApp')").first();
    await expect(roomBookBtn).toBeVisible();
    const roomHref = await roomBookBtn.getAttribute("href");
    expect(roomHref).toContain("wa.me");
    expect(roomHref).toContain(encodeURIComponent("Deluxe Heritage AC Room"));
  });

  test("should open accessible lightbox on gallery photo click and close on Escape", async ({ page }) => {
    const gallerySection = page.locator("#gallery");
    await expect(gallerySection).toBeVisible();

    // Click first photo
    const firstPhoto = gallerySection.locator("button[aria-label^='View photo 1']");
    await firstPhoto.click();

    // Verify dialog appears
    const lightbox = page.locator("div[role='dialog'][aria-label='Image Lightbox']");
    await expect(lightbox).toBeVisible();

    // Press Escape to dismiss
    await page.keyboard.press("Escape");
    await expect(lightbox).not.toBeVisible();
  });

  test("should render JSON-LD structured data for Hotel and FAQPage", async ({ page }) => {
    const jsonLdScripts = page.locator("script[type='application/ld+json']");
    const count = await jsonLdScripts.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const firstJson = await jsonLdScripts.first().textContent();
    expect(firstJson).toContain('"@type":"Hotel"');
    expect(firstJson).toContain('"currenciesAccepted":"INR"');
  });

  test("should show floating WhatsApp button on all viewport sizes", async ({ page }) => {
    const floatingBtn = page.locator("aside[aria-label='WhatsApp quick chat'] a");
    await expect(floatingBtn).toBeVisible();
  });

  test("should display mobile sticky bottom bar with Call, WhatsApp and Directions on mobile viewport", async ({ page, isMobile }) => {
    if (isMobile) {
      const bottomBar = page.locator("nav[aria-label='Quick Mobile Actions']");
      await expect(bottomBar).toBeVisible();
      await expect(bottomBar.locator("a:has-text('Call')")).toBeVisible();
      await expect(bottomBar.locator("a:has-text('WhatsApp')")).toBeVisible();
      await expect(bottomBar.locator("a:has-text('Directions')")).toBeVisible();
    }
  });
});
