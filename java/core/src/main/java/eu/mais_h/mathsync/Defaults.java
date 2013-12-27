package eu.mais_h.mathsync;

import eu.mais_h.mathsync.digest.Sha1Digester;

class Defaults {

  private static final BucketSelector DEFAULT_SELECTOR = PadAndHashBucketSelector.newInstance(Sha1Digester.get(), 3);

  static int ibfSizeFromLevel(int level) {
    return (int)Math.pow(2, level);
  }

  static BucketSelector defaultSelector() {
    return DEFAULT_SELECTOR;
  }
}
