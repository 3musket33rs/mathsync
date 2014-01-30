require 'socket'

server = nil
client = nil
pid = nil

def start(serverport)
  server = TCPServer.new 12001
  pid = Process.spawn({ "SERVER"=>serverport.to_s, "LOOP"=>"12001" }, "node --harmony index.js", [:out, :err]=>["log", "w"])
  client = server.accept
end

def stop()
  Process.kill("KILL", pid)
  Process.wait pid
  server.close
end

def client_put(key, value)
  client.puts "PUT #{key} #{value}"
end

def client_delete(key)
  client.puts "DELETE #{key}"
end

def client_sync()
  client.puts "SYNC"
  return client.gets.split(",").map { |i| i.split(":") }
end
