# 🗑️ bin

An extremely lightweight Web Storage-like API library using IndexedDB under-the-hood, with zero dependencies. Get the benefits of IndexedDB but with the simplicity and familiarity of `localStorage` and `sessionStorage`.

## Installation

```sh
npm i @marcellodotgg/storage-bin
```

## Usage

```js
import { localBin, sessionBin } from "@marcellodotgg/bin";

await localBin.setItem("age", 24);
const age = await localBin.getItem("age");
await localBin.removeItem("age");
const entireBin = localBin.dump();
localBin.clear();

// Session works similiarly, however, we will set a flag
// in sessionStorage and will create a new database
// for the session.

await sessionBin.setItem("age", 14);
const age2 = sessionBin.getItem("age");
await sessionBin.removeItem("age");
const entireBin2 = sessionBin.dump();
sessionBin.clear();
```
