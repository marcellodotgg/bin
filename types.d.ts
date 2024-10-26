declare module "@marcellodotgg/bin" {
  interface BinStorage {
    setItem(key: string, value: any): Promise<void>;
    getItem(key: string): Promise<any | undefined>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
    dump(): Promise<Record<string, any>>;
  }

  const sessionBin: BinStorage;
  const localBin: BinStorage;
}
