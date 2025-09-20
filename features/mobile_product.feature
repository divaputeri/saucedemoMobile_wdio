Feature: Product

    Background:
      Given I am on the login page
      And I login with "standard_user" and "secret_sauce"
      And I am on the product page

    Scenario: Check detail product
      Then I verify products sequentially:

        | name                              |
        | Sauce Labs Backpack               |
        | Sauce Labs Bike Light             |
        | Sauce Labs Bolt T-Shirt           |
        | Sauce Labs Fleece Jacket          |
        | Sauce Labs Onesie                 |
        | Test.allTheThings() T-Shirt (Red) |

    
    @AddProduct
    Scenario: Add to Cart
    When I add "<n>" product to cart
    Then I should see product in cart
    And the cart icon should show "<n>" item

        Examples:
        | n |     
        | 1 |
        | 2 |
        | 3 |
        | 4 |
        | 5 |
        | 6 |

    @RemoveProductOutside
    Scenario: Remove from Cart outside
        And I add "<n>" product to cart
        When I remove "<n>" product from outside cart
        Then I should not see product in cart
        And the cart icon should show "0" item
    
        Examples:
        | n |     
        | 1 |
        | 2 |
        | 3 |
        | 4 |
        | 5 |
        | 6 |

    @RemoveProductInside
    Scenario: Remove from Cart inside
        And I add "<n>" product to cart
        When I remove "<n>" product from inside cart
        Then I should not see product in cart
    
        Examples:
        | n |     
        | 1 |
        | 2 |
        | 3 |
        | 4 |
        | 5 |
        | 6 |
    
    
    @Listview
    Scenario: Switch to List View
      When I switch to list view
      Then products should be displayed in list layout

    @Gridview
    Scenario: Switch to Grid View
      When I switch to grid view
      Then products should be displayed in grid layout


    @Sort
    Scenario Outline: Sort products
      When I sort products by "<criteria>"
      Then products should be sorted "<type>"

      Examples:
        | criteria              | type         |
        | Name (A to Z)         | nameAsc      |
        | Name (Z to A)         | nameDesc     |
        | Price (low to high)   | priceAsc     |
        | Price (high to low)   | priceDesc    |

