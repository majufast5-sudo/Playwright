import { expect } from '@playwright/test';

export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.firstName = page.getByRole('textbox', { name: 'First Name' });
    this.lastName = page.getByRole('textbox', { name: 'Last Name' });
    this.postalCode = page.getByRole('textbox', { name: 'Zip/Postal Code' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.completeMessage = page.getByText('Thank you for your order!', { exact: true });
  }

  async fillCustomer(customer) {
    await this.firstName.fill(customer.firstName);
    await this.lastName.fill(customer.lastName);
    await this.postalCode.fill(customer.postalCode);
    await this.continueButton.click();
  }

  async expectOrderTotals(order) {
    await expect(
      this.page.getByText(`Item total: ${order.subtotal}`, { exact: true }),
    ).toBeVisible();
    await expect(
      this.page.getByText(`Tax: ${order.tax}`, { exact: true }),
    ).toBeVisible();
    await expect(
      this.page.getByText(`Total: ${order.total}`, { exact: true }),
    ).toBeVisible();
  }

  async finishOrder() {
    await this.finishButton.click();
    await expect(this.completeMessage).toBeVisible();
  }
}
