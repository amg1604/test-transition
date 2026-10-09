const { expect } = require('@playwright/test');

// ---------------------------------------------------------------------------
// SELECTORS
// Update these if the real DOM uses different attributes.
// TIP: Run `npx playwright codegen https://smart-dev.allianz.com/portfolio-transfer/`
//      to record interactions and auto-generate selectors.
// ---------------------------------------------------------------------------
const SELECTORS = {
  // Post-login app shell
  appRoot:            'pt-root, main, [role="main"], #app, #root, .app-container, app-root',

  // Top navigation / header
  header:             'header, .header, .navbar, .app-header, alz-header',
  userInfo:           '.nx-avatar__content-wrapper, button[aria-label="Open settings"]',
  logoutButton:       'button:has-text("Logout"), button:has-text("Sign out"), a:has-text("Logout")',

  // Step indicator / progress bar
  stepIndicator:      '.step-indicator, .progress-steps, .wizard-steps, stepper, alz-stepper',
  activeStep:         '.step--active, .step.active, [aria-current="step"]',

  // Step 1 – Source portfolio / sender
  sourcePortfolioDropdown: 'select[name="sourcePortfolio"], [data-testid="source-portfolio"], #sourcePortfolio',
  sourcePortfolioOption:   'option, mat-option, alz-option',

  // Step 2 – Target portfolio / receiver
  targetPortfolioDropdown: 'select[name="targetPortfolio"], [data-testid="target-portfolio"], #targetPortfolio',

  // Step 3 – Transfer amount / percentage
  amountInput:        'input[name="amount"], input[name="transferAmount"], [data-testid="amount-input"]',
  percentageInput:    'input[name="percentage"], input[name="transferPercentage"], [data-testid="percentage-input"]',
  fullTransferToggle: 'input[type="checkbox"][name="fullTransfer"], [data-testid="full-transfer"]',

  // Step 4 – Date / scheduling
  dateInput:          'input[type="date"], input[name="transferDate"], [data-testid="date-input"]',

  // Navigation buttons
  nextButton:         'button:has-text("Next"), button:has-text("Weiter"), button:has-text("Continue"), button[type="submit"]:not(:has-text("Submit"))',
  backButton:         'button:has-text("Back"), button:has-text("Zurück"), button:has-text("Previous")',
  submitButton:       'button:has-text("Submit"), button:has-text("Confirm"), button:has-text("Send"), button[type="submit"]',
  cancelButton:       'button:has-text("Cancel"), button:has-text("Abbrechen")',

  // Confirmation / summary page
  confirmationPanel:  '.confirmation, .summary, [data-testid="confirmation"], .success-panel',
  referenceNumber:    '.reference-number, [data-testid="reference-number"], .transaction-id',

  // Validation messages
  errorMessage:       '.error-message, .field-error, [role="alert"], .mat-error, alz-error',
  successMessage:     '.success-message, [role="status"], .alert-success',

  // Dashboard
  newScenarioButton:  'button:has-text("New Scenario"), button:has-text("Neues Szenario"), [data-testid="new-scenario"]',
  selectSendingAgentButton: 'button:has-text("Select sending intermediary"), button:has-text("Sendenden Vermittler auswählen"), [data-testid="select-sending-agent"]',
};

/**
 * Navigates to the portfolio transfer app and waits for the app shell to be
 * visible. Called at the start of tests that need an authenticated session.
 */
async function gotoAndWaitForApp(page) {
  await page.goto('/portfolio-transfer/');
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator(SELECTORS.appRoot).first()).toBeVisible({ timeout: 30_000 });
}

module.exports = { SELECTORS, gotoAndWaitForApp };
