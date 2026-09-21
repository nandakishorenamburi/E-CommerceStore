import { expect, Page } from '@playwright/test';
import { SearchData } from '../utils/types';

export class DemoShopPage {
  constructor(private readonly page: Page) {}

  get productCards() {
    return this.page.locator('ul.products li');
  }

  get searchInput() {
    return this.page.getByRole('searchbox', { name: /search/i }).first();
  }

  get searchButton() {
    return this.page.getByRole('button', { name: /^search$/i }).first();
  }

  get maxPriceInput() {
    return this.page.getByRole('textbox', { name: /filter products by maximum/i }).first();
  }

  get cartLink() {
    return this.page.getByRole('link', { name: /view shopping cart/i }).first();
  }

  async open() {
    await this.page.goto('/demoshop');
    await expect(this.page.getByRole('heading', { name: /demoshop/i })).toBeVisible();
    await this.productCards.first().waitFor({ state: 'visible' });
  }

  async searchAndFilter(search: SearchData) {
    await this.searchInput.fill(search.keyword);
    await this.searchButton.click();

    await expect(
      this.page.getByRole('heading', { name: new RegExp(`Search results:.*${search.keyword}`, 'i') })
    ).toBeVisible();

    const products = this.productCards;
    const count = await products.count();

    for (let i = 0; i < count; i++) {
      const title = await products.nth(i).getByRole('heading').textContent();
      expect(title?.toLowerCase()).toContain(search.keyword.toLowerCase());
    }

    const maxPriceNum = Number(search.maxPrice.replace('$', ''));
    await this.maxPriceInput.fill(search.maxPrice);
    await this.page.getByText(`Up to $${maxPriceNum}`).waitFor({ state: 'visible' });

    const filteredProducts = this.productCards;
    const filteredCount = await filteredProducts.count();

    for (let i = 0; i < filteredCount; i++) {
      const priceText = await filteredProducts.nth(i).locator('.price').textContent();
      const price = Number(priceText?.replace(/[^0-9.]/g, ''));
      expect(price).toBeLessThanOrEqual(maxPriceNum);
    }
  }

  async addFirstProductToCart() {
    const firstProduct = this.productCards.first();
    await firstProduct.waitFor({ state: 'visible' });

    const productName = await firstProduct.getByRole('heading').textContent();
    expect(productName).toBeTruthy();

    const addToCartButton = firstProduct.getByRole('button', { name: /add to cart/i });
    await addToCartButton.click();
    await expect(addToCartButton).toHaveClass(/added/);

    await expect(this.cartLink).toBeVisible();
    await Promise.all([
      this.page.waitForURL(/mycart/),
      this.cartLink.click()
    ]);

    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.page.getByText(productName!, { exact: true })).toBeVisible();

    return productName!;
  }
}
