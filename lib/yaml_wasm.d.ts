/* tslint:disable */
/* eslint-disable */
/**
* @param {string} text 
* @returns {any} 
*/
export function parse(text: string): any;
export class Foo {
  free(): void;
  bar: number;
  foo: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_foo_free: (a: number) => void;
  readonly __wbg_get_foo_foo: (a: number) => number;
  readonly __wbg_set_foo_foo: (a: number, b: number) => void;
  readonly __wbg_get_foo_bar: (a: number) => number;
  readonly __wbg_set_foo_bar: (a: number, b: number) => void;
  readonly parse: (a: number, b: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
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
        