package eu.mais_h.sync.digest;

import static org.hamcrest.CoreMatchers.sameInstance;
import static org.hamcrest.MatcherAssert.assertThat;

import org.junit.Test;

public class DigestersTest {

  @Test
  public void always_use_same_sha1_digester_instance() {
    assertThat(Digesters.sha1(), sameInstance(Digesters.sha1()));
  }
}
