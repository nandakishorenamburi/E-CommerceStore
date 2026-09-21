import { expect, Page } from '@playwright/test';

export class OrderPage {
  constructor(private readonly page: Page) {}

  get orderConfirmationText() {
    return this.page.getByText(/thank you\. your order has/i);
  }

  get orderNumberValue() {
    return this.page.locator('li').filter({ hasText: /order number:/i }).locator('strong');
  }

  get ordersTable() {
    return this.page.getByRole('table');
  }

  getOrderRowById(orderId: string | undefined) {
    return this.ordersTable.getByRole('row').filter({
      has: this.page.getByRole('link', { name: new RegExp(`View order.*${orderId}`, 'i') })
    });
  }

  async verifyOrderReceived() {
    await expect(this.orderConfirmationText).toBeVisible();
    const orderId = await this.orderNumberValue.textContent();
    expect(orderId, 'Order ID could not be read from the confirmation page').toBeTruthy();
    return orderId || undefined;
  }

  async openOrderHistory() {
    const myAccountLink = this.page.getByRole('link', { name: /my account/i }).first();
    await expect(myAccountLink).toBeVisible();
    await myAccountLink.click();
    await this.page.waitForLoadState('domcontentloaded');

    const ordersLink = this.page.getByRole('link', { name: /^orders$/i }).first();
    await expect(ordersLink).toBeVisible();
    await ordersLink.click();
    await this.page.waitForURL(/orders/);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyOrderVisibleInHistory(orderId: string | undefined) {
    await this.openOrderHistory();
    await expect(this.ordersTable).toBeVisible();

    const viewOrderLink = this.getOrderRowById(orderId)
      .getByRole('link', { name: new RegExp(`View order.*${orderId}`, 'i') })
      .first();

    await expect(viewOrderLink).toBeVisible();
    await Promise.all([
      this.page.waitForURL(/view-order/),
      viewOrderLink.click()
    ]);

    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.page.getByRole('heading', { name: new RegExp(`Order #${orderId}`, 'i') })).toBeVisible();
  }
}
