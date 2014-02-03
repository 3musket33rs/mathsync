package eu.mais_h.mathsync.test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.Socket;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;

import eu.mais_h.mathsync.Summarizer;
import eu.mais_h.mathsync.SummarizerFromItems;
import eu.mais_h.mathsync.serialize.Serializer;

public class SummaryServlet extends HttpServlet {

  private static final long serialVersionUID = 8629863338196207094L;

  private final Map<String, String> content = Collections.synchronizedMap(new HashMap<String, String>());
  private final Summarizer summarizer = SummarizerFromItems.simple(content.entrySet(), new Serializer<Entry<String, String>>() {

    @Override
    public byte[] serialize(Entry<String, String> item) {
      try {
        return (item.getKey() + ':' + item.getValue()).getBytes("UTF-8");
      } catch (UnsupportedEncodingException e) {
        throw new AssertionError("JVM does not support UTF-8 encoding");
      }
    }
  });

  public SummaryServlet() {
    new Listener().start();
  }

  public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    PrintWriter out = response.getWriter();
    int level;
    try {
      String path = request.getPathInfo();
      String levelStr = path.substring(path.lastIndexOf('/') + 1);
      level = Integer.parseInt(levelStr);
    } catch(NumberFormatException e) {
      throw new ServletException("Failed to parse level", e);
    }
    out.println(summarizer.summarize(level).toJSON());
    out.flush();
    out.close();
  }

  private class Listener extends Thread {

    @Override
    public void run() {
      try {
        Socket echoSocket = new Socket("localhost", Integer.parseInt(System.getenv().get("LOOP")));
        PrintWriter out = new PrintWriter(echoSocket.getOutputStream(), true);
        BufferedReader in = new BufferedReader(new InputStreamReader(echoSocket.getInputStream()));
        while (true) {
          String line = in.readLine();
          String[] tokens = line.split(" ");
          switch (tokens[0]) {
          case "CLEAR":
            content.clear();
            break;
          case "PUT":
            content.put(tokens[1], tokens[2]);
            break;
          }

          List<String> items = new ArrayList<>();
          for (Entry<String, String> e : content.entrySet()) {
            items.add(e.getKey() + ':' + e.getValue());
          }
          out.println(StringUtils.join(items, ','));
        }
      } catch (IOException e) {
        throw new RuntimeException("Failed to initialize loop connection", e);
      }
    }
  }
}
