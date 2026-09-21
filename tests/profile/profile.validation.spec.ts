import { test, expect } from '../../fixtures/baseFixtures';
import addresses from '../../data/addresses.json'

// const billingAddress = addresses[0];

// import { readExcel } from '../../utils/excel-reader';
// import { AddessData } from '../../utils/types';

// const addresses=readExcel<AddessData>('addresses.xlsx')
// ============================================================
// Billing Address Update Test
// ============================================================
test.describe.skip('Profile Management  @profile', () => {
  addresses.forEach((billingAddress)=>{
  test(
    `registered user for ${billingAddress.firstName} in ${billingAddress.city} successfully updates billing address @regression`,
    async ({ loggedInPage:page }) => {

      // --------------------------------------------------------
      // Step 1 - Navigate to Billing Address Page
      // --------------------------------------------------------

      await test.step('Navigate to Billing Address page', async () => {

        await page.goto('/customer');

        const billingAddressLink = page.getByRole('link', {
          name: /billing address/i
        }).first();

        await expect(billingAddressLink).toBeVisible();
        await billingAddressLink.click();
        await page.waitForLoadState('domcontentloaded');

        await expect(
          page.getByRole('heading', {
            name: /billing address/i
          })
        ).toBeVisible();

      });

      // --------------------------------------------------------
      // Step 2 - Open Billing Address Form
      // --------------------------------------------------------

      await test.step('Open Billing Address form', async () => {
        const editLink = page.locator('a, button').filter({ hasText: /(?:add|edit).*billing.*address/i }).first();

        await expect(editLink).toBeVisible();

        await Promise.all([
          page.waitForURL(/customer|billing|address/i),
          editLink.click()
        ]);

        await page.waitForLoadState('domcontentloaded');

        await expect(
          page.getByRole('heading', {
            name: /billing address/i
          })
        ).toBeVisible();

      });

      // --------------------------------------------------------
      // Step 3 - Update Billing Address
      // --------------------------------------------------------

      await test.step('Update billing address details', async () => {

        await page
          .getByLabel('First name')
          .fill(billingAddress.firstName);

        await page
          .getByLabel('Last name')
          .fill(billingAddress.lastName);

        await page
          .getByLabel('Street address')
          .fill(billingAddress.street);

        await page
          .getByLabel('Town / City')
          .fill(billingAddress.city);

        // await page
        //   .locator('#billing_country')
        //   .selectOption({
        //     value: billingAddress.country
        //   });

        // Verify entered values before saving

        await expect(
          page.getByLabel('First name')
        ).toHaveValue(
          billingAddress.firstName
        );

        await expect(
          page.getByLabel('Last name')
        ).toHaveValue(
          billingAddress.lastName
        );

        await expect(
          page.getByLabel('Town / City')
        ).toHaveValue(
          billingAddress.city
        );

      });

      // --------------------------------------------------------
      // Step 4 - Save Billing Address
      // --------------------------------------------------------

      await test.step('Save updated billing address', async () => {

        const saveButton = page
          .locator('button, input[type="submit"]')
          .filter({ hasText: /save.*address/i })
          .first();

        await expect(saveButton).toBeEnabled();

        await saveButton.click();

        await expect(
          page.getByText(/address changed successfully\.?/i)
        ).toBeVisible();

      });

      // --------------------------------------------------------
      // Step 5 - Verify Saved Address
      // --------------------------------------------------------

      await test.step('Verify updated billing address is displayed', async () => {

        const billingSection = page.locator(
          '[class*="woocommerce-Address"]'
        );

        const addressBlock =
          billingSection.locator('address');

        await expect(addressBlock)
          .toContainText(
            billingAddress.firstName
          );

        await expect(addressBlock)
          .toContainText(
            billingAddress.lastName
          );

        await expect(addressBlock)
          .toContainText(
            billingAddress.street
          );

        await expect(addressBlock)
          .toContainText(
            billingAddress.city
          );

      });

      
    }
  )
}
  )

}
)