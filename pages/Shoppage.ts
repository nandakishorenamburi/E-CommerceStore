import { expect, Page } from '@playwright/test';

export class ShopPage {
  constructor(private readonly page: Page) {}

  get cartLink() {
    return this.page.getByRole('link', { name: /view shopping cart/i }).first();
  }

  get emptyCartMessage() {
    return this.page.getByText(/your cart is currently empty/i);
  }

  async openCart() {
    await this.cartLink.waitFor({ state: 'visible' });
    await Promise.all([
      this.page.waitForURL(/mycart/),
      this.cartLink.click()
    ]);
  }

  async verifyProductInCart(productName: string) {
    await expect(this.page.getByText(productName, { exact: true })).toBeVisible();
  }

  async verifyCartIsNotEmpty() {
    await expect(this.emptyCartMessage).not.toBeVisible();
  }
}
