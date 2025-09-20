Feature: Product

    Background:
        Given I am on the login page
        And I login with "standard_user" and "secret_sauce"
        And I am on the product page

    @Validations
    Scenario: Checkout field validations
        When I add "1" product to cart
        And I go to cart
        And I proceed to checkout
        Then I test checkout errors sequentially:
            | first | last   | zip   | error                   |
            |       | Puteri | 88888 | First Name is required  |
            | Diva  |        | 88888 | Last Name is required   |
            | Diva  | Puteri |       | Postal Code is required |

    @CheckoutFlow
    Scenario Outline: Checkout with <n> product(s)
        When I add "<n>" product to cart
        And I go to cart
        And I proceed to checkout
        And I enter checkout info "Diva" "Puteri" "88888"
        And I continue checkout
        When I finish checkout
        Then I should see the thank you page

        Examples:
        | n |
        | 1 |
        | 2 |
        | 3 |
        | 4 |
        | 5 |
        | 6 |

    Scenario: Continue Shopping from Cart
        And I go to cart
        When I tap continue shopping
        Then I am on the product page

    Scenario: Cancel on information page
        And I go to cart
        And I proceed to checkout
        When I tap cancel
        Then I am on the product page

    Scenario: Cancel on overview page
        And I go to cart
        And I proceed to checkout
        And I enter checkout info "Diva" "Puteri" "88888"
        And I continue checkout
        And I tap cancel
        Then I am on the product page