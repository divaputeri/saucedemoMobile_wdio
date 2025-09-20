import { Given, When, Then } from '@wdio/cucumber-framework'
import ProductPage from '../pages/mobile_product.page.ts'
import {DataTable} from '@cucumber/cucumber'

Given(/^I am on the product page$/, async () => {
    await ProductPage.isVisible()
})

When(/^I add "(\d+)" product to cart$/, async (countStr: string) => {
    await ProductPage.addNProducts(parseInt(countStr,10))
})

When (/^I remove "(\d+)" product from outside cart$/, async (countStr: string) => {
    await ProductPage.removeNProductsFromTop(parseInt(countStr,10))
})

When (/^I remove "(\d+)" product from inside cart$/, async (countStr: string) => {
    await ProductPage.RemoveNProductsInsideCart(parseInt(countStr,10))
})

Then (/^I should (not )?see product in cart$/, async (neg?: string) => {
    await ProductPage.goToCart()
    if (neg) {
        await ProductPage.waitCartEmpty()
    }else{
        await ProductPage.waitCartHasItems()
}})

Then(/^the cart icon should show "(\d+)" item$/, async (itemCount: string ) => {
    const expected = parseInt(itemCount,10)
    if (expected === 0) {
        await expect(ProductPage.cartBadge).not.toBeExisting()
        return
    } else {
    const actual = parseInt(await ProductPage.cartItemCount(),10)
    await expect(actual).toEqual(expected)}
})

Then(/^I verify products sequentially:$/, async (table: DataTable) => {
  const rows = table.hashes() // [{ name }, ...]
  for (const { name } of rows) {
    await ProductPage.openProductByName(name)
    await ProductPage.assertDetailName(name)   // <— pakai helper baru
    await ProductPage.backToProducts()
    await driver.pause(100)
  }
})

When(/^I switch to list view$/, async () => {
  await ProductPage.switchToListView()
})

When(/^I switch to grid view$/, async () => {
  await ProductPage.switchToGridView()
})

Then(/^products should be displayed in list layout$/, async () => {
  expect(await ProductPage.isListView()).toBe(true)
})

Then(/^products should be displayed in grid layout$/, async () => {
  expect(await ProductPage.isGridView()).toBe(true)
})

When(/^I sort products by "([^"]+)"$/, async (criteria: string) => {
  await ProductPage.chooseSortOption(criteria)
})

Then(/^products should be sorted "([^"]+)"$/, async (type: string) => {
  switch (type) {
    case "nameAsc": {
      const names = await ProductPage.getAllProductNames()
      const sorted = [...names].sort()
      await expect(names).toEqual(sorted)
      break
    }
    case "nameDesc": {
      const names = await ProductPage.getAllProductNames()
      const sorted = [...names].sort().reverse()
      await expect(names).toEqual(sorted)
      break
    }
    case "priceAsc": {
      const prices = await ProductPage.getAllProductPrices()
      const sorted = [...prices].sort((a, b) => a - b)
      await expect(prices).toEqual(sorted)
      break
    }
    case "priceDesc": {
      const prices = await ProductPage.getAllProductPrices()
      const sorted = [...prices].sort((a, b) => b - a)
      await expect(prices).toEqual(sorted)
      break
    }
    default:
      throw new Error(`Unknown sort type: ${type}`)
  }
})