require 'rspec/expectations'

require("#{File.dirname(__FILE__)}/#{ENV['CLIENT']}/node")
require("#{File.dirname(__FILE__)}/#{ENV['SERVER']}/node")

port = 13000

Before do |scenario|
  server_start(port)
end
After do |scenario|
  server_stop()
end

Before do |scenario|
  client_start(port)
end
After do |scenario|
  client_stop()
end
