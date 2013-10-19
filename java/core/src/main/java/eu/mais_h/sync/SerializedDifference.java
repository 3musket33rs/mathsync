package eu.mais_h.sync;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

class SerializedDifference implements Difference<byte[]> {

  private final Set<byte[]> added;
  private final Set<byte[]> removed;

  SerializedDifference(Set<byte[]> added, Set<byte[]> removed) {
    this.added = added;
    this.removed = removed;
  }

  @Override
  public Set<byte[]> added() {
    return added;
  }

  @Override
  public Set<byte[]> removed() {
    return removed;
  }
}
