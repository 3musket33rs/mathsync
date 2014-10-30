package eu.mais_h.mathsync;

import org.apache.commons.codec.binary.Base64;

import eu.mais_h.mathsync.digest.Sha1Digester;
import eu.mais_h.mathsync.util.StringUtils;

class Defaults {

  private static final BucketSelector DEFAULT_SELECTOR = PadAndHashBucketSelector.newInstance(Sha1Digester.get(), 3);

  static int ibfSizeFromLevel(int level) {
    return (int)Math.pow(2, level);
  }

  static BucketSelector defaultSelector() {
    return DEFAULT_SELECTOR;
  }

  static String serialize(byte[] array) {
    return StringUtils.newStringUtf8(Base64.encodeBase64(array, false));
  }

  static byte[] deserialize(String serialized) {
    return Base64.decodeBase64(serialized.getBytes());
  }
}
