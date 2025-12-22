@security
Feature: Security Audit with QAstell
  As a security-conscious developer
  I want to audit web pages for security vulnerabilities
  So that I can ensure my application is secure

  Background:
    Given the browser is launched

  @homepage
  Scenario: Audit the homepage for security issues
    When I navigate to "https://the-internet.herokuapp.com"
    And I perform a security audit
    Then the security audit should pass
    And the audit results should be attached to the report

  @login
  Scenario: Audit the login page for form vulnerabilities
    When I navigate to "https://the-internet.herokuapp.com/login"
    And I perform a security audit focusing on "forms,sensitive-data,headers"
    Then the security audit should pass
    And the audit results should be attached to the report

  @dynamic-content
  Scenario: Audit dynamic content page
    When I navigate to "https://the-internet.herokuapp.com/dynamic_content"
    And I perform a security audit
    Then the security audit should pass
    And the audit results should be attached to the report

  @inputs
  Scenario: Audit input fields page
    When I navigate to "https://the-internet.herokuapp.com/inputs"
    And I perform a security audit
    Then the security audit should pass
    And the audit results should be attached to the report

  @multiple-pages
  Scenario Outline: Audit multiple pages for security issues
    When I navigate to "<url>"
    And I perform a security audit
    Then the security audit should pass
    And the audit results should be attached to the report

    Examples:
      | url                                            |
      | https://the-internet.herokuapp.com/checkboxes  |
      | https://the-internet.herokuapp.com/dropdown    |
      | https://the-internet.herokuapp.com/inputs      |
