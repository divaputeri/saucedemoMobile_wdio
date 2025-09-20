
// import type { ChainablePromiseElement } from 'webdriverio'

class AppPage {
    public appPackage= "com.swaglabsmobileapp"
    public appActivity= "com.swaglabsmobileapp.MainActivity"
    
    async closeApp() {await driver.terminateApp(this.appPackage)}
    async openApp() {await driver.activateApp(this.appPackage)}


    async swipe(direction: 'up' | 'down' | 'left' | 'right', percent = 0.85) {
        const { width, height } = await driver.getWindowRect()
        const left = Math.floor(width * 0.05)
        const top = Math.floor(height * 0.2)
        const w = Math.floor(width * 0.9)
        const h = Math.floor(height * 0.6)

        return driver.execute('mobile: swipeGesture', {
        left,top,width: w,height: h,direction,percent,
    })
}

    async swipeUp() { return this.swipe('up') }
    async swipeDown() { return this.swipe('down') }
    async swipeLeft() { return this.swipe('left') }
    async swipeRight() { return this.swipe('right') }

    async scrollGesture(direction: 'up' | 'down', percent = 0.85): Promise<boolean> {
        const { width, height } = await driver.getWindowRect()
        const left = Math.floor(width * 0.05)
        const top = Math.floor(height * 0.12)
        const w = Math.floor(width * 0.9)
        const h = Math.floor(height * 0.76)

        return driver.execute('mobile: scrollGesture', {
        left, top, width: w, height: h, direction, percent,})
    }

    async scrollForwardOnce(): Promise<boolean> { return this.scrollGesture('down', 0.85)}
    async scrollBackwardOnce(): Promise<boolean> { return this.scrollGesture('up', 0.85)}
    async scrollToTop(max = 50) {
      for (let i = 0; i < max; i++) {
      const moved = await this.scrollBackwardOnce()
      if (!moved) break
      await driver.pause(60)
    }
    }

    async scrollUntilVisible(
      element: ChainablePromiseElement,
      max = 5
    ) {
      for (let i = 0; i < max; i++) {
        if (await element.isDisplayed()) return true
        await this.scrollForwardOnce()
        await driver.pause(300)
      }
      return false
    }

}
export default new AppPage();