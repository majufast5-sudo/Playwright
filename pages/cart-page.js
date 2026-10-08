import { expect } from '@playwright/test';

export class CartPage {
  constructor(page) {
    this.page = page;
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
  }

  async expectProduct(name, price) {
    await expect(
      this.page.getByRole('button', { name: `View details for ${name}` }),
    ).toBeVisible();
    await expect(this.page.getByText(price, { exact: true })).toBeVisible();
  }

  async expectProductAbsent(name) {
    await expect(
      this.page.getByRole('button', { name: `View details for ${name}` }),
    ).toHaveCount(0);
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
