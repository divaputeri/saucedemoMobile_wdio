import { Given, When, Then } from '@wdio/cucumber-framework';
import LoginPage from '../pages/mobile_login.page.ts'
import AppPage from '../pages/mobile_app.page.ts'
import ProductPage from '../pages/mobile_product.page.ts'

Given(/^I am on the login page$/, async () => {
    if (await LoginPage.cartIcon.isExisting()) return
    await LoginPage.isOnLoginPage()
})

When(/^I login with "(.*)" and "(.*)"$/, async (username, password) => {
    if (password === 'brute_force') {
        await LoginPage.bruteForce(username, password)
        return
    }
    await LoginPage.login(username, password)
})

Then(/^I should see product list$/, async () => {
    await ProductPage.isVisible()
})

Then(/^I should see error message$/, async () => {
    await LoginPage.errorMessage.isExisting()
})

When (/^I close the App$/, async () => {
    await AppPage.closeApp()
})

When (/^I open the App$/, async () => {
    await AppPage.openApp()
})
