import { expect, Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  get checkoutButton() {
    return this.page.getByRole('link', { name: /proceed to checkout/i }).first();
  }

  async verifyProduct(productName: string) {
    await expect(this.page.getByText(productName, { exact: true })).toBeVisible();
  }

  async proceedToCheckout() {
    await expect(this.checkoutButton).toBeVisible();
    await expect(this.checkoutButton).toBeEnabled();
    await Promise.all([
      this.page.waitForURL(/checkout|checkout-2/),
      this.checkoutButton.click()
    ]);
  }
}
