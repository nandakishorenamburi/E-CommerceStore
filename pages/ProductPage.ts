import { expect, Page } from '@playwright/test';

export class ProductPage {
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

  async openDemoShop() {
    await this.page.goto('/demoshop');
    await expect(this.page.getByRole('heading', { name: /demoshop/i })).toBeVisible();
    await this.productCards.first().waitFor({ state: 'visible' });
  }

  async searchByKeyword(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
    await expect(
      this.page.getByRole('heading', { name: new RegExp(`Search results:.*${keyword}`, 'i') })
    ).toBeVisible();
  }

  async filterByMaxPrice(maxPrice: string) {
    const maxPriceNum = Number(maxPrice.replace('$', ''));
    await this.maxPriceInput.fill(maxPrice);
    await this.page.getByText(`Up to $${maxPriceNum}`).waitFor({ state: 'visible' });
  }

  async verifyAllVisibleProductsContain(keyword: string) {
    const count = await this.productCards.count();

    for (let i = 0; i < count; i++) {
      const title = await this.productCards.nth(i).getByRole('heading').textContent();
      expect(title?.toLowerCase()).toContain(keyword.toLowerCase());
    }
  }

  async verifyAllVisibleProductsUnder(maxPrice: string) {
    const maxPriceNum = Number(maxPrice.replace('$', ''));
    const count = await this.productCards.count();

    for (let i = 0; i < count; i++) {
      const priceText = await this.productCards.nth(i).locator('.price').textContent();
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
