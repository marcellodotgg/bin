declare module "@marcellodotgg/bin" {
  interface BinStorage {
    /**
     * When passed a key name and value, it will add that key
     * to the store, or update it if it already exists.
     *
     * @example
     * await localBin.setItem('tommy', { firstName: 'Tom', lastName: 'Sullivan' });
     */
    setItem(key: string | number, value: any): Promise<void>;
    /**
     * When passed a key name, will return that key's value,
     * or undefined if the key does not exist in the store.
     *
     * @example
     * const tommy = await localBin.getItem('tommy');
     */
    getItem(key: string | number): Promise<any | undefined>;
    /**
     * When passed a key name, will remove that key from the
     * store if it exists. If it does not exist, then nothing will happen.
     *
     * @example
     * await localBin.removeItem('tommy');
     */
    removeItem(key: string | number): Promise<void>;
    /**
     * Removes all of the keys in the current store.
     *
     * @example
     * await localBin.clear();
     */
    clear(): Promise<void>;
    /**
     * Retrieves the entire store and returns it as one big object.
     *
     * @example
     * await localBin.dump();
     */
    dump(): Promise<Record<string | number, any>>;
  }

  /**
   * A `sessionStorage` like store which behaves just like `sessionStorage`
   * except it is async, allows large datasets, and uses IndexedDB under-the-hood.
   *
   * @remarks
   * It will add a flag to your `sessionStorage` and that is how
   * bin knows when to clear it.
   * @see
   * https://github.com/marcellodotgg/bin
   */
  const sessionBin: BinStorage;
  /**
   * A `localStorage` like store which behaves like `localStorage` except
   * it is async, allows large datasets, and uses IndexedDB under-the-hood.
   *
   * @see
   * https://github.com/marcellodotgg/bin
   */
  const localBin: BinStorage;
}
