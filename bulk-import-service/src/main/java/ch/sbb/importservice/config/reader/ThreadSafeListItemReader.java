package ch.sbb.importservice.config.reader;

import java.util.Collections;
import java.util.List;
import org.springframework.batch.infrastructure.item.ItemReader;

public class ThreadSafeListItemReader<T> implements ItemReader<T> {

  private final List<T> list;

  public ThreadSafeListItemReader(List<T> list) {
    this.list = Collections.synchronizedList(list);
  }

  @Override
  public T read() {
    synchronized (list) {
      if (!list.isEmpty()) {
        return list.removeFirst();
      }
      return null;
    }
  }
}
