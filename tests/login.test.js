const { test, expect } = require('@playwright/test');
const { SELECTORS, gotoAndWaitForApp } = require('./helpers');

test.describe('Portfolio Transfer – Login & Authentication', () => {

  test('TC-01 | Page loads and returns HTTP 200', async ({ page }) => {
    const response = await page.goto('https://smart-dev.allianz.com/portfolio-transfer/dashboard');
    await page.waitForLoadState('load');
    expect(response.status()).toBe(200);
    await expect(page).toHaveURL(/portfolio-transfer/);
    await page.screenshot({ path: 'screenshots/TC-01-page-load.png', fullPage: true });
  });

  test('TC-02 | Client certificate is presented and session is established', async ({ page }) => {
    // Playwright sends the PFX cert automatically on the TLS handshake.
    // The test verifies the app did NOT redirect to an error / login wall.
    await page.goto('/portfolio-transfer/');
    await page.waitForLoadState('domcontentloaded');

    await expect(page).not.toHaveURL(/login|signin|error|401|403|forbidden|unauthorized/i);
    await page.screenshot({ path: 'screenshots/TC-02-authenticated.png', fullPage: true });

    console.log('Certificate used – Subject: MUNOZ GOMEZ GABRIEL ANDRES | Issuer: Allianz UserCA V | Serial: 171DE0');
  });

  test('TC-03 | App shell is rendered after authentication', async ({ page }) => {
    await gotoAndWaitForApp(page);

    const appRoot = page.locator(SELECTORS.appRoot).first();
    await expect(appRoot).toBeVisible();
    await expect(appRoot).not.toBeEmpty();
    await page.screenshot({ path: 'screenshots/TC-03-app-shell.png', fullPage: true });
  });

  test('TC-04 | Page title is present and not empty', async ({ page }) => {
    await gotoAndWaitForApp(page);

    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    console.log('Page title:', title);
  });

  test('TC-05 | Header / navigation bar is visible', async ({ page }) => {
    await gotoAndWaitForApp(page);

    const header = page.locator(SELECTORS.header).first();
    await expect(header).toBeVisible();
    await page.screenshot({ path: 'screenshots/TC-05-header.png' });
  });

});
