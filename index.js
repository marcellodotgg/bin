class BinStorage {
  #db = null;
  #dbName = "";
  #dbStore = "data";

  constructor(name, db = undefined) {
    this.#db = db;
    this.#dbName = name;
  }

  async setItem(key, value) {
    await this.#connect();

    return new Promise((resolve, reject) => {
      const request = this.#db
        .transaction(this.#dbStore, "readwrite")
        .objectStore(this.#dbStore)
        .put({ key, value });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getItem(key) {
    await this.#connect();

    return new Promise((resolve, reject) => {
      const request = this.#db.transaction(this.#dbStore).objectStore(this.#dbStore).get(key);

      request.onsuccess = () => {
        resolve(request.result && request.result.value);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async removeItem(key) {
    await this.#connect();

    return new Promise((resolve, reject) => {
      const request = this.#db
        .transaction(this.#dbStore, "readwrite")
        .objectStore(this.#dbStore)
        .delete(key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async clear() {
    await this.#connect();

    return new Promise((resolve, reject) => {
      const request = this.#db
        .transaction(this.#dbStore, "readwrite")
        .objectStore(this.#dbStore)
        .clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async dump() {
    await this.#connect();

    return new Promise((resolve, reject) => {
      const request = this.#db.transaction(this.#dbStore).objectStore(this.#dbStore).getAll();

      request.onsuccess = () => {
        resolve(
          request.result.reduce((acc, { key, value }) => {
            acc[key] = value;
            return acc;
          }, {})
        );
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async #connect() {
    return new Promise((resolve, reject) => {
      if (this.#db) {
        resolve();
      }

      const request = indexedDB.open(this.#dbName);

      request.onsuccess = () => {
        this.#db = request.result;
        resolve();
      };

      request.onerror = () => {
        this.#db = null;
        reject(request.error);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        db.createObjectStore(this.#dbStore, { keyPath: "key" });
      };
    });
  }
}

const localBin = new BinStorage("local_bin");
const sessionBin = new BinStorage("session_bin");

document.addEventListener("DOMContentLoaded", async function () {
  if (window.sessionStorage && !sessionStorage.getItem("marcellodotgg_bin")) {
    await sessionBin.clear();
    sessionStorage.setItem("marcellodotgg_bin", Date.now().toString());
  }
});

module.exports = { localBin, sessionBin };
