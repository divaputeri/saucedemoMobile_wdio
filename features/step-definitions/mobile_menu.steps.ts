import { When, Then } from '@wdio/cucumber-framework';
import MenuPage from '../pages/mobile_menu.page.ts'

When('I tap menu', async () => {
  await MenuPage.openMenu()
})

When('I tap drawing', async () => {
  await MenuPage.tapDrawing()
})

When('I draw on the canvas', async () => {
  await MenuPage.drawOnCanvas()
})

When('I save the drawing', async () => {
  await MenuPage.saveDrawing()
})

Then('I should see the drawing saved confirmation', async () => {
  await MenuPage.confirmSave()
})

When('I tap logout', async () => {
    await MenuPage.tapLogout()
})

When('I tap about', async () => {
    await MenuPage.tapAbout()
})

Then ('I should see the about page', async () => {
      await driver.pause(2000)
  const pageSource = await driver.getPageSource()
  expect(pageSource).toContain('Sauce Labs')
})