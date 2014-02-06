---
layout: default
title: MathSync
---

# Java

[Full javadoc](/javadoc) is available.

## Server

A a dependency towards the library:

```
<dependency>
  <groupId>eu.mais-h.mathsync</groupId>
  <artifactId>core</artifactId>
  <version>0.2.0-SNAPSHOT</version>
</dependency>
```

Create a servlet fetching your items, serializing them and sending the summary over the wire:

```
public class SummaryServlet extends HttpServlet {

  private static final long serialVersionUID = 8629863338196207094L;

  private Set<XXX> items = /* where do your items come from? */;
  private final Summarizer summarizer = SummarizerFromItems.simple(items, new Serializer<XXX>() {

    @Override
    public byte[] serialize(XXX t) {
      return /* how to serialize individual items on the wire? */;
    }
  }));

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
}
```

And bind this servlet in your `web.xml`:

```
<!DOCTYPE web-app PUBLIC "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN" "http://java.sun.com/dtd/web-app_2_3.dtd" >
<web-app>
  <display-name>My awesome webapp</display-name>
  <servlet>
    <servlet-name>summary</servlet-name>
    <servlet-class>eu.mais_h.mathsync.SummaryServlet</servlet-class>
    <load-on-startup>1</load-on-startup>
  </servlet>
  <servlet-mapping>
    <servlet-name>summary</servlet-name>
    <url-pattern>/summary/*</url-pattern>
  </servlet-mapping>
</web-app>
```

The servlet can be extended to expose session-specific summaries.
