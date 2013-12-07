package eu.mais_h.sync;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import eu.mais_h.sync.serialize.Deserializer;

class DeserializedDifference<T> implements Difference<T> {

  private final Set<T> added;
  private final Set<T> removed;

  DeserializedDifference(Difference<byte[]> serialized, Deserializer<T> deserializer) {
    added = deserialize(serialized.added(), deserializer);
    removed = deserialize(serialized.removed(), deserializer);
  }

  @Override
  public Set<T> added() {
    return added;
  }

  @Override
  public Set<T> removed() {
    return removed;
  }

  private Set<T> deserialize(Set<byte[]> serialized, Deserializer<T> deserializer) {
    Set<T> deserialized = new HashSet<T>(serialized.size());
    for (byte[] content : serialized) {
      deserialized.add(deserializer.deserialize(content));
    }
    return Collections.unmodifiableSet(deserialized);
  }
}
