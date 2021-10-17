export function createSuspenseLoader<T>(load: () => Promise<T>): () => T {
  const store = {
    promise: null as null | Promise<void>,
    value: null as null | T,
  }

  const get = (): T => {
    if (store.value) {
      return store.value
    } else if (!store.promise) {
      store.promise = load().then((value) => {
        store.value = value
      })
    }
    throw store.promise
  }

  return get
}
