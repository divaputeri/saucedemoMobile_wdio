    import { $,$$,expect } from '@wdio/globals'
    import AppPage from './mobile_app.page.ts'

    class ProductPage {
        get productTitle() { return $('//android.widget.TextView[@text="PRODUCTS"]') }
        get cartIcon() { return $('~test-Cart') }  
        get cartBadge() { return $('//android.view.ViewGroup[@content-desc="test-Cart"]//android.widget.TextView') }
        get cartTitle() { return $('//android.widget.TextView[@text="YOUR CART"]') }
        get productInCart() { return $('(//*[@content-desc="test-REMOVE"]/ancestor::*[@content-desc="test-Item"])[1]') }
        get detailPrice() { return $('~test-Price') }
        get detailDescription() { return $('~test-Description') }
        get backToProductsBtn() { return $('~test-BACK TO PRODUCTS') }
        get toggleBtn() { return $('~test-Toggle') }
        get sortButton() {return $('~test-Modal Selector Button')}
        get sortOptions() {return $$('//*[@content-desc="test-Modal Selector List"]/*')}

        async isVisible() {await expect(this.productTitle).toBeExisting()}
        async cartItemCount() {return await this.cartBadge.getText()}   
        async goToCart() {await this.cartIcon.click()}  

        async getAddToCartButton(){ return await $$('~test-ADD TO CART') }
        async getRemoveButton(){ return await $$('~test-REMOVE') }

        async getCartRemoveButtons(){
          const scoped = await $$('//*[@content-desc="test-Cart Content"]//*[@content-desc="test-REMOVE"]')
          if (await scoped.length > 0) return scoped
          return await $$( '~test-REMOVE' )
        } 

        async addNProducts(n: number) {
            let added = 0
            while (added < n) {
            const btns = await this.getAddToCartButton()
            for (const b of btns) {
                if (added >= n) break
                await b.click()
                added++
                await driver.pause(60)
            }
            if (added < n) {
                const moved = await AppPage.scrollForwardOnce()
                if (!moved) break
            }
            }
        }

        async removeNProductsFromTop(n: number) {
            let removed = 0
            await AppPage.scrollToTop()
            while (removed < n) {
            const btns = await this.getRemoveButton()
            for (const b of btns) {
                if (removed >= n) break
                await b.click()
                removed++
                await driver.pause(60)
            }
            if (removed < n) {
                const moved = await AppPage.scrollForwardOnce()
                if (!moved) break
            }
            }
        }


        async getVisibleCartRemoveButtons(): Promise<WebdriverIO.Element[]> {
          const btns = await this.getCartRemoveButtons()
          const vis: WebdriverIO.Element[] = []
          for (const b of btns) {
            if (await b.isDisplayed()) vis.push(b)
          }
          return vis
        }

        async getRemoveButtonsCount(): Promise<number> {
          const btns = await this.getCartRemoveButtons()
          return btns.length
        }

        async waitCartPageLoaded(timeout = 4000) {
          await this.cartTitle.waitForExist({ timeout })
        }

        async RemoveNProductsInsideCart(n: number) {
          await this.goToCart()
          await this.waitCartPageLoaded()

          let removed = 0
          let guard = 0
          const MAX_GUARD = n * 5

          while (removed < n && guard < MAX_GUARD) {
            guard++

            const visibleRemoves = await this.getVisibleCartRemoveButtons()
            if (visibleRemoves.length === 0) {
              const total = await this.getRemoveButtonsCount()
              if (total === 0) break 
              await driver.pause(200)
              continue
            }

            for (const btn of visibleRemoves) {
              if (removed >= n) break
              try {
                await btn.click()
              } catch {
                const id = (btn as any).elementId
                await driver.execute('mobile: clickGesture', { elementId: id })
              }
              removed++
              await driver.pause(120)
            }
          }
          return removed
        }

        async isCartEmpty(): Promise<boolean> {
          const count = await this.getRemoveButtonsCount()
          return count === 0
        }

        async waitCartEmpty(timeout = 1000): Promise<void> {
          await driver.waitUntil(
            async () => (await this.getRemoveButtonsCount()) === 0,
            { timeout, timeoutMsg: 'Cart still has items (REMOVE still present)' }
          )
          await expect(this.cartBadge).not.toBeExisting()
        }

        async waitCartHasItems(timeout = 1000): Promise<void> {
          await driver.waitUntil(
            async () => (await this.getRemoveButtonsCount()) > 0,
            { timeout, timeoutMsg: 'Cart looks empty (no REMOVE found)' }
          )
        }

        private async findDetailTitleByName(name: string) {
          const acc = await $('~test-Product title')
          if (await acc.isExisting()) return acc
          return $(`//android.widget.TextView[@text="${name}"]`)
        }

        async assertDetailName(name: string) {
          const el = await this.findDetailTitleByName(name)
          await expect(el).toBeExisting()
          await expect(el).toHaveText(name)
        }

        async openProductByName(name: string) {
          const titleSel = `//*[@content-desc="test-Item"]//*[@content-desc="test-Item title" and @text="${name}"] | //*[@text="${name}"]`
          for (let i = 0; i < 50; i++) {
            const el = await $(titleSel)
            if (await el.isExisting()) {
              await el.click()
              return
            }
            const moved = await AppPage.scrollForwardOnce()
            if (!moved) break
            await driver.pause(80)
          }
          throw new Error(`Product "${name}" not found`)
        }

        async backToProducts() { await this.backToProductsBtn.click() }

        async expectDescriptionContains(snippet: string) {
          for (let i = 0; i < 12; i++) {
            if (await this.detailDescription.isDisplayed()) break
            const moved = await AppPage.scrollForwardOnce()
            if (!moved) break
            await driver.pause(80)
          }
          const text = await this.detailDescription.getText()
          if (!text.includes(snippet)) {
            throw new Error(`Description not containing snippet.\nExpected contains: "${snippet}"\nActual: "${text}"`)
          }
        }

        async switchToGridView() {
          const btn = await this.toggleBtn
          await btn.click()
          await driver.pause(500)
        }

        async switchToListView() {
          const btn = await this.toggleBtn
          await btn.click()
          await driver.pause(500)
        }

        async getItemDescriptions(): Promise<WebdriverIO.Element[]> {
          return (await $$('~test-Item description')) as unknown as WebdriverIO.Element[]
        }

        async getItemDescriptionsCount(): Promise<number> {
          const descs = await this.getItemDescriptions()
          return descs.length
        }

        async isListView(): Promise<boolean> {
          const count = await this.getItemDescriptionsCount()
          return count > 0
        }

        async isGridView(): Promise<boolean> {
          const count = await this.getItemDescriptionsCount()
          return count === 0
        }

        async openSortMenu() {
          await this.sortButton.click()
        }

        async chooseSortOption(option: string) {
          await this.openSortMenu()
          const opt = await $(`//*[@text="${option}"]`)
          await opt.click()
        }

        async getAllProductNames(): Promise<string[]> {
          const titles = await $$('~test-Item title')
          const names: string[] = []
          for (const t of titles) {
            names.push(await t.getText())
          }
          return names
        }

        async getAllProductPrices(): Promise<number[]> {
          const prices = await $$('~test-Price')
          const values: number[] = []
          for (const p of prices) {
            const txt = await p.getText()
            values.push(parseFloat(txt.replace('$', '')))
          }
          return values
        }

 }     

export default new ProductPage()