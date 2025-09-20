Feature: Login

  Background:
    Given I am on the login page

  @Positive
  Scenario Outline: Valid Credentials
    When I login with "<username>" and "<password>"
    Then I should see product list

    Examples:
      | username        | password            | note        |
      | standard_user   | secret_sauce        | normal      |
      | problem_user    | secret_sauce        | problem     |
      |  standard_user  | secret_sauce        | front space |
      | standard_user   | secret_sauce        | back space  |


  @Negative
  Scenario Outline: Invalid Credentials
    When I login with "<username>" and "<password>"
    Then I should see error message

    Examples:
      | username                  | password            | note                        |
      | locked_out_user           | secret_sauce        | locked user                 |
      | random_user               | secret_sauce        | username not exist          |
      | standard_user             | wrong_password      | wrong password              |
      |                           |                     | both empty                  |
      |                           | secret_sauce        | username empty              |
      | standard_user             |                     | password empty              |
      | STANDARD_USER             | secret_sauce        | uppercase username          |
      | standard_user             | SECRET_SAUCE        | uppercase password          |
      | user123*#                 | secret_sauce        | username special char       |
      | standard_user             | secret_sauce123*#   | password special char       |
      | ' OR 1=1 --               | password            | SQL injection username      |
      | <script>alert(1)</script> | password            | XSS injection username      |
      | standard_user             | brute_force         | brute force attempt (wrong) |

  @Reopen
  Scenario: Reopen App after force close
    And I login with "standard_user" and "secret_sauce"
    And I should see product list
    When I close the App
    And I open the App
    Then I am on the login page
