# DayliProt

## Run

If you haven't done so already, install the [Tabris CLI](https://www.npmjs.com/package/tabris-cli) on your machine:

```
npm i tabris-cli -g
```

Then in the project directory, type:

```
npm start
```


This will start a Tabris.js code server at a free port and print its URL to the console. The app code can then be [side-loaded](https://tabrisjs.com/documentation/3.2/developer-app.html#run-your-app) in the [developer app](https://tabrisjs.com/documentation/3.2/developer-app.html) by entering that URL.

Alternatively you can also call the Tabris CLI directly:

```
tabris serve -a
```

This the same as running `npm start`. The `-a` switch enables automatic reload whenever a source file changes.

## Test

This project includes a ESLint configuration that helps preventing common mistakes in your code. Most IDEs can display ESLint-based hints directly in the editor, but you can also run the tool explicitly via:

```
npm test
```

The initial rules defined in `.eslintrc` are supposed to warn against problematic patterns, but do not enforce a specific code style. You may want to [adjust them](https://eslint.org/docs/rules/) according to your taste.

## Build

The app can be built using the online build service at [tabrisjs.com](https://tabrisjs.com) or locally using [Tabris.js CLI](https://www.npmjs.com/package/tabris-cli).

See [Building a Tabris.js App](https://tabrisjs.com/documentation/3.2/build.html) for more information.
