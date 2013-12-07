package eu.mais_h.sync;

import java.util.Iterator;

import eu.mais_h.sync.serialize.Serializer;

class SerializedItems<T> implements Iterable<byte[]> {

  private final Iterable<? extends T> items;
  private final Serializer<? super T> serializer;
  
  SerializedItems(Iterable<? extends T> items, Serializer<? super T> serializer) {
    this.items = items;
    this.serializer = serializer;
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
