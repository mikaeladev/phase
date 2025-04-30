export function constantFactory<T>(value: T): () => T {
  return () => value
}
