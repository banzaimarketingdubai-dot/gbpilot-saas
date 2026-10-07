import { test, expect } from '@playwright/test';

test.describe('GBPilot Comprehensive Navigation & Functionality Tests', () => {

  // 1. DESKTOP NAVIGATION TESTS
  test.describe('Desktop Navigation Suite', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('Header brand logo navigates to Dashboard', async ({ page }) => {
      await page.goto('/onboarding');
      await page.click('[data-testid="nav-brand-logo"]');
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test('Navbar links navigate to all main screens', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page.locator('[data-testid="nav-action-hub"]')).toBeVisible();

      // Navigate to Copilot
      await page.click('[data-testid="nav-ai-copilot"]');
      await expect(page).toHaveURL(/\/copilot/);
      await expect(page.locator('h2')).toContainText('AI Growth Copilot Workspace');

      // Navigate to Geo-Grid
      await page.click('[data-testid="nav-geo-grid"]');
      await expect(page).toHaveURL(/\/geo-grid/);
      await expect(page.locator('h1')).toContainText('Geo-Grid & AI LLM Visibility Radar');

      // Navigate to Reviews & Posts
      await page.click('[data-testid="nav-reviews-posts"]');
      await expect(page).toHaveURL(/\/reviews-posts/);
      await expect(page.locator('h1')).toContainText('Reviews & Content Studio');

      // Navigate to Lead Outreach
      await page.click('[data-testid="nav-lead-outreach"]');
      await expect(page).toHaveURL(/\/outreach/);
      await expect(page.locator('h1')).toContainText('Lead Gen & Cold Outreach Funnel');

      // Navigate to Onboarding
      await page.click('[data-testid="nav-onboarding"]');
      await expect(page).toHaveURL(/\/onboarding/);
      await expect(page.locator('h1')).toContainText('Welcome to GBPilot');

      // Navigate to B2B Services
      await page.click('[data-testid="nav-b2b"]');
      await expect(page).toHaveURL(/\/b2b/);
      await expect(page.locator('h1')).toContainText('Dominate Google Maps');
    });

    test('Location Selector dropdown opens and allows selecting a business location', async ({ page }) => {
      await page.goto('/dashboard');
      await page.click('[data-testid="location-selector"]');
      await expect(page.locator('[data-testid="location-dropdown-menu"]')).toBeVisible();

      await page.click('button:has-text("Downtown Coffee Hub")');
      await expect(page.locator('[data-testid="location-selector"]')).toContainText('Downtown Coffee Hub');
    });

    test('Autopilot strategy mode dropdown toggles strategy modes', async ({ page }) => {
      await page.goto('/dashboard');
      await page.click('[data-testid="autopilot-dropdown"]');
      await expect(page.locator('[data-testid="autopilot-dropdown-menu"]')).toBeVisible();

      await page.click('[data-testid="mode-full-autopilot"]');
      await expect(page.locator('[data-testid="autopilot-dropdown"]')).toContainText('FULL AUTOPILOT');
    });

    test('Footer links navigate to correct pages', async ({ page }) => {
      await page.goto('/dashboard');
      
      await page.click('[data-testid="footer-privacy"]');
      await expect(page).toHaveURL(/\/privacy/);
      await expect(page.locator('h1')).toContainText('Privacy Policy');

      await page.click('[data-testid="footer-terms"]');
      await expect(page).toHaveURL(/\/terms/);
      await expect(page.locator('h1')).toContainText('Terms of Service');

      await page.click('[data-testid="footer-b2b"]');
      await expect(page).toHaveURL(/\/b2b/);

      await page.click('[data-testid="footer-action-hub"]');
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  // 2. MOBILE NAVIGATION TESTS (<1024px)
  test.describe('Mobile Responsive Navigation Suite', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('Mobile menu drawer opens and closes correctly', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Mobile menu drawer is hidden initially
      await expect(page.locator('[data-testid="mobile-menu-drawer"]')).not.toBeVisible();

      // Click hamburger button to open drawer
      await page.click('[data-testid="mobile-menu-button"]');
      await expect(page.locator('[data-testid="mobile-menu-drawer"]')).toBeVisible();

      // Click mobile link to navigate to Copilot
      await page.click('[data-testid="mobile-nav-ai-copilot"]');
      await expect(page).toHaveURL(/\/copilot/);
      
      // Drawer closes after navigation
      await expect(page.locator('[data-testid="mobile-menu-drawer"]')).not.toBeVisible();
    });

    test('Mobile user can navigate to all screens via mobile drawer', async ({ page }) => {
      await page.goto('/onboarding');
      
      // Open drawer and navigate to Geo-Grid
      await page.click('[data-testid="mobile-menu-button"]');
      await page.click('[data-testid="mobile-nav-geo-grid"]');
      await expect(page).toHaveURL(/\/geo-grid/);

      // Open drawer and navigate to Reviews
      await page.click('[data-testid="mobile-menu-button"]');
      await page.click('[data-testid="mobile-nav-reviews-posts"]');
      await expect(page).toHaveURL(/\/reviews-posts/);

      // Open drawer and navigate to B2B
      await page.click('[data-testid="mobile-menu-button"]');
      await page.click('[data-testid="mobile-nav-b2b"]');
      await expect(page).toHaveURL(/\/b2b/);
    });
  });

  // 3. PAGE INTERACTION & FUNCTIONALITY TESTS
  test.describe('Screen Functionality & Interactive Workflows', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('Onboarding Mode A Website Extraction workflow', async ({ page }) => {
      await page.goto('/onboarding');
      
      // Select Mode A
      await page.click('h2:has-text("I do NOT have a Google Profile")');
      await expect(page.locator('h2:has-text("Step 1: Enter Business Website")')).toBeVisible();

      // Enter website domain without http/https (e.g. virale.uno)
      await page.fill('input[inputmode="url"]', 'virale.uno');
      await page.click('button[type="submit"]');

      // Expect extracted entity baseline
      await expect(page.locator('h3:has-text("Extracted Entity Baseline")')).toBeVisible({ timeout: 15000 });
      await expect(page.locator('span:has-text("Extracted Phone")')).toBeVisible();
    });

    test('Onboarding Mode B Magic Search Scan workflow', async ({ page }) => {
      await page.goto('/onboarding');
      
      // Select Mode B
      await page.click('h2:has-text("I ALREADY HAVE a Google Profile")');
      await expect(page.locator('h2:has-text("Magic Search Scan")')).toBeVisible();

      // Fill search query
      await page.fill('input[placeholder*="Manhattan Bakery"]', 'Dubai Coffee Roasters');
      await page.click('button[type="submit"]');

      // Expect Geo-Grid Heatmap snapshot
      await expect(page.locator('h3:has-text("3x3 Geo-Grid Heatmap Snapshot")')).toBeVisible({ timeout: 15000 });
    });

    test('Geo-Grid Radar tabs and keyword filters work', async ({ page }) => {
      await page.goto('/geo-grid');
      
      // Switch tab to AI Search Share-of-Voice
      await page.click('button:has-text("AI Search Share-of-Voice (GEO)")');
      await expect(page.locator('span:has-text("ChatGPT Brand Mention Rate")')).toBeVisible();

      // Switch back to Google Maps Geo-Grid
      await page.click('button:has-text("Google Maps Geo-Grid")');
      await expect(page.locator('h3:has-text("Spatial Pin Heatmap")')).toBeVisible();
    });

    test('Reviews Studio tab switching works', async ({ page }) => {
      await page.goto('/reviews-posts');
      
      // Switch to QR NFC Constructor
      await page.click('button:has-text("QR & NFC Poster Constructor")');
      await expect(page.locator('h3:has-text("Table Tent & Sticker Customizer")')).toBeVisible();

      // Switch to Google Posts Content Planner
      await page.click('button:has-text("Google Posts Content Planner")');
      await expect(page.locator('h3:has-text("AI Google Post Composer")')).toBeVisible();
    });

    test('Public Teaser Audit Page loads correctly', async ({ page }) => {
      await page.goto('/audit/lead-101');
      await expect(page.locator('h1')).toContainText('Central District Bakery');
      await expect(page.locator('span:has-text("Health Score")')).toBeVisible();
      await expect(page.locator('a:has-text("Claim 14-Day Free Pro Trial")')).toBeVisible();
    });
  });

});
