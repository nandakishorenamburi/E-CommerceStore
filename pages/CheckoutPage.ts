import { expect, Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  get placeOrderButton() {
    return this.page.getByRole('button', { name: /place order/i }).first();
  }

  get orderConfirmationText() {
    return this.page.getByText(/thank you\. your order has/i);
  }

  get orderNumberValue() {
    return this.page.locator('li').filter({ hasText: /order number:/i }).locator('strong');
  }

  async goToCheckout() {
    const checkoutButton = this.page.getByRole('link', { name: /proceed to checkout/i }).first();
    await expect(checkoutButton).toBeVisible();
    await expect(checkoutButton).toBeEnabled();
    await Promise.all([
      this.page.waitForURL(/checkout|checkout-2/),
      checkoutButton.click()
    ]);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillBillingDetails(details: {
    firstName: string;
    lastName: string;
    country: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    phone?: string;
    email?: string;
  }) {
    await this.page.getByLabel(/first name/i).fill(details.firstName);
    await this.page.getByLabel(/last name/i).fill(details.lastName);
    await this.page.locator('#billing_country').selectOption({ label: details.country });
    await this.page.getByLabel(/street address/i).fill(details.street);
    await this.page.getByLabel(/town \/ city/i).fill(details.city);
    await this.page.locator('#billing_state').selectOption({ label: details.state });
    await this.page.getByLabel(/pin code|postal code/i).fill(details.postalCode);

    if (details.phone) {
      await this.page.getByLabel(/phone/i).fill(details.phone);
    }

    if (details.email) {
      await this.page.getByLabel(/email address/i).fill(details.email);
    }
  }

  async placeOrder() {
    await expect(this.placeOrderButton).toBeVisible();
    await expect(this.placeOrderButton).toBeEnabled();

    await this.placeOrderButton.click();

    await Promise.race([
      this.page.waitForURL(/order-received|checkout-2\/order-pay|checkout\/order-pay/, { timeout: 20000 }),
      expect(this.orderConfirmationText).toBeVisible({ timeout: 20000 })
    ]).catch(() => {
      // Some WooCommerce flows redirect to a payment page instead of the confirmation screen.
      // Treat either URL as successful order creation if the page still contains a valid order id.
    });

    await this.page.waitForLoadState('domcontentloaded');

    const currentUrl = this.page.url();
    const orderIdFromUrl = currentUrl.match(/(?:order-pay|order-received)[\/\-](\d+)|\/(\d+)\//)?.slice(1).find(Boolean);
    const orderId = orderIdFromUrl || await this.orderNumberValue.textContent();

    expect(orderId, 'Order ID could not be read from the confirmation page').toBeTruthy();

    return orderId || undefined;
  }

  async captureOrderConfirmationScreenshot(filePath: string) {
    await this.page.screenshot({
      path: filePath,
      fullPage: true
    });
  }

}
