import { test } from '../../fixtures/baseFixtures';
import searchData from '../../data/search.json';
import { ProductPage } from '../../pages/ProductPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { OrderPage } from '../../pages/OrderPage';

// ======================================================
// Checkout Journey — Registered User Purchase Flow
// ======================================================

test.describe('Checkout — registered user purchase journey @checkout @journey', () => {
  searchData.forEach((search) => {
    test(
      `registered user searches for ${search.keyword} and ${search.maxPrice} filters purchases product and verifies order @smoke @regression @critical`,
      async ({ loggedInPage: page }) => {
        test.info().annotations.push({ type: 'Search keyword', description: search.keyword });
        test.info().annotations.push({ type: 'Max price', description: search.maxPrice });
        test.info().annotations.push({ type: 'Environment', description: 'staging' });

        let orderId: string | undefined;

        const billingEmail = `checkout-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

        const shopPage = new ProductPage(page);
        const checkoutPage = new CheckoutPage(page);
        const orderPage = new OrderPage(page);

        // ── Step 1: Open DemoShop ─────────────
        await test.step('Open DemoShop page', async () => {
          await shopPage.openDemoShop();
        });

        // ── Step 2: Search ────────────────────
        await test.step('Search for product', async () => {
          await shopPage.searchByKeyword(search.keyword);
        });

        // ── Step 3: Price filter ──────────────
        await test.step('Apply maximum price filter', async () => {
          await shopPage.filterByMaxPrice(search.maxPrice);
        });

        // ── Step 4: Add to cart ───────────────
        await test.step('Add filtered product to cart', async () => {
          await shopPage.addFirstProductToCart();
        });

        // ──────────────────────────────────────────
        // Step 5 — Checkout and place order
        // ──────────────────────────────────────────
        await test.step('Checkout and place order', async () => {
          await checkoutPage.goToCheckout();
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
          orderId = await checkoutPage.placeOrder();
          await test.info().annotations.push({ type: 'Order ID', description: String(orderId ?? '') });
          await test.info().annotations.push({ type: 'Billing email', description: billingEmail });
          await test.info().attach('Order ID', { body: String(orderId ?? ''), contentType: 'text/plain' });
          await test.info().attach('Billing email', { body: billingEmail, contentType: 'text/plain' });
        });

        // ──────────────────────────────────────────
        // Step 6 — Verify order in order history
        // ──────────────────────────────────────────
        await test.step('Verify order is available in order history', async () => {
          await orderPage.verifyOrderVisibleInHistory(orderId);
        });
      }
    );
  });
});