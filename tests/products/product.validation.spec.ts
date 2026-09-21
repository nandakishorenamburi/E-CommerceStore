// import { test, expect } from '@playwright/test';
import { test, expect } from '../../fixtures/baseFixtures';
import products from '../../data/product.json';

// ─────────────────────────────────────────────
// Product Test Data
// ─────────────────────────────────────────────
const product = products[0];

// ─────────────────────────────────────────────
// Test: View Product Details in New Tab
// ─────────────────────────────────────────────
test.describe('Products — product detail new tab @products', () => {
  test('registered user views product details in new tab @regression', async ({ loggedInPage: page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'product', description: JSON.stringify({
        name: product.name,
        category: product.category,
        expectedUrl: product.expectedUrl,
        priority: product.priority,
        tags: product.tags,
      }) },
      { type: 'priority', description: product.priority },
      { type: 'category', description: product.category }
    );

    // Step 1: Navigate to DemoShop page
    await test.step('Navigate to DemoShop', async () => {
      await page.goto('/demoshop');
      await expect(page).toHaveURL(/shop/);
    });

    // Step 2: Open product in a new tab and validate details
    await test.step('Open product details and validate', async () => {
      const productLink = page
        .getByRole('link', { name: product.name })
        .first();

      await expect(productLink).toHaveAttribute('target', '_blank');

      const [productTab] = await Promise.all([
        page.context().waitForEvent('page'),
        productLink.click(),
      ]);

      await productTab.waitForLoadState();

      await expect(
        productTab.getByRole('heading', {
          name: product.name,
        })
      ).toBeVisible();

      await expect(productTab).toHaveURL(new RegExp(product.expectedUrl));
      await productTab.close();
    });
  });
});