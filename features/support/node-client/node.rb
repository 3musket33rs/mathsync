require 'socket'

$server = nil
$client = nil
$pid = nil

def start(serverport)
  port = 12001
  $server = TCPServer.new port
  $pid = Process.spawn({ "PORT"=>serverport.to_s, "LOOP"=>port.to_s }, "node --harmony index.js")
  $client = $server.accept
end

def stop()
  Process.kill("KILL", $pid)
  Process.wait $pid
  $server.close
end

def client_put(key, value)
  $client.puts "PUT #{key} #{value}"
end

def client_delete(key)
  $client.puts "DELETE #{key}"
end

def client_sync()
  $client.puts "SYNC"
  return $client.gets.split(",").map { |i| i.split(":") }
end
