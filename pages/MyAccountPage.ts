import { expect, Page } from '@playwright/test';

export class MyAccountPage {
  constructor(private readonly page: Page) {}

  get myAccountLink() {
    return this.page.getByRole('link', { name: /my account/i }).first();
  }

  get ordersLink() {
    return this.page.getByRole('link', { name: /^orders$/i }).first();
  }

  get ordersTable() {
    return this.page.getByRole('table');
  }

  orderRowById(orderId: string | undefined) {
    return this.ordersTable.getByRole('row').filter({
      has: this.page.getByRole('link', { name: new RegExp(`View order.*${orderId}`, 'i') })
    });
  }

  async openOrders() {
    await expect(this.myAccountLink).toBeVisible();
    await this.myAccountLink.click();
    await this.page.waitForLoadState('domcontentloaded');

    await expect(this.ordersLink).toBeVisible();
    await this.ordersLink.click();
    await this.page.waitForURL(/orders/);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyOrderInHistory(orderId: string | undefined) {
    await this.openOrders();
    await expect(this.ordersTable).toBeVisible();

    const viewOrderLink = this.orderRowById(orderId)
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
