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
    await expect(
      this.page.getByRole('heading', { name: 'My account', level: 1 })
    ).toBeVisible();

    await expect(this.ordersLink).toBeVisible();
    await Promise.all([
      this.page.waitForURL(/orders/, { timeout: 20_000 }),
      this.ordersLink.click()
    ]);
  }

  async verifyOrderInHistory(orderId: string | undefined) {
    await this.openOrders();
    await expect(this.ordersTable).toBeVisible();

    const viewOrderLink = this.orderRowById(orderId)
      .getByRole('link', { name: new RegExp(`View order.*${orderId}`, 'i') })
      .first();

    await expect(viewOrderLink).toBeVisible();
    await Promise.all([
      this.page.waitForURL(/view-order/, { timeout: 20_000 }),
      viewOrderLink.click()
    ]);

    await expect(this.page.getByRole('heading', { name: new RegExp(`Order #${orderId}`, 'i') })).toBeVisible();
  }
}
