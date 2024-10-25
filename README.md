# 🗑️ bin
Welcome to bin, we are an extremely lightweight storage like library for the browser. This package uses IndexedDB under-the-hood, with zero dependencies. We support `sessionStorage` and `localStorage` like behaviors, too.

## Installation
```sh
npm i @marcellodotgg/bin
```

## Usage
```js
import { localBin, sessionBin } from '@marcellodotgg/bin';

await localBin.setItem('age', 24);
const age = await localBin.getItem('age');
await localBin.removeItem('age');
const entireBin = localBin.dump();
localBin.clear();

// Session works similiarly, however, we will set a flag
// in sessionStorage and will reset the data if the flag
// is not present to simulate sessionStorage.
await sessionBin.setItem('age', 14);
const age2 = sessionBin.getItem('age');
await sessionBin.removeItem('age');
const entireBin2 = sessionBin.dump();
sessionBin.clear();
```
