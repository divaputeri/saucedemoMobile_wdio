import { $ } from '@wdio/globals'
import AppPage from './mobile_app.page'

class CheckoutPage {
  get checkoutBtn() { return $('~test-CHECKOUT') }
  get continueShoppingBtn() { return $('~test-CONTINUE SHOPPING') }
  get firstName() { return $('~test-First Name') }
  get lastName() { return $('~test-Last Name') }
  get postalCode() { return $('~test-Zip/Postal Code') }
  get continueBtn() { return $('~test-CONTINUE') }
  get errorMsg() {return $('//android.view.ViewGroup[@content-desc="test-Error message"]/android.widget.TextView')}
  get checkoutOverview() { return $('~test-CHECKOUT: OVERVIEW') }
  get finishBtn() { return $('~test-FINISH') }
  get thankYouTitle() { return $('//android.widget.TextView[@text="THANK YOU FOR YOU ORDER"]') }
  get thankYouMsg() { return $('//android.widget.TextView[contains(@text,"Your order has been dispatched")]') }
  get cancelBtn() { return $('~test-CANCEL') } 

  async fillCheckoutInfo(first: string, last: string, zip: string) {
    if (first) await this.firstName.setValue(first)
    if (last) await this.lastName.setValue(last)
    if (zip) await this.postalCode.setValue(zip)
  }

async proceedToCheckout() {
    await AppPage.scrollUntilVisible(this.checkoutBtn, 10)
    await this.checkoutBtn.click()
  }

async finishCheckout() {
  await this.checkoutOverview.waitForDisplayed({ timeout: 5000 })
  const found = await AppPage.scrollUntilVisible(this.finishBtn, 8)
  if (!found) {
    throw new Error('Finish button not visible after scrolling')
  }
  await this.finishBtn.click()
}

async tapCancel() {
  const found = await AppPage.scrollUntilVisible(this.cancelBtn, 8)
  if (!found) {
    throw new Error('Cancel button not visible after scrolling')
  }
  await this.cancelBtn.click()
}
}

export default new CheckoutPage()
