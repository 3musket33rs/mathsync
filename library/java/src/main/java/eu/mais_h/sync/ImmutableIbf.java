package eu.mais_h.sync;

import java.lang.UnsupportedOperationException;
import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;

class ImmutableIbf implements Ibf {

  private final List<Bucket> buckets;

  ImmutableIbf(List<? extends Bucket> buckets) {
    this.buckets = Collections.<Bucket>unmodifiableList(buckets);
  }

  @Override
  public boolean contains(Object o) {
    return buckets.contains(o);
  }

  @Override
  public boolean containsAll(Collection<?> c) {
    return buckets.containsAll(c);
  }

  @Override
  public Bucket get(int index) {
    return buckets.get(index);
  }

  @Override
  public int indexOf(Object b) {
    return buckets.indexOf(b);
  }

  @Override
  public int lastIndexOf(Object b) {
    return buckets.lastIndexOf(b);
  }

  @Override
  public boolean isEmpty() {
    return buckets.isEmpty();
  }

  @Override
  public Iterator<Bucket> iterator() {
    return buckets.iterator();
  }

  @Override
  public ListIterator<Bucket> listIterator() {
    return buckets.listIterator();
  }

  @Override
  public ListIterator<Bucket> listIterator(int index) {
    return buckets.listIterator(index);
  }

  @Override
  public int size() {
    return buckets.size();
  }

  @Override
  public List<Bucket> subList(int fromIndex, int toIndex) {
    return buckets.subList(fromIndex, toIndex);
  }

  @Override
  public Object[] toArray() {
    return buckets.toArray();
  }

  @Override
  public <T> T[] toArray(T[] a) {
    return buckets.toArray(a);
  }

  @Override
  public int hashCode() {
    return buckets.hashCode();
  }

  @Override
  public boolean equals(Object o) {
    if (o == this) {
      return true;
    }
    if (!(o instanceof Ibf)) {
      return false;
    }
    return buckets.equals(o);
  }

  @Override
  public boolean add(Bucket b) {
    throw new UnsupportedOperationException();
  }

  @Override
  public void add(int index, Bucket b) {
    throw new UnsupportedOperationException();
  }

  @Override
  public boolean addAll(Collection<? extends Bucket> c) {
    throw new UnsupportedOperationException();
  }

  @Override
  public boolean addAll(int index, Collection<? extends Bucket> c) {
    throw new UnsupportedOperationException();
  }

  @Override
  public void clear() {
    throw new UnsupportedOperationException();
  }

  @Override
  public Bucket remove(int index) {
    throw new UnsupportedOperationException();
  }

  @Override
  public boolean remove(Object o) {
    throw new UnsupportedOperationException();
  }

  @Override
  public boolean removeAll(Collection<?> c) {
    throw new UnsupportedOperationException();
  }

  @Override
  public boolean retainAll(Collection<?> c) {
    throw new UnsupportedOperationException();
  }

  @Override
  public Bucket set(int index, Bucket b) {
    throw new UnsupportedOperationException();
  }
}
