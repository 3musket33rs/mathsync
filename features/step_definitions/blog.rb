#encoding: utf-8

Given /^I have a (.*) server$/ do |type|
  start_server type
end

When /^I visit the homepage$/ do
  visit ui_url '/'
end

Then /^I see title$/ do
  page.should have_content 'Programming land'
end
