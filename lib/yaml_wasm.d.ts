/* tslint:disable */
/* eslint-disable */
/**
* @param {string} msg 
* @returns {Message} 
*/
export function message(msg: string): Message;
export class Message {
  free(): void;
/**
* Create new `Message`
* @param {string} msg 
*/
  constructor(msg: string);
/**
* Get message
* @returns {string} 
*/
  message(): string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_message_free: (a: number) => void;
  readonly message_new: (a: number, b: number) => number;
  readonly message_message: (a: number, b: number) => void;
  readonly message: (a: number, b: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
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
        