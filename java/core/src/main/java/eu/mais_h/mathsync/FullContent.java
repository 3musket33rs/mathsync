package eu.mais_h.mathsync;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;

/**
 * Summary implementation simply using items content.
 */
public class FullContent implements Summary {

  static final Summary EMPTY = new FullContent(Collections.<EquatableArray>emptySet(), Collections.<EquatableArray>emptySet());

  private final Set<EquatableArray> added;
  private final Set<EquatableArray> removed;

  /**
   * Deserializes a summary from its JSON representation.
   *
   * @param tokener the JSON content.
   */
  FullContent(JSONTokener tokener) {
    JSONObject deserialized = new JSONObject(tokener);
    added = deserializeArray(deserialized.getJSONArray("added"));
    removed = deserializeArray(deserialized.getJSONArray("removed"));
  }

  private FullContent(Set<EquatableArray> added, Set<EquatableArray> removed) {
    this.added = added;
    this.removed = removed;
  }

  @Override
  public Summary plus(byte[] item) {
    Set<EquatableArray> addedCopy = new HashSet<>(added);
    Set<EquatableArray> removedCopy = new HashSet<>(removed);
    insertOrRemove(addedCopy, removedCopy, item);
    return new FullContent(addedCopy, removedCopy);
  }

  @Override
  public Summary plus(Iterator<byte[]> items) {
    Set<EquatableArray> addedCopy = new HashSet<>(added);
    Set<EquatableArray> removedCopy = new HashSet<>(removed);
    while (items.hasNext()) {
      insertOrRemove(addedCopy, removedCopy, items.next());
    }
    return new FullContent(addedCopy, removedCopy);
  }

  @Override
  public Summary minus(byte[] item) {
    Set<EquatableArray> addedCopy = new HashSet<>(added);
    Set<EquatableArray> removedCopy = new HashSet<>(removed);
    insertOrRemove(removedCopy, addedCopy, item);
    return new FullContent(addedCopy, removedCopy);
  }

  @Override
  public Summary minus(Iterator<byte[]> items) {
    Set<EquatableArray> addedCopy = new HashSet<>(added);
    Set<EquatableArray> removedCopy = new HashSet<>(removed);
    while (items.hasNext()) {
      insertOrRemove(removedCopy, addedCopy, items.next());
    }
    return new FullContent(addedCopy, removedCopy);
  }

  @Override
  public Summary minus(Summary summary) {
    Difference<byte[]> difference = summary.toDifference();
    if (difference == null) {
      throw new IllegalArgumentException("Cannot substract a summary which cannot be resolved as a difference: " + summary);
    }
    Set<EquatableArray> addedCopy = new HashSet<>(added);
    Set<EquatableArray> removedCopy = new HashSet<>(removed);
    for (byte[] item : difference.added()) {
      insertOrRemove(removedCopy, addedCopy, item);
    }
    for (byte[] item : difference.removed()) {
      insertOrRemove(addedCopy, removedCopy, item);
    }
    return new FullContent(addedCopy, removedCopy);
  }

  @Override
  public String toJSON() {
    JSONObject object = new JSONObject();
    object.put("added", serializeSet(added));
    object.put("removed", serializeSet(removed));
    return object.toString();
  }

  @Override
  public Difference<byte[]> toDifference() {
    return new SerializedDifference(unwrap(added), unwrap(removed));
  }

  private void insertOrRemove(Set<EquatableArray> mayInsert, Set<EquatableArray> mayRemove, byte[] item) {
    EquatableArray wrapped = new EquatableArray(item);
    if (mayRemove.contains(wrapped)) {
      mayRemove.remove(wrapped);
    } else {
      mayInsert.add(wrapped);
    }
  }

  private JSONArray serializeSet(Set<EquatableArray> set) {
    JSONArray array = new JSONArray();
    for (EquatableArray ea : set) {
      array.put(ea.toString());
    }
    return array;
  }

  private Set<byte[]> unwrap(Set<EquatableArray> wrapped) {
    Set<byte[]> unwrapped = new HashSet<>();
    for (EquatableArray ea : wrapped) {
      unwrapped.add(ea.content);
    }
    return unwrapped;
  }

  private Set<EquatableArray> deserializeArray(JSONArray array) {
    Set<EquatableArray> deserialized = new HashSet<>();
    for (int i = 0; i < array.length(); i++) {
      deserialized.add(new EquatableArray(array.getString(i)));
    }
    return deserialized;
  }

  private static final class EquatableArray {

    private final byte[] content;
    private final int hashCode;

    private EquatableArray(byte[] content) {
      this.content = content;
      hashCode = Arrays.hashCode(content);
    }

    private EquatableArray(String serialized) {
      this(Defaults.deserialize(serialized));
    }

    @Override
    public int hashCode() {
      return hashCode;
    }

    @Override
    public boolean equals(Object obj) {
      if (this == obj) {
        return true;
      }
      if (!(obj instanceof EquatableArray)) {
        return false;
      }
      EquatableArray other = (EquatableArray)obj;
      if (!Arrays.equals(content, other.content)) {
        return false;
      }
      return true;
    }

    @Override
    public String toString() {
      return Defaults.serialize(content);
    }
  }
}
