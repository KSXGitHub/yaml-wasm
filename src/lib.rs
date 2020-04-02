mod utils;

use wasm_bindgen::prelude::*;
use js_sys::*;
// use yaml_rust::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct Foo {
    pub foo: f64,
    pub bar: i32,
}

#[wasm_bindgen]
pub fn main(foo: f64, bar: i32) -> Result<Object, JsValue> {
    let object = Object::new();
    Reflect::set(&object, &JsValue::from("foo"), &JsValue::from(foo))?;
    Reflect::set(&object, &JsValue::from("bar"), &JsValue::from(bar))?;
    Ok(object)
}
