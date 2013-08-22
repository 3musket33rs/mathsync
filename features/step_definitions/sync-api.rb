#encoding: utf-8

Given /^API test application is started$/ do |type|
  start_server 'api'
  visit ui_url '/'
end

Given /^the server stores contains items (.*) to (.*)$/ do |from,to|
  (from.to_i .. to.to_i).each do |item|
    page.execute_script("addServerItem(" + item.to_s + ")")
  end
end

Given /^I synced the server$/ do
  page.execute_script("sync()")
end



When /^I add item (.*) in my store$/ do |item|
  page.execute_script("addClientItem(" + item + ")")
end

When /^I sync$/ do
  page.execute_script("sync()")
end



Then /^the server store contains items (.*) to (.*)$/ do |from,to|
  (from.to_i .. to.to_i).each do |item|
    page.should has_selector?('#server' + item.to_s)
  end
end

Then /^my store contains items (.*) to (.*)$/ do |from,to|
  (from.to_i .. to.to_i).each do |item|
    page.should has_selector?('#client' + item.to_s)
  end
end
