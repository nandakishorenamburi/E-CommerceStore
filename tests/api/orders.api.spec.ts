import { test, expect } from '@playwright/test';
import { createWooCommerceContext } from '../../helpers/api_helper';

test.describe('Orders API — contract validation @api @orders', () => {
  test.skip(
    'GET /orders returns authenticated user orders @api @orders',
    async () => {}
  );

  test.skip(
    'POST /orders creates order with correct line items @api @orders',
    async () => {}
  );

  test('GET orders returns a valid list', async () => {
    const apiContext = await createWooCommerceContext();

    try {
      const response = await apiContext.get('/wp-json/wc/v3/orders');
      console.log(response.status());
      expect(response.status()).toBe(200);
      console.log(await response.text());

      const orders = await response.json();
      console.log('Orders:', orders);
      expect(Array.isArray(orders)).toBe(true);
      expect(orders.length).toBeGreaterThan(0);
      const FirstOrder = orders[0];
      expect(FirstOrder).toHaveProperty('id');
      expect(FirstOrder).toHaveProperty('status');
      expect(FirstOrder).toHaveProperty('total');
    } finally {
      await apiContext.dispose();
    }
  });
});
