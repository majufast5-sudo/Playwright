import { expect, test } from '@playwright/test';
import checkoutData from '../test-data/checkout.json' with { type: 'json' };
import users from '../test-data/users.json' with { type: 'json' };
import { CartPage } from '../pages/cart-page.js';
import { CheckoutPage } from '../pages/checkout-page.js';
import { InventoryPage } from '../pages/inventory-page.js';
import { LoginPage } from '../pages/login-page.js';

test('standard user can log in and view products', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login(users.standard);
  await inventoryPage.expectLoaded();
});

test('locked out user receives a login error', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(users.lockedOut);
  await loginPage.expectLoginError(
    'Sorry, this user has been locked out.',
  );
});

test('user can add and remove a product from the cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await loginPage.goto();
  await loginPage.login(users.standard);
  await inventoryPage.expectLoaded();
  await inventoryPage.addProduct(checkoutData.product.name);
  await expect(inventoryPage.cartButton).toHaveAccessibleName('Cart, 1 items');

  await inventoryPage.openCart();
  await cartPage.expectProduct(checkoutData.product.name, checkoutData.product.price);
  await page.getByRole('button', { name: 'Remove' }).click();
  await cartPage.expectProductAbsent(checkoutData.product.name);
});

test('user can sort products by price from low to high', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login(users.standard);
  await inventoryPage.expectLoaded();
  await inventoryPage.sortBy('lohi');

  const prices = await page.locator('.inventory_item_price').allTextContents();
  const numericPrices = prices.map((price) => Number(price.replace('$', '')));
  expect(numericPrices).toEqual([...numericPrices].sort((a, b) => a - b));
});

test('user can complete checkout and see the order confirmation', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.goto();
  await loginPage.login(users.standard);
  await inventoryPage.expectLoaded();
  await inventoryPage.addProduct(checkoutData.product.name);
  await inventoryPage.openCart();
  await cartPage.expectProduct(checkoutData.product.name, checkoutData.product.price);
  await cartPage.checkout();

  await checkoutPage.fillCustomer(checkoutData.customer);
  await checkoutPage.expectOrderTotals(checkoutData.order);
  await checkoutPage.finishOrder();
});
