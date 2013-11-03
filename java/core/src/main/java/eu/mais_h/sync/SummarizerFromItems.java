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
  public Summary summarize(int level) {
    Ibf ibf = new Ibf(ibfSizeFromLevel(level), digester, spread);
    for (byte[] item : items) {
      ibf.addItem(item);
    }
    return ibf;
  }

  private int ibfSizeFromLevel(int level) {
    return (int)Math.pow(2, level);
  }
}
