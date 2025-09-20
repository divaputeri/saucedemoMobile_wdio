import { $ } from '@wdio/globals'

class LoginPage {
    get usernameInput() { return $('~test-Username') }
    get passwordInput() { return $('~test-Password') }
    get loginButton() { return $('~test-LOGIN') }
    get cartIcon() { return $('~cart-icon') }
    get errorMessage() { return $('~test-Error message') }
    
    async isOnLoginPage(): Promise<void> {
        await expect(this.usernameInput).toBeExisting()
        await expect(this.passwordInput).toBeExisting()
        await expect(this.loginButton).toBeExisting()
    }

    async login(username:string, password:string) {
        await this.usernameInput.setValue(username)
        await this.passwordInput.setValue(password)
        await this.loginButton.click()
    }

    async bruteForce(username:string, _password:string ) {
    for (let i = 0; i < 4; i++) {    
        await this.usernameInput.setValue(username)
        await this.passwordInput.setValue(`wrong_password_${i}`)
        await this.loginButton.click()
        await this.errorMessage.waitForDisplayed({timeout: 2000})
        await this.usernameInput.setValue('')
        await this.passwordInput.setValue('')
    }}
}

export default new LoginPage()
