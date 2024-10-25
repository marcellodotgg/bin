# 🗑️ bin
Welcome to bin, we are an extremely lightweight storage like library for the browser. This package uses IndexedDB under-the-hood, with zero dependencies. We support `sessionStorage` and `localStorage` like behaviors, too.

## Installation
```sh
npm i @marcellodotgg/bin
```

## Usage
```js
import { localBin } from '@marcellodotgg/bin';

await localBin.setItem('age', 24);
const age = await localBin.getItem('age');
await localBin.removeItem('age');
const entireBin = localBin.dump();
localBin.clear()
```
