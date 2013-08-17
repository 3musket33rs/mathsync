require 'rspec/expectations'
require 'capybara/cucumber'
require 'capybara/poltergeist'
require 'net/http'

if ENV['IN_BROWSER']
  # On demand: non-headless tests via Selenium/WebDriver
  # To run the scenarios in browser (default: Firefox), use the following command line:
  # IN_BROWSER=true bundle exec cucumber
  # or (to have a pause of 1 second between each step):
  # IN_BROWSER=true PAUSE=1 bundle exec cucumber
  Capybara.default_driver = :selenium
  AfterStep do
    sleep (ENV['PAUSE'] || 0).to_i
  end
else
  # DEFAULT: headless tests with poltergeist/PhantomJS
  Capybara.register_driver :poltergeist do |app|
    Capybara::Poltergeist::Driver.new(
      app,
      window_size: [1280, 1024]#,
      #debug:       true
    )
  end
  Capybara.default_driver    = :poltergeist
  Capybara.javascript_driver = :poltergeist
end

Capybara.default_selector = :css
World(RSpec::Matchers)

# Server management

@server_started = false
@pid = nil
@serverpid = nil

def start_server(server_type)
  if @server_started
    # TODO error
  end

  serverdir = File.dirname(__FILE__) + "/" + server_type
  pidfile = serverdir + "/pid"

  if File.file?(pidfile)
    File.delete pidfile
  end
  # TODO do not rely on env
  @pid = Process.spawn({"PORT"=>"3456", "PIDFILE"=>"pid"}, "make -C " + serverdir, [:out, :err]=>["log", "w"])
  # TODO handle process failure before server starts
  until File.exists?(pidfile)
    sleep 1
  end
  @serverpid = File.read(pidfile).to_i
  File.delete pidfile
  @server_started = true
end

After do
  # TODO more robust cleanup on error, handle SIGTERM rather than SIGKILL
  if @server_started
    Process.kill("KILL", @serverpid)
    Process.wait @pid
    @server_started = false
  end
end

def ui_url(path)
  "http://localhost:3456" + path
end
