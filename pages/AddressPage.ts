import { expect, Page } from '@playwright/test';

export interface BillingAddressData {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  country: string;
  state?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
}

export class AddressPage {
  constructor(private readonly page: Page) {}

  get firstNameInput() {
    return this.page.getByLabel(/first name/i).first();
  }

  get lastNameInput() {
    return this.page.getByLabel(/last name/i).first();
  }

  get streetAddressInput() {
    return this.page.getByLabel(/street address/i).first();
  }

  get cityInput() {
    return this.page.getByLabel(/town \/ city|city/i).first();
  }

  get countrySelect() {
    return this.page.locator('#billing_country');
  }

  get stateSelect() {
    return this.page.locator('#billing_state');
  }

  get postalCodeInput() {
    return this.page.getByLabel(/pin code|postal code/i).first();
  }

  get phoneInput() {
    return this.page.getByLabel(/phone/i).first();
  }

  get emailInput() {
    return this.page.getByLabel(/email address/i).first();
  }

  get saveAddressButton() {
    return this.page.getByRole('button', { name: /save address/i }).first();
  }

  get addressSuccessMessage() {
    return this.page.getByText(/address changed successfully\.?/i);
  }

  async openBillingAddressPage() {
    await this.page.goto('/edit-address');
    await expect(this.page.getByRole('heading', { name: /billing address/i })).toBeVisible();
  }

  async openEditBillingAddress() {
    const editBillingLink = this.page.locator('a, button').filter({ hasText: /edit.*billing.*address/i }).first();
    await expect(editBillingLink).toBeVisible();
    await editBillingLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillAddress(details: BillingAddressData) {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.streetAddressInput.fill(details.street);
    await this.cityInput.fill(details.city);

    if (details.country) {
      await this.countrySelect.selectOption({ label: details.country });
    }

    if (details.state) {
      await this.stateSelect.selectOption({ label: details.state });
    }

    if (details.postalCode) {
      await this.postalCodeInput.fill(details.postalCode);
    }

    if (details.phone) {
      await this.phoneInput.fill(details.phone);
    }

    if (details.email) {
      await this.emailInput.fill(details.email);
    }
  }

  async save() {
    await expect(this.saveAddressButton).toBeEnabled();
    await this.saveAddressButton.click();
    await expect(this.addressSuccessMessage).toBeVisible();
  }

  async verifyAddressVisible(addressText: string) {
    await expect(this.page.getByText(addressText, { exact: true })).toBeVisible();
  }
}
