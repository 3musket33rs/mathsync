Feature: Sync API

  Background:
    Given API test application is started

  Scenario: A value is added to my store
    Given the server stores contains items 1 to 10
      And I synced the server
    When I add item 11 in my store
      And I sync
    Then the server store contains items 1 to 11

  Scenario: A value is added to the server store
    Given the server stores contains items 1 to 10
      And I synced the server
    When someone adds item 11 in the server store
      And I sync
    Then my store contains items 1 to 11

  Scenario: A value is removed from my store
    Given the server stores contains items 1 to 10
      And I synced the server
    When I delete item 1 from my store
      And I sync
    Then the server store contains items 2 to 10

  Scenario: A value is removed from the server store
    Given the server stores contains items 1 to 10
      And I synced the server
    When someone removes item 1 from the server store
      And I sync
    Then my store contains items 2 to 10

  Scenario: A value is modified in my store
    Given the server stores contains items 1 to 10
      And I synced the server
    When I modify item 1 in my store
      And I sync
    Then the server store contains items 1 to 10
      And item 1 has been modified in the server store

  Scenario: A value is modified in the server store
    Given the server stores contains items 1 to 10
      And I synced the server
    When someone modifies item 1 in the server store
      And I sync
    Then my store contains items 1 to 10
      And item 1 has been modified in my store
