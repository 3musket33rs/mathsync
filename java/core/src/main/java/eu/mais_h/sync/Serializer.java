package eu.mais_h.sync;

public interface Serializer<T> {

  byte[] serialize(T item);
}
