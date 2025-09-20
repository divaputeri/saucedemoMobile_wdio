import { When, Then } from '@wdio/cucumber-framework'
import CheckoutPage from '../pages/mobile_checkout.page'
import ProductPage from '../pages/mobile_product.page'

When(/^I go to cart$/, async () => {
  await ProductPage.goToCart()
})
When(/^I tap continue shopping$/, async () => {
  await CheckoutPage.continueShoppingBtn.click()
})

When('I proceed to checkout', async () => {
  await ProductPage.goToCart()
  await CheckoutPage.proceedToCheckout()
})

Then('I test checkout errors sequentially:', async (table) => {
  for (const row of table.hashes()) {
    const { first, last, zip, error } = row

    await CheckoutPage.firstName.clearValue()
    await CheckoutPage.lastName.clearValue()
    await CheckoutPage.postalCode.clearValue()

    await CheckoutPage.fillCheckoutInfo(first, last, zip)
    await CheckoutPage.continueBtn.click()

    await CheckoutPage.errorMsg.waitForDisplayed({ timeout: 2000 })
    await expect(CheckoutPage.errorMsg).toHaveText(error)
  }
})

When(/^I enter checkout info "([^"]*)" "([^"]*)" "([^"]*)"$/, 
  async (first: string, last: string, zip: string) => {
    await CheckoutPage.fillCheckoutInfo(first, last, zip)
})

When('I continue checkout', async () => {
  await CheckoutPage.continueBtn.click()
})

When('I finish checkout', async () => {
  await CheckoutPage.finishCheckout()
})

Then('I should see the thank you page', async () => {
  await expect(CheckoutPage.thankYouTitle).toBeDisplayed()
  const title = await CheckoutPage.thankYouTitle.getText()
  expect(title).toContain('THANK YOU')
  await expect(CheckoutPage.thankYouMsg).toBeDisplayed()
})

When('I tap cancel', async () => {
  await driver.pause(1000)
  await CheckoutPage.tapCancel()
})
