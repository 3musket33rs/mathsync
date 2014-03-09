package eu.mais_h.mathsync;

import java.util.Iterator;
import java.util.Set;

import eu.mais_h.mathsync.serialize.Serializer;

class SerializedItems<T> implements Iterable<byte[]> {

  private final Set<? extends T> items;
  private final Serializer<? super T> serializer;

  SerializedItems(Set<? extends T> items, Serializer<? super T> serializer) {
    this.items = items;
    this.serializer = serializer;
  }

  int size() {
    return items.size();
  }

  @Override
  public Iterator<byte[]> iterator() {
    return new SerializedIterator();
  }

  private class SerializedIterator implements Iterator<byte[]> {

    private final Iterator<? extends T> itemsIterator = items.iterator();

    @Override
    public boolean hasNext() {
      return itemsIterator.hasNext();
    }

    @Override
    public byte[] next() {
      return serializer.serialize(itemsIterator.next());
    }

    @Override
    public void remove() {
      throw new UnsupportedOperationException();
    }
  }
}
