package eu.mais_h.sync;

import eu.mais_h.sync.digest.Digester;

class SummarizerFromItems implements Summarizer {

  private final Iterable<byte[]> items;
  private final Digester digester;
  private final byte spread;

  SummarizerFromItems(Iterable<byte[]> items, Digester digester, byte spread) {
    this.items = items;
    this.digester = digester;
    this.spread = spread;
  }

  @Override
  public Summary compress(int size) {
    MutableIbf ibf = new MutableIbf(size, spread, digester);
    for (byte[] item : items) {
      ibf.addItem(item);
    }
    return ibf;
  }
}
