# Yaml Wasm

WebAssembly module to parse YAML.

## Usage

### Web and Deno

Use ES Module to import `./index.js`.

On Deno, make sure to enable `--allow-net` to allow `fetch()` to work properly.

```javascript
import init, { parse, stringify } from 'https://deno.land/x/yaml_wasm@0.1.9/index.js'
await init()

// Convert YAML text to JavaScript object
const [value] = parse(`
abc:
  def: 456
foo:
  - bar
`)
console.log(value)

// Convert JavaScript object to YAML text
const text = stringify(value)
console.log(text)
```

## Demo

### Web Browser

Go to https://ksxgithub.github.io/yaml-wasm/preview/browser/ and open DevTools console.

### Deno

* `deno run https://ksxgithub.github.io/yaml-wasm/preview/deno/success.ts` for successful operation.
* `deno run https://ksxgithub.github.io/yaml-wasm/preview/deno/failure.ts` for example error messages.

## License

[MIT](https://git.io/JvFmv) © [Hoàng Văn Khải](https://github.com/KSXGitHub/)
