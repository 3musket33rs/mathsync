package eu.mais_h.mathsync;

import static org.fest.assertions.Assertions.assertThat;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Matchers;
import org.mockito.Mockito;

import eu.mais_h.mathsync.serialize.Deserializer;

public class DeserializedDifferenceTest {

  @SuppressWarnings("unchecked")
  Difference<byte[]> serialized = Mockito.mock(Difference.class);

  @SuppressWarnings("unchecked")
  Deserializer<String> deserializer = Mockito.mock(Deserializer.class);

  @Before
  public void setupFixtures() {
    Mockito.when(serialized.added()).thenReturn(asSet(new byte[] { 1, 2 }, new byte[] { 3, 4 }));
    Mockito.when(deserializer.deserialize(Matchers.eq(new byte[] { 1, 2 }))).thenReturn("a");
    Mockito.when(deserializer.deserialize(Matchers.eq(new byte[] { 3, 4 }))).thenReturn("b");

    Mockito.when(serialized.removed()).thenReturn(asSet(new byte[] { 5, 6 }, new byte[] { 7, 8 }));
    Mockito.when(deserializer.deserialize(Matchers.eq(new byte[] { 5, 6 }))).thenReturn("c");
    Mockito.when(deserializer.deserialize(Matchers.eq(new byte[] { 7, 8 }))).thenReturn("d");
  }

  @Test
  public void added_set_is_deserialized_from_input() {
    assertThat(new DeserializedDifference<String>(serialized, deserializer).added()).containsOnly("a", "b");
  }

  @Test
  public void removed_set_is_deserialized_from_input() {
    assertThat(new DeserializedDifference<String>(serialized, deserializer).removed()).containsOnly("c", "d");
  }

  private Set<byte[]> asSet(byte[]... serialized) {
    return new HashSet<byte[]>(Arrays.asList(serialized));
  }
}
