require 'socket'

$clienttcpserver = nil
$client = nil
$clientpid = nil

def client_start(serverport)
  port = 12001
  $clienttcpserver = TCPServer.new port
  $clientpid = Process.spawn({ "PORT"=>serverport.to_s, "LOOP"=>port.to_s }, "node --harmony index.js", :chdir=>File.dirname(__FILE__))
  $client = $clienttcpserver.accept
end

def client_stop()
  Process.kill("KILL", $clientpid)
  Process.wait $clientpid
  $clienttcpserver.close
end

def client_read()
  return $client.gets.split(",").map { |i| i.split(":") }
end

def client_put(key, value)
  $client.puts "PUT #{key} #{value}"
  return client_read()
end

def client_delete(key)
  $client.puts "DELETE #{key}"
  return client_read()
end

def client_sync()
  $client.puts "SYNC"
  return client_read()
end

def client_get()
  $client.puts "GET"
  return client_read()
end
