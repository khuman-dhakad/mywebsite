import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "320px (Small Mobile)", width: 320, height: 600, isMobile: true },
  { name: "360px (Standard Mobile)", width: 360, height: 640, isMobile: true },
  { name: "390px (iPhone 12/13/14/15)", width: 390, height: 844, isMobile: true },
  { name: "430px (iPhone Pro Max)", width: 430, height: 932, isMobile: true },
  { name: "768px (Tablet / Desktop Breakpoint)", width: 768, height: 1024, isMobile: false },
];

test.describe("Mobile Layout & Navbar Comprehensive Audit", () => {
  for (const vp of VIEWPORTS) {
    test.describe(`Viewport: ${vp.name} (${vp.width}x${vp.height})`, () => {
      test("Light & Dark Mode Verification: Header, Menu, Action Bar, Spacing, and Accessibility", async ({
        page,
      }) => {
        const consoleErrors: string[] = [];
        page.on("console", (msg) => {
          if (msg.type() === "error") consoleErrors.push(msg.text());
        });

        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

        // 1. Check for Horizontal Scroll (no horizontal overflow at any width)
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalScroll).toBe(false);

        // 2. Mobile Header Layout (< 768px)
        if (vp.isMobile) {
          const header = page.locator("header");
          const headerBox = await header.boundingBox();
          expect(headerBox).not.toBeNull();
          // Header height must be 60px
          expect(Math.round(headerBox!.height)).toBe(60);

          // Location subtext hidden on mobile
          const locationSubtext = page.locator("header span:has-text('Jaipur, Rajasthan')");
          await expect(locationSubtext).toBeHidden();

          // Header WhatsApp button hidden on mobile
          const headerWhatsApp = page.locator("header a:has-text('WhatsApp')");
          await expect(headerWhatsApp).toBeHidden();

          // Header Quick Call button hidden on mobile (<sm)
          if (vp.width < 640) {
            const headerCall = page.locator("header a:has-text('Call')");
            await expect(headerCall).toBeHidden();
          }

          // Hamburger and ThemeToggle visible
          const hamburger = page.locator("header button[aria-label='Toggle Navigation Menu']");
          await expect(hamburger).toBeVisible();
          const themeToggle = page.locator("header button[aria-label*='mode']");
          await expect(themeToggle).toBeVisible();

          // 3. Floating WhatsApp hidden on mobile
          const floatingWhatsApp = page.locator("aside[aria-label='WhatsApp quick chat']");
          await expect(floatingWhatsApp).toBeHidden();

          // 4. Mobile Bottom Action Bar visible
          const bottomBar = page.locator("[data-mobile-bottom-bar]");
          await expect(bottomBar).toBeVisible();

          // 3 equal-width buttons, min height 56px
          const barButtons = bottomBar.locator("a");
          expect(await barButtons.count()).toBe(3);
          const btn1Box = await barButtons.nth(0).boundingBox();
          const btn2Box = await barButtons.nth(1).boundingBox();
          const btn3Box = await barButtons.nth(2).boundingBox();

          expect(btn1Box!.height).toBeGreaterThanOrEqual(56);
          expect(btn2Box!.height).toBeGreaterThanOrEqual(56);
          expect(btn3Box!.height).toBeGreaterThanOrEqual(56);
          // Equal width (within 2px tolerance)
          expect(Math.abs(btn1Box!.width - btn2Box!.width)).toBeLessThanOrEqual(2);
          expect(Math.abs(btn2Box!.width - btn3Box!.width)).toBeLessThanOrEqual(2);

          // 5. Mobile Menu Drawer Interactivity & Focus Management
          expect(await hamburger.getAttribute("aria-expanded")).toBe("false");
          expect(await hamburger.getAttribute("aria-controls")).toBe("mobile-nav-panel");

          // Open Mobile Menu
          await hamburger.click();
          await expect(hamburger).toHaveAttribute("aria-expanded", "true");

          // Panel opens directly under 60px header
          const menuPanel = page.locator("#mobile-nav-panel");
          await expect(menuPanel).toBeVisible();
          const panelBox = await menuPanel.boundingBox();
          expect(Math.round(panelBox!.y)).toBe(60);

          // Bottom bar is hidden while mobile menu is open
          await expect(bottomBar).toBeHidden();

          // Body scroll is locked
          const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
          expect(bodyOverflow).toBe("hidden");

          // Large links with min 48px tap height
          const navLinks = menuPanel.locator("nav a");
          const count = await navLinks.count();
          expect(count).toBe(6);
          for (let i = 0; i < count; i++) {
            const linkBox = await navLinks.nth(i).boundingBox();
            expect(linkBox!.height).toBeGreaterThanOrEqual(48);
          }

          // Compact contact row at bottom of menu panel
          const compactContact = menuPanel.locator("text=+91 98290 12345");
          await expect(compactContact).toBeVisible();

          // Close via Escape key
          await page.keyboard.press("Escape");
          await expect(menuPanel).toBeHidden();
          await expect(hamburger).toHaveAttribute("aria-expanded", "false");
          await expect(bottomBar).toBeVisible();

          // Re-open and close via Backdrop tap
          await hamburger.click();
          await expect(menuPanel).toBeVisible();
          // Click backdrop (e.g. at bottom of viewport)
          await page.mouse.click(vp.width / 2, vp.height - 20);
          await expect(menuPanel).toBeHidden();

          // 6. Navigation Link Scrolling and Anchor Offset
          await hamburger.click();
          await expect(menuPanel).toBeVisible();
          const roomsLink = menuPanel.locator("a:has-text('Rooms & Rates')");
          await roomsLink.click();
          await expect(menuPanel).toBeHidden();
          await page.waitForTimeout(400);

          // Check that #rooms section heading is below the 60px sticky header
          const roomsSection = page.locator("#rooms");
          const roomsBox = await roomsSection.boundingBox();
          expect(roomsBox!.y).toBeGreaterThanOrEqual(58); // Not hidden under 60px sticky header

          // 7. Test in Dark Mode
          await themeToggle.click();
          await page.waitForTimeout(200);
          const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
          expect(isDark).toBe(true);

          // Verify no horizontal overflow in Dark Mode
          const darkHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
          });
          expect(darkHorizontalScroll).toBe(false);

          // Switch back to light mode
          await themeToggle.click();
        } else {
          // Viewport 768px (Tablet/Desktop)
          // Floating WhatsApp should be visible
          const floatingWhatsApp = page.locator("aside[aria-label='WhatsApp quick chat']");
          await expect(floatingWhatsApp).toBeVisible();

          // Bottom bar should be hidden
          const bottomBar = page.locator("[data-mobile-bottom-bar]");
          await expect(bottomBar).toBeHidden();
        }

        // 8. No unexpected console errors
        const relevantErrors = consoleErrors.filter(
          (err) => !err.includes("favicon") && !err.includes("Download the React DevTools")
        );
        expect(relevantErrors).toHaveLength(0);
      });
    });
  }
});
