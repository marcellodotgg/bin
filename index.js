class StorageBin {
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

const sessionId = sessionStorage.getItem("storage_bin_session") || Date.now().toString();

const localBin = new StorageBin("local_bin");
const sessionBin = new StorageBin(`session_${sessionId}`);

document.addEventListener("DOMContentLoaded", async function () {
  if (!sessionStorage.getItem("storage_bin_session")) {
    sessionStorage.setItem("storage_bin_session", sessionId);
    await sessionBin.clear();
  }
  removeInactiveSession(sessionId);
  removeStaleSessions();
});

window.addEventListener("beforeunload", () => {
  addInactiveSession(sessionId);
});

function getInactiveSessions() {
  const inactiveSessionsJSON = localStorage.getItem("storage_bin_sessions") || "{}";
  const inactiveSessions = JSON.parse(inactiveSessionsJSON);
  return inactiveSessions;
}

function addInactiveSession(sessionId) {
  const inactiveSessions = getInactiveSessions();

  localStorage.setItem(
    "storage_bin_sessions",
    JSON.stringify({ ...inactiveSessions, [sessionId]: Date.now() })
  );
}

function removeInactiveSession(sessionId) {
  const inactiveSessions = getInactiveSessions();

  delete inactiveSessions[sessionId];

  localStorage.setItem("storage_bin_sessions", JSON.stringify({ ...inactiveSessions }));
}

function removeStaleSessions() {
  const inactiveSessions = getInactiveSessions();
  const fiveSecondsAgo = Date.now() - 5_000;

  for (const sessionId of Object.keys(inactiveSessions)) {
    if (inactiveSessions[sessionId] < fiveSecondsAgo) {
      removeInactiveSession(sessionId);
      deleteDatabase(sessionId);
    }
  }
}

function deleteDatabase(sessionId) {
  indexedDB.deleteDatabase(`session_${sessionId}`);
}

module.exports = { localBin, sessionBin };
