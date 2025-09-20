import { $ } from '@wdio/globals'

class MenuPage {
    
    get menuBtn() { return $('~test-Menu') }   
    get logoutBtn() { return $('//android.widget.TextView[@text="LOGOUT"]') }
    get aboutBtn() { return $('//android.widget.TextView[@text="ABOUT"]') }
    get drawingBtn() { return $('~test-DRAWING') }
    get canvas() { return $('~test-DRAWING-SCREEN') }
    get saveBtn() { return $('~test-SAVE') }
    get confirmationMsg() { return $('id=android:id/message') }

    
    async openMenu() {await this.menuBtn.click()}
    async tapAbout() {await this.aboutBtn.click()}
    async tapLogout() {await this.logoutBtn.click()}
    async tapDrawing() {await this.drawingBtn.click()}
    async saveDrawing() {await this.saveBtn.click()}
    async confirmSave() {await expect(this.confirmationMsg).toHaveText('Drawing saved successfully to gallery')}
    

    async drawOnCanvas() {
    const loc = await this.canvas.getLocation()
    const size = await this.canvas.getSize()

    const startX = loc.x + size.width / 2
    const startY = loc.y + size.height / 4 
    const endX   = startX
    const endY   = loc.y + (size.height * 3) / 4

    await driver.performActions([{
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
            { type: 'pointerMove', duration: 0, x: startX, y: startY },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration: 200 },
            { type: 'pointerMove', duration: 500, x: endX, y: endY },
            { type: 'pointerUp', button: 0 }
        ]
    }])
    await driver.releaseActions()
    }

}

export default new MenuPage()