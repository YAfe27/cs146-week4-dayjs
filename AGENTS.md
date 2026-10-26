# Working in Day.js

Day.js is a JavaScript library for parsing, formatting, comparing, and manipulating dates, with an API similar to Moment.js. The core is small and immutable; plugins add optional features, and locales supply language-specific data.

## Architecture

- `src/index.js` contains the `dayjs()` factory, `Dayjs` class, and plugin registration. It uses helpers from `src/utils.js` and constants from `src/constant.js`.
- `src/plugin/<name>/index.js` extends the core. `src/locale/*.js` defines locale data.
- `test/*.test.js`, `test/plugin/`, and `test/locale/` test the core, plugins, and locales directly from source.
- `types/index.d.ts` and `types/plugin/*.d.ts` describe the public API. Update the matching declarations when changing that API.
- `build/` contains maintained Rollup/Babel scripts. They generate the package entry point, `dayjs.min.js`, and the distributable plugin, locale, and declaration files.

## Commands

Run from the repository root:

```sh
npm ci
npm run lint

# Full test pipeline, including its explicit timezone checks.
TZ=UTC npm test

# Focused example: a plugin and another plugin that depends on it.
./node_modules/.bin/jest test/plugin/isLeapYear.test.js test/plugin/isoWeeksInYear.test.js --runInBand --coverage=false

# Build and size check; use the OpenSSL setting from the release workflow.
NODE_OPTIONS=--openssl-legacy-provider npm run build

# Optional ES module build.
npm run babel

# Run the library after building.
node -e 'const dayjs = require("./dayjs.min.js"); console.log(dayjs("2024-02-28").add(1, "day").format("YYYY-MM-DD"))'
```

`npm test` runs a timezone matrix followed by the full Jest suite with a 100% line-coverage requirement. `TZ=UTC` sets the final suite's timezone; the explicit timezone stages still use their own settings. A focused run with coverage disabled does not replace that full check.

## Conventions

- Follow the repo's ESLint configuration: two-space indentation, single quotes, no trailing commas, and no statement-ending semicolons. Source uses ES modules; build scripts use CommonJS.
- Match plugin names across source, tests, and declarations: `src/plugin/isLeapYear/index.js`, `test/plugin/isLeapYear.test.js`, and `types/plugin/isLeapYear.d.ts`.
- Plugin tests import `../../src` and `../../src/plugin/<name>`, register with `dayjs.extend()`, and use Jest `it`/`test` and `expect`. Reset MockDate after tests that set it. Use fixed dates for calendar cases.
- Check plugin dependencies when choosing tests: `isoWeeksInYear` calls `isLeapYear()`. Register required plugins in tests too.
- Plugin instance methods use normal functions when they need `this`. Preserve the core's immutable behavior; `badMutable` is the intentional exception.

## Guardrails

- Edit `src/` and `types/`. Do not hand-edit generated root `dayjs.min.js`, `plugin/`, `locale/`, `esm/`, `index.d.ts`, or `locale.json`, or installed `node_modules/` and generated `coverage/`. The `build/` directory itself is maintained source.
- Keep tests importing source. `require('.')` resolves the generated package entry point, which may be missing or stale.
- There is no `npm start` script. Use the Node example above to run the built library. `npm run prettier` only formats `docs/**/*.md`; it does not format JavaScript.
