type RequestInfo = never
type BufferSource = never
/* tslint:disable */
/* eslint-disable */
/**
* Parse a YAML Text into a JavaScript value.
*
* Throws on failure.
* @param {string} text 
* @param {ParseOptions | undefined} options 
* @returns {any[]} 
*/
export function parse(text: string, options?: ParseOptions): any[];
/**
* Encode a JavaScript value into a YAML text.
*
* Throws on failure.
*
* **NOTE:** Circular object will result in infinite loop.
* @param {any} value 
* @returns {string} 
*/
export function stringify(value: any): string;

interface ParseOptions {
    readonly map?: boolean;
}



export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly parse: (a: number, b: number, c: number, d: number) => void;
  readonly stringify: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
        