package eu.mais_h.sync;

import java.util.Iterator;

class SerializedItems<T> implements Iterable<byte[]> {

  private final Iterable<T> items;
  private final Serializer<T> serializer;
  
  SerializedItems(Iterable<T> items, Serializer<T> serializer) {
    this.items = items;
    this.serializer = serializer;
  }
  
  @Override
  public Iterator<byte[]> iterator() {
    return new SerializedIterator();
  }
  
  private class SerializedIterator implements Iterator<byte[]> {
    
    private final Iterator<T> itemsIterator = items.iterator();

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
