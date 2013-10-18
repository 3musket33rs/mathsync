package eu.mais_h.sync;

public interface Deserializer<T> {

  T deserialize(byte[] content);
}
