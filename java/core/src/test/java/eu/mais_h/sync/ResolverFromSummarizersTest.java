package eu.mais_h.sync;

import static org.fest.assertions.Assertions.assertThat;
import static org.fest.assertions.Fail.fail;

import java.util.Collections;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Matchers;
import org.mockito.Mockito;

public class ResolverFromSummarizersTest {

  private String element1 = "element1";
  private byte[] content1 = new byte[] { (byte)1, (byte)2 };
  
  private String element2 = "element2";
  private byte[] content2 = new byte[] { (byte)3, (byte)4 };
  
  @SuppressWarnings("unchecked")
  private Difference<byte[]> difference = Mockito.mock(Difference.class);

  private Summarizer local = Mockito.mock(Summarizer.class);
  private Summarizer remote = Mockito.mock(Summarizer.class);
  
  @SuppressWarnings("unchecked")
  private Deserializer<String> deserializer = Mockito.mock(Deserializer.class);

  @Before
  public void mockDeserialization() {
    Mockito.when(deserializer.deserialize(Matchers.eq(content1))).thenReturn(element1);
    Mockito.when(deserializer.deserialize(Matchers.eq(content2))).thenReturn(element2);
  }
  
  @Before
  public void mockDifference() {
    Mockito.when(difference.added()).thenReturn(Collections.singleton(content1));
    Mockito.when(difference.removed()).thenReturn(Collections.singleton(content2));
  }

  @Test
  public void returns_deserialized_difference_of_substraction() {
    mockSuccessFor(1);
 
    Difference<String> deserialized = new ResolverFromSummarizers<String>(remote, local, deserializer).difference();

    assertThat(deserialized.added()).containsOnly(element1);
    assertThat(deserialized.removed()).containsOnly(element2);
  }

  @Test
  public void fail_with_local_summary_other_than_ibf() {
    Summary localSummary = Mockito.mock(Summary.class);
    Mockito.when(local.summarize(Matchers.eq(1))).thenReturn(localSummary);
    
    Ibf remoteSummary = Mockito.mock(Ibf.class);
    Mockito.when(remote.summarize(Matchers.eq(1))).thenReturn(remoteSummary);
    
    try {
      new ResolverFromSummarizers<String>(remote, local, deserializer).difference();
      fail();
    }
    catch (IllegalStateException e) {
      assertThat(e.getMessage()).contains("Local").contains(localSummary.toString());
    }
  }
  
  @Test
  public void fail_with_remote_summary_other_than_ibf() {
    Summary remoteSummary = Mockito.mock(Summary.class);
    Mockito.when(remote.summarize(Matchers.eq(1))).thenReturn(remoteSummary);
    
    Ibf localSummary = Mockito.mock(Ibf.class);
    Mockito.when(local.summarize(Matchers.eq(1))).thenReturn(localSummary);
    
    try {
      new ResolverFromSummarizers<String>(remote, local, deserializer).difference();
      fail();
    }
    catch (IllegalStateException e) {
      assertThat(e.getMessage()).contains("Remote").contains(remoteSummary.toString());
    }
  }

  @Test
  public void iterates_on_levels_until_success() {
    mockFailureFor(1);
    mockFailureFor(2);
    mockFailureFor(3);
    mockSuccessFor(4);
 
    Difference<String> deserialized = new ResolverFromSummarizers<String>(remote, local, deserializer).difference();

    assertThat(deserialized.added()).containsOnly(element1);
    assertThat(deserialized.removed()).containsOnly(element2);
  }
  
  private void mockSuccessFor(int level) {
    mockResolversAt(level, difference);
  }
  
  private void mockFailureFor(int level) {
    mockResolversAt(level, null);
  }
  
  private void mockResolversAt(int level, Difference<byte[]> difference) {
    Ibf localIbf = Mockito.mock(Ibf.class);
    Mockito.when(local.summarize(Matchers.eq(level))).thenReturn(localIbf);
    
    Ibf remoteIbf = Mockito.mock(Ibf.class);
    Mockito.when(remote.summarize(Matchers.eq(level))).thenReturn(remoteIbf);
    
    Ibf localMinusRemote = Mockito.mock(Ibf.class);
    Mockito.when(localIbf.substract(Matchers.eq(remoteIbf))).thenReturn(localMinusRemote);

    Mockito.when(localMinusRemote.asDifference()).thenReturn(difference);
  }
}
