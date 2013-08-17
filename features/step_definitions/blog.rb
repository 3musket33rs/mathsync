#encoding: utf-8

When /^I visit the homepage$/ do
  visit ui_url '/'
end

Then /^I see title$/ do
  page.should have_content 'Programming land'
end
