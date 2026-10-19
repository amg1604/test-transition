const { test, expect } = require('@playwright/test');
const { SELECTORS } = require('./helpers');

test.describe('Portfolio Transfer – Dashboard', () => {

  test('TC-06 | New Scenario: configure sending and receiving agents then reach configuration page', async ({ page }) => {
    test.setTimeout(180_000);
    await page.goto('https://smart-dev.allianz.com/portfolio-transfer/dashboard');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator(SELECTORS.appRoot).first()).toBeVisible({ timeout: 30_000 });

    // Dashboard data (scenario list) loads asynchronously after the app shell renders
    const loadingIndicator = page.locator('[role="status"]').filter({ hasText: 'Loading' }).first();
    if (await loadingIndicator.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await loadingIndicator.waitFor({ state: 'hidden', timeout: 30_000 });
    }

    // Step 1 – Click "New Scenario"
    const newScenarioBtn = page.locator(SELECTORS.newScenarioButton).first();
    await expect(newScenarioBtn).toBeVisible({ timeout: 15_000 });
    await expect(newScenarioBtn).toBeEnabled();
    await newScenarioBtn.click();
    await page.screenshot({ path: 'screenshots/TC-06-01-new-scenario.png' });

    // Step 2 – Click "Select sending agent", wait for sidepanel, search for "Mario Bace" and select them
    const selectSendingAgentBtn = page.locator(SELECTORS.selectSendingAgentButton).first();
    await expect(selectSendingAgentBtn).toBeVisible({ timeout: 15_000 });
    await expect(selectSendingAgentBtn).toBeEnabled();
    await selectSendingAgentBtn.click();
    await page.waitForSelector('nx-sidepanel:not(.ng-animating)', { timeout: 15_000 });
    await page.screenshot({ path: 'screenshots/TC-06-02-select-sending-agent.png' });

    const agentSearchInput = page.locator('input[placeholder="Search by name (min 3 characters)"]').first();
    await agentSearchInput.waitFor({ state: 'visible', timeout: 15_000 });
    await agentSearchInput.scrollIntoViewIfNeeded();
    await agentSearchInput.click();
    await agentSearchInput.pressSequentially('Mario Bace', { delay: 100 });

    // Wait for Mario Bace to appear in results then click the Add button in their row.
    // Match by accessible name (getByRole) rather than raw textContent — the app renders
    // the name with whitespace (e.g. a non-breaking space) that a literal-space regex
    // against textContent won't match, even though it looks identical on screen.
    // Search results load over the network and can take longer than other UI transitions.
    const marioBaceHeading = page.getByRole('heading', { name: 'Mario Bace', exact: true }).first();
    await expect(marioBaceHeading).toBeVisible({ timeout: 30_000 });
    const marioBaceRow = page.getByRole('listitem').filter({ has: marioBaceHeading }).first();
    const marioBaceAddBtn = marioBaceRow.getByRole('button', { name: /^Add/ });
    await expect(marioBaceAddBtn).toBeVisible({ timeout: 30_000 });
    await marioBaceAddBtn.click();
    await page.screenshot({ path: 'screenshots/TC-06-02-sending-agent-selected.png' });

    // Step 3 – Mario Bace is added; wait for sidepanel to close
    await page.waitForSelector('nx-sidepanel:not(.ng-animating)', { timeout: 15_000 });
    await page.screenshot({ path: 'screenshots/TC-06-03-sending-agent-confirmed.png' });

    // Step 4 – A list of customers appears; select all then click "Next"
    // The Next button stays disabled until at least one customer is selected.
    const selectAllCheckbox = page.locator(
      'nx-checkbox[aria-label="Select all"], nx-checkbox[aria-label="select all"], th nx-checkbox, thead nx-checkbox'
    ).first();
    const firstRowCheckbox = page.locator(
      'td nx-checkbox, tbody nx-checkbox, nx-checkbox'
    ).first();

    if (await selectAllCheckbox.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await selectAllCheckbox.scrollIntoViewIfNeeded();
      await selectAllCheckbox.click();
    } else {
      await firstRowCheckbox.waitFor({ state: 'visible', timeout: 10_000 });
      await firstRowCheckbox.scrollIntoViewIfNeeded();
      await firstRowCheckbox.click();
    }

    const nextBtnStep4 = page.locator(SELECTORS.nextButton).first();
    await expect(nextBtnStep4).toBeVisible({ timeout: 15_000 });
    await expect(nextBtnStep4).toBeEnabled({ timeout: 15_000 });
    await page.screenshot({ path: 'screenshots/TC-06-04-sending-agent-list.png' });
    await nextBtnStep4.click();

    // Step 5 – Wait for receiving agent button to appear (client-side transition)
    const addReceivingAgentBtn = page.locator(
      'button:has-text("Select receiving intermediary"), button:has-text("Add receiving intermediary"), button:has-text("Empfangenden Vermittler auswählen"), button:has-text("Add Receiving agent"), button:has-text("Receiving agent"), [data-testid="add-receiving-agent"]'
    ).first();
    await expect(addReceivingAgentBtn).toBeVisible({ timeout: 15_000 });
    await page.screenshot({ path: 'screenshots/TC-06-05-next-to-receiving.png' });

    // Step 6 – Click "Add Receiving agent" button
    await expect(addReceivingAgentBtn).toBeEnabled();
    await addReceivingAgentBtn.click();
    await page.screenshot({ path: 'screenshots/TC-06-06-add-receiving-agent.png' });

    // Step 7 – Wait for the sidepanel animation to finish, then click "Add" on the first receiving agent
    await page.waitForSelector('nx-sidepanel:not(.ng-animating)', { timeout: 15_000 });
    const addReceivingBtn = page.locator(
      'nx-sidepanel button:has-text("Add"), nx-sidepanel button:has-text("Hinzufügen")'
    ).first();
    await expect(addReceivingBtn).toBeVisible({ timeout: 15_000 });
    await expect(addReceivingBtn).toBeEnabled();
    await addReceivingBtn.click();
    await page.screenshot({ path: 'screenshots/TC-06-07-receiving-agent-selected.png' });

    // Step 8 – Click "Next" to reach the configuration page
    const nextBtnStep8 = page.locator(SELECTORS.nextButton).first();
    await expect(nextBtnStep8).toBeVisible({ timeout: 15_000 });
    await expect(nextBtnStep8).toBeEnabled();
    await nextBtnStep8.click();
    await page.waitForURL(/configuration/, { timeout: 60_000 });
    await page.waitForSelector('nx-expansion-panel-title', { state: 'attached', timeout: 90_000 });
    await page.screenshot({ path: 'screenshots/TC-06-08-configuration-page.png', fullPage: true });

    // Open the expansion panel by clicking its header button
    const expansionPanelHeader = page.locator('nx-expansion-panel-title, button.nx-expansion-panel__header-button').first();
    await expansionPanelHeader.scrollIntoViewIfNeeded();
    await expansionPanelHeader.click();
    await page.screenshot({ path: 'screenshots/TC-06-09-transfers-dropdown-open.png' });

    // Transfer Date – each date field is a single masked textbox (not split year/month/day
    // inputs), identified by its label, with a separate "Open calendar" icon button next to it.
    // The field does NOT auto-insert separators as you type raw digits (confirmed: typing
    // "02102026" left the literal string "02102026" and failed validation with
    // "Please enter a valid date") — the "." separators must be typed explicitly, dd.mm.yyyy.
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const yearStr  = futureDate.getFullYear().toString();
    const monthStr = String(futureDate.getMonth() + 1).padStart(2, '0');
    const dayStr   = String(futureDate.getDate()).padStart(2, '0');

    async function fillNxDatefield(locatorOrPage, label, day, month, year) {
      const input = locatorOrPage.getByRole('textbox', { name: label }).first();
      await expect(input).toBeVisible({ timeout: 15_000 });
      await input.click();
      await input.pressSequentially(`${year}-${month}-${day}`, { delay: 50 });
    }

    // The visible label text for the P&C/Life/Health date fields changes depending on the
    // field's validation state (e.g. "P&C Date" vs "P&C: Date" once untouched fields get
    // sorted into a different group). There's no stable formcontrolname/container element
    // for these in the live DOM (nx-datemask[formcontrolname=...] does not exist — an earlier
    // assumption from stale notes) so match with a regex tolerating either form.
    async function fillNxDatefieldByPrefix(prefix, day, month, year) {
      const pattern = new RegExp(`^${prefix}:?\\s*Date$`, 'i');
      const input = page.getByRole('textbox', { name: pattern }).first();
      await expect(input).toBeVisible({ timeout: 15_000 });
      await input.click();
      await input.pressSequentially(`${year}-${month}-${day}`, { delay: 50 });
    }

    await fillNxDatefield(page, 'Transfer Date', dayStr, monthStr, yearStr);
    await page.screenshot({ path: 'screenshots/TC-06-09-transfer-date.png' });

    // Portfolio Allocation Size – required numeric field (€), previously missed
    const portfolioAllocationSizeInput = page.getByRole('spinbutton', { name: 'Portfolio Allocation Size' }).first();
    await expect(portfolioAllocationSizeInput).toBeVisible({ timeout: 15_000 });
    await portfolioAllocationSizeInput.fill('10000');
    await page.screenshot({ path: 'screenshots/TC-06-09-portfolio-allocation-size.png' });

    // Helper to select an nx-dropdown option via the CDK overlay. Retries the click once —
    // filling other fields on this form can reflow/reorder the grid (invalid fields appear to
    // sort to the top), which can cause a click to land right as the target is moving.
    async function selectNxDropdownOption(dropdown, optionText, screenshotName) {
      await expect(dropdown).toBeVisible({ timeout: 10_000 });
      await dropdown.scrollIntoViewIfNeeded();
      await dropdown.click();
      try {
        await expect(dropdown).toHaveAttribute('aria-expanded', 'true', { timeout: 5_000 });
      } catch {
        await dropdown.click();
        await expect(dropdown).toHaveAttribute('aria-expanded', 'true', { timeout: 10_000 });
      }
      if (screenshotName) await page.screenshot({ path: `screenshots/${screenshotName}` });
      const option = page.getByRole('option', { name: optionText, exact: false }).first();
      await expect(option).toBeVisible({ timeout: 15_000 });
      await option.click();
    }

    // Relevant for pension plan → No
    await selectNxDropdownOption(
      page.locator('nx-dropdown[formcontrolname="pensionPlanRelevant"]').first(),
      'No',
      'TC-06-09-pension-plan-options.png'
    );
    await page.screenshot({ path: 'screenshots/TC-06-09-pension-plan-no.png' });

    // Life: Transfer type → Information
    await selectNxDropdownOption(
      page.locator('nx-dropdown[formcontrolname="lifeTransferTypeIdentifier"]').first(),
      'Information'
    );
    await page.screenshot({ path: 'screenshots/TC-06-09-life-transfer-type.png' });

    // Health: Transfer type → Without pension plan
    await selectNxDropdownOption(
      page.locator('nx-dropdown[formcontrolname="healthTransferTypeIdentifier"]').first(),
      'without pension plan because of pension',
      'TC-06-09-health-transfer-type-options.png'
    );
    await page.screenshot({ path: 'screenshots/TC-06-09-health-transfer-type.png' });

    // Transfer reason → Portfolio switch
    await selectNxDropdownOption(
      page.locator('nx-dropdown[formcontrolname="transferReasonIdentifier"]').first(),
      'Portfolio switch'
    );
    await page.screenshot({ path: 'screenshots/TC-06-09-transfer-reason.png' });

    // Customer data transfer type → second option (selected by index)
    const customerDataDropdown = page.locator(
      'nx-dropdown[formcontrolname="customerDataTransferType"], nx-dropdown[formcontrolname="customerDataTransferTypeIdentifier"]'
    ).first();
    await expect(customerDataDropdown).toBeVisible({ timeout: 10_000 });
    await customerDataDropdown.click();
    await expect(customerDataDropdown).toHaveAttribute('aria-expanded', 'true', { timeout: 10_000 });
    await page.screenshot({ path: 'screenshots/TC-06-09-customer-data-transfer-type-options.png' });
    const customerDataSecondOption = page.getByRole('option').nth(1);
    await expect(customerDataSecondOption).toBeVisible({ timeout: 15_000 });
    await customerDataSecondOption.click();
    await page.screenshot({ path: 'screenshots/TC-06-09-customer-data-transfer-type.png' });

    // P&C date – 30 days in the future
    await fillNxDatefieldByPrefix('P&C', dayStr, monthStr, yearStr);
    await page.screenshot({ path: 'screenshots/TC-06-09-pc-date.png' });

    // Life date – 30 days in the future
    await fillNxDatefieldByPrefix('Life', dayStr, monthStr, yearStr);
    await page.screenshot({ path: 'screenshots/TC-06-09-life-date.png' });

    // Health date – 30 days in the future
    await fillNxDatefieldByPrefix('Health', dayStr, monthStr, yearStr);
    await page.screenshot({ path: 'screenshots/TC-06-09-health-date.png' });

    // Click "Next" to navigate from configuration page to portfolio allocation
    const nextBtnStep9 = page.locator(SELECTORS.nextButton).first();
    await expect(nextBtnStep9).toBeVisible({ timeout: 15_000 });
    await expect(nextBtnStep9).toBeEnabled();
    await nextBtnStep9.click();

    // Step 9 – Portfolio allocation page: wait for the page then click "Next"
    await page.waitForURL(/portfolio-allocation/, { timeout: 30_000 });
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: 'screenshots/TC-06-10-portfolio-allocation.png', fullPage: true });

    const nextBtnStep10 = page.locator(SELECTORS.nextButton).first();
    await expect(nextBtnStep10).toBeVisible({ timeout: 15_000 });
    await expect(nextBtnStep10).toBeEnabled();
    await nextBtnStep10.click();
    await page.screenshot({ path: 'screenshots/TC-06-10-after-next.png', fullPage: true });
  });

  test('TC-07 | New Scenario: select a sending intermediary by partial name match', async ({ page }) => {
    await page.goto('https://smart-dev.allianz.com/portfolio-transfer/dashboard');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator(SELECTORS.appRoot).first()).toBeVisible({ timeout: 30_000 });

    const loadingIndicator = page.locator('[role="status"]').filter({ hasText: 'Loading' }).first();
    if (await loadingIndicator.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await loadingIndicator.waitFor({ state: 'hidden', timeout: 30_000 });
    }

    const newScenarioBtn = page.locator(SELECTORS.newScenarioButton).first();
    await expect(newScenarioBtn).toBeVisible({ timeout: 15_000 });
    await expect(newScenarioBtn).toBeEnabled();
    await newScenarioBtn.click();
    await page.screenshot({ path: 'screenshots/TC-07-01-new-scenario.png' });

    const selectSendingAgentBtn = page.locator(SELECTORS.selectSendingAgentButton).first();
    await expect(selectSendingAgentBtn).toBeVisible({ timeout: 15_000 });
    await expect(selectSendingAgentBtn).toBeEnabled();
    await selectSendingAgentBtn.click();
    await page.waitForSelector('nx-sidepanel:not(.ng-animating)', { timeout: 15_000 });
    await page.screenshot({ path: 'screenshots/TC-07-02-select-sending-agent.png' });

    const agentSearchInput = page.locator('input[placeholder="Search by name (min 3 characters)"]').first();
    await agentSearchInput.waitFor({ state: 'visible', timeout: 15_000 });
    await agentSearchInput.scrollIntoViewIfNeeded();
    await agentSearchInput.click();
    await agentSearchInput.pressSequentially('Julia', { delay: 100 });

    // "Julia" alone can match several intermediaries, so unlike TC-06 (which pins
    // down "Mario Bace" by exact name) this test accepts the first search result.
    const firstResultRow = page.getByRole('listitem').first();
    await expect(firstResultRow).toBeVisible({ timeout: 30_000 });
    const firstResultAddBtn = firstResultRow.getByRole('button', { name: /^Add/ });
    await expect(firstResultAddBtn).toBeVisible({ timeout: 30_000 });
    await firstResultAddBtn.click();
    await page.screenshot({ path: 'screenshots/TC-07-03-intermediary-selected.png' });

    // Sidepanel closes once the intermediary is added
    await page.waitForSelector('nx-sidepanel:not(.ng-animating)', { timeout: 15_000 });
    await page.screenshot({ path: 'screenshots/TC-07-04-sidepanel-closed.png' });
  });

});
