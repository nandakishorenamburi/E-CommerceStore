import { expect, test } from '../../fixtures/baseFixtures';
import { createWooCommerceContext } from '../../helpers/api_helper';
import { ProductPage } from '../../pages/ProductPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Checkout — UI purchase with API verification @checkout @journey', () => {
  test('customer places order and backend order is verified @regression @critical @journey', async ({ loggedInPage: page }) => {
    const billingEmail = `checkout-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
    const shopPage = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);

    await test.step('Open DemoShop and search for a valid product', async () => {
      await shopPage.openDemoShop();
      await shopPage.searchByKeyword('organic');
      await shopPage.filterByMaxPrice('$25');
    });

    await test.step('Add item to cart and proceed to checkout', async () => {
      await shopPage.addFirstProductToCart();
      await checkoutPage.goToCheckout();
    });

    await test.step('Fill billing details and place the order', async () => {
      await checkoutPage.fillBillingDetails({
        firstName: 'Test',
        lastName: 'Customer',
        country: 'India',
        street: '123 Test Street',
        city: 'Gurugram',
        state: 'Haryana',
        postalCode: '122001',
        phone: '9876543210',
        email: billingEmail
      });

      const orderIdFromPage = await checkoutPage.placeOrder();
      expect(orderIdFromPage, 'Order ID should be captured from the checkout flow').toBeTruthy();
      test.info().annotations.push({ type: 'Order ID', description: String(orderIdFromPage) });
      test.info().annotations.push({ type: 'Billing email', description: billingEmail });
    });

    await test.step('Verify the created order in WooCommerce API', async () => {
      const apiContext = await createWooCommerceContext();

      try {
        const currentUrl = page.url();
        const orderIdMatch = currentUrl.match(/(?:order-pay|order-received)[/-](\d+)|(?:\/)(\d+)(?:\/)?$/);
        const orderId = orderIdMatch?.[1] || orderIdMatch?.[2];

        expect(orderId, 'Order ID missing from the post-checkout URL').toBeTruthy();

        const response = await apiContext.get(`/wp-json/wc/v3/orders/${orderId}`);
        expect(response.status()).toBe(200);

        const order = await response.json();
        expect(order).toHaveProperty('id', Number(orderId));
        expect(order).toHaveProperty('billing');
        expect(order.billing.email).toBe(billingEmail);
        expect(['processing', 'completed']).toContain(order.status);
      } finally {
        await apiContext.dispose();
      }
    });
  });
});