#encoding: utf-8

Given /^the server stores contains items (.*) to (.*)$/ do |from,to|
  (from.to_i .. to.to_i).each do |item|
    server_put(item.to_s, item.to_s)
  end
end

Given /^I synced the server$/ do
  puts "not yet implemented"
end



When /^I add item (.*) in my store$/ do |item|
  puts "not yet implemented"
end

When /^I sync$/ do
  puts "not yet implemented"
end



Then /^the server store contains items (.*) to (.*)$/ do |from,to|
  (from.to_i .. to.to_i).each do |item|
    puts "not yet implemented"
  end
end

Then /^my store contains items (.*) to (.*)$/ do |from,to|
  (from.to_i .. to.to_i).each do |item|
    puts "not yet implemented"
  end
end
