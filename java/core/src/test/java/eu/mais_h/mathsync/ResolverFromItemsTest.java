package eu.mais_h.mathsync;

import static org.fest.assertions.Assertions.assertThat;
import static org.fest.assertions.Fail.fail;

import java.util.Collections;
import java.util.Iterator;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Matchers;
import org.mockito.Mockito;

import eu.mais_h.mathsync.serialize.Deserializer;

public class ResolverFromItemsTest {

  @SuppressWarnings("unchecked")
  private Iterable<byte[]> local = Mockito.mock(Iterable.class);
  @SuppressWarnings("unchecked")
  private Iterator<byte[]> iterator = Mockito.mock(Iterator.class);

  private String localElement = "element1";
  private byte[] localContent = new byte[] { (byte)1, (byte)2 };

  private String remoteElement = "element2";
  private byte[] remoteContent = new byte[] { (byte)3, (byte)4 };

  @SuppressWarnings("unchecked")
  private Difference<byte[]> difference = Mockito.mock(Difference.class);

  private Summarizer remote = Mockito.mock(Summarizer.class);

  @SuppressWarnings("unchecked")
  private Deserializer<String> deserializer = Mockito.mock(Deserializer.class);

  @Before
  public void mockLocal() {
    Mockito.when(local.iterator()).thenReturn(iterator);
  }

  @Before
  public void mockDeserialization() {
    Mockito.when(deserializer.deserialize(Matchers.eq(localContent))).thenReturn(localElement);
    Mockito.when(deserializer.deserialize(Matchers.eq(remoteContent))).thenReturn(remoteElement);
  }

  @Before
  public void mockDifference() {
    Mockito.when(difference.added()).thenReturn(Collections.singleton(remoteContent));
    Mockito.when(difference.removed()).thenReturn(Collections.singleton(localContent));
  }

  @Test
  public void iterates_on_levels_until_success() {
    mockFailureFor(1);
    mockFailureFor(2);
    mockFailureFor(3);
    mockSuccessFor(4);

    Difference<String> deserialized = new ResolverFromItems<String>(local, remote, deserializer).difference();

    assertThat(deserialized.added()).containsOnly(remoteElement);
    assertThat(deserialized.removed()).containsOnly(localElement);
  }

  private void mockSuccessFor(int level) {
    mockResolversAt(level, difference);
  }

  private void mockFailureFor(int level) {
    mockResolversAt(level, null);
  }

  private void mockResolversAt(int level, Difference<byte[]> difference) {
    Ibf remoteIbf = Mockito.mock(Ibf.class);
    Mockito.when(remote.summarize(Matchers.eq(level))).thenReturn(remoteIbf);

    Ibf localMinusRemote = Mockito.mock(Ibf.class);
    Mockito.when(remoteIbf.minus(Matchers.eq(iterator))).thenReturn(localMinusRemote);

    Mockito.when(localMinusRemote.toDifference()).thenReturn(difference);
  }
}
