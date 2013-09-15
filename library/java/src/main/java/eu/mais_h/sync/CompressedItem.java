package eu.mais_h.sync;

import java.util.List;

public interface CompressedItem {

  List<Integer> buckets();
  byte[] bytes();
}
