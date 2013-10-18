package eu.mais_h.sync;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Test;
import org.mockito.Matchers;
import org.mockito.Mockito;

import eu.mais_h.sync.digest.Digester;

public class IbfTest {

  private Digester digester = Mockito.mock(Digester.class);

  @Test
  public void adding_and_removing_items() {
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)5, (byte)0 }))).thenReturn(new byte[] { (byte)9 });
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)5, (byte)1 }))).thenReturn(new byte[] { (byte)3 });
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)5 }))).thenReturn(new byte[] { (byte)4 });

    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)6, (byte)0 }))).thenReturn(new byte[] { (byte)9 });
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)6, (byte)1 }))).thenReturn(new byte[] { (byte)3 });
    Mockito.when(digester.digest(Matchers.eq(new byte[] { (byte)6 }))).thenReturn(new byte[] { (byte)8 });

    Ibf empty = new Ibf(5, (byte)2, digester);
    Ibf just5 = empty.addItem(new byte[] { (byte)5 });
    Ibf just6 = empty.addItem(new byte[] { (byte)6 });
    Ibf full = just5.addItem(new byte[] { (byte)6 });

    assertThat(full.substract(just5)).isEqualTo(just6);
    assertThat(full.substract(just6)).isEqualTo(just5);
  }
}
