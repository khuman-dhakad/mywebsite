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
    const hero = page.locator("main section").first();
    const heroWhatsApp = hero.getByRole("link", { name: "Book on WhatsApp" });
    await expect(heroWhatsApp).toBeVisible();
    const waHref = await heroWhatsApp.getAttribute("href");
    expect(waHref).toMatch(/^https:\/\/wa\.me\/91\d{10}\?text=/);

    const callBtn = hero.getByRole("link", { name: /Call Now:/ });
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
    const roomBookBtn = roomsSection.locator("a:has-text('Quick Book on WhatsApp')").first();
    await expect(roomBookBtn).toBeVisible();
    const roomHref = await roomBookBtn.getAttribute("href");
    expect(roomHref).toContain("wa.me");
    expect(roomHref).toContain(encodeURIComponent("Deluxe Heritage AC Room"));
  });

  test("should open direct reservation modal and calculate estimated tariff", async ({ page }) => {
    const roomsSection = page.locator("#rooms");
    const reserveBtn = roomsSection.locator("button:has-text('Reserve / Check Dates')").first();
    await expect(reserveBtn).toBeVisible();
    await reserveBtn.click();

    const modal = page.locator("dialog[aria-labelledby='booking-modal-title']");
    await expect(modal).toBeVisible();
    await expect(modal.locator("h2#booking-modal-title")).toContainText("Check Dates & Tariffs");

    // Check tariff breakdown card is visible
    await expect(modal.locator("text=Estimated Total Tariff")).toBeVisible();

    // Close on close button
    const closeBtn = modal.locator("button[aria-label='Close booking inquiry dialog']");
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test("should filter rooms by room type category", async ({ page }) => {
    const roomsSection = page.locator("#rooms");
    const familyTab = roomsSection.getByRole("tab", { name: "Family Suites" });
    await familyTab.click();
    await expect(familyTab).toHaveAttribute("aria-selected", "true");
    await expect(roomsSection.locator("h3:has-text('Royal Family Jharokha Suite')")).toBeVisible();
  });

  test("should render guest reviews showcase and allow category filtering", async ({ page }) => {
    const reviewsSection = page.locator("#reviews");
    await expect(reviewsSection).toBeVisible();
    await expect(reviewsSection.locator("text=Verified Google & Guest Rating")).toBeVisible();

    const familyTab = reviewsSection.getByRole("tab", { name: "Family Travelers" });
    await familyTab.click();
    await expect(familyTab).toHaveAttribute("aria-selected", "true");
    await expect(reviewsSection.locator("text=Rajesh & Sunita Sharma")).toBeVisible();
  });

  test("should render heritage attractions concierge guide", async ({ page }) => {
    const attractionsSection = page.locator("#attractions");
    await expect(attractionsSection).toBeVisible();
    await expect(attractionsSection.locator("h3:has-text('Hawa Mahal')")).toBeVisible();
  });

  test("should allow copying property address", async ({ page }) => {
    const contactSection = page.locator("#contact");
    await expect(contactSection).toBeVisible();
    const copyBtn = contactSection.locator("button:has-text('Copy Full Address')");
    await expect(copyBtn).toBeVisible();
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
    await expect(lightbox.getByRole("button", { name: /Close Lightbox/ })).toBeFocused();

    // Press Escape to dismiss
    await page.keyboard.press("Escape");
    await expect(lightbox).not.toBeVisible();
    await expect(firstPhoto).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");

    // Re-open and dismiss via clicking the backdrop corner
    await firstPhoto.click();
    await expect(lightbox).toBeVisible();
    await lightbox.click({ position: { x: 10, y: 10 } });
    await expect(lightbox).not.toBeVisible();
  });

  test("should filter gallery photos by category tab", async ({ page }) => {
    const gallerySection = page.locator("#gallery");
    const roomsTab = gallerySection.getByRole("tab", { name: "Rooms" });
    await roomsTab.click();
    await expect(roomsTab).toHaveAttribute("aria-selected", "true");
    const visibleButtons = gallerySection.locator("button[aria-label^='View photo']");
    expect(await visibleButtons.count()).toBeGreaterThanOrEqual(1);
  });

  test("should render JSON-LD structured data for Hotel and FAQPage", async ({ page }) => {
    const jsonLdScripts = page.locator("script[type='application/ld+json']");
    const count = await jsonLdScripts.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const firstJson = await jsonLdScripts.first().textContent();
    expect(firstJson).toContain('"@type":"Hotel"');
    expect(firstJson).toContain('"currenciesAccepted":"INR"');
  });

  test("should show floating WhatsApp button on tablet and desktop only", async ({ page }) => {
    const floatingBtn = page.locator("aside[aria-label='WhatsApp quick chat'] a");
    const viewportWidth = page.viewportSize()?.width ?? 1280;

    if (viewportWidth < 768) {
      await expect(floatingBtn).toBeHidden();
    } else {
      await expect(floatingBtn).toBeVisible();
    }
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
