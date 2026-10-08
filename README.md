# SauceDemo Playwright tests

Playwright end-to-end tests for https://www.saucedemo.com/, organized with page
objects and accessible role/name locators. Credentials and checkout data are in
`test-data/`.

## Run

```sh
npm ci
npx playwright install chromium
npm test
```

Use `npm run test:headed` to run with a visible browser. The HTML report can be
opened with `npm run test:report`.
