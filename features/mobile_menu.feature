Feature: Menu

  Background:
    Given I am on the login page
    And I login with "standard_user" and "secret_sauce"
    And I am on the product page

  Scenario: Open Drawing page from menu
    When I tap menu
    And I tap drawing
    And I draw on the canvas
    And I save the drawing
    Then I should see the drawing saved confirmation

  Scenario: Open About from menu
    When I tap menu
    And I tap about
    Then I should see the about page

  Scenario: Logout from menu
    When I tap menu
    And I tap logout
    Then I am on the login page
