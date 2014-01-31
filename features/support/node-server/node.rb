require 'socket'

$servertcpserver = nil
$server = nil
$serverpid = nil

def server_start(listenport)
  port = 12002
  $servertcpserver = TCPServer.new port
  $serverpid = Process.spawn({ "PORT"=>listenport.to_s, "LOOP"=>port.to_s }, "node --harmony index.js", :chdir=>File.dirname(__FILE__))
  $server = $servertcpserver.accept
end

def server_stop()
  Process.kill("KILL", $serverpid)
  Process.wait $serverpid
  $servertcpserver.close
end

def server_read()
  return $server.gets.split(",").map { |i| i.split(":") }
end

def server_put(key, value)
  $server.puts "PUT #{key} #{value}"
  return server_read()
end

def server_delete(key)
  $server.puts "DELETE #{key}"
  return server_read()
end
