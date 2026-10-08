import { expect } from '@playwright/test';

export class InventoryPage {
  constructor(page) {
    this.page = page;
    this.productsTitle = page.getByText('Products', { exact: true });
    this.sortControl = page.getByRole('combobox', { name: 'Sort products' });
    this.cartButton = page.getByRole('button', { name: /Cart/ });
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.productsTitle).toBeVisible();
  }

  async addProduct(name) {
    const productCard = this.page.locator('.inventory_item').filter({
      has: this.page.getByRole('button', { name: `View details for ${name}` }),
    });
    await productCard.getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeProduct(name) {
    const productCard = this.page.locator('.inventory_item').filter({
      has: this.page.getByRole('button', { name: `View details for ${name}` }),
    });
    await productCard.getByRole('button', { name: 'Remove' }).click();
  }

  async sortBy(value) {
    await this.sortControl.selectOption(value);
  }

  async openCart() {
    await this.cartButton.click();
  }
}
