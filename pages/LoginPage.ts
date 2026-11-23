import { expect, Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  get usernameInput() {
    return this.page.getByRole('textbox', { name: /username|email address/i }).first();
  }

  get passwordInput() {
    return this.page.getByRole('textbox', { name: /password/i }).first();
  }

  get loginButton() {
    return this.page.getByRole('button', { name: /log in/i }).first();
  }

  get logoutLink() {
    return this.page.getByRole('link', { name: /log out/i }).first();
  }

  async open(baseUrl = '/') {
    await this.page.goto(baseUrl);
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await expect(this.logoutLink).toBeVisible();
  }

  async loginAsUser(user: { username: string; password: string }) {
    await this.login(user.username, user.password);
  }
}
