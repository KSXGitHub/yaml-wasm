mod utils;

use wasm_bindgen::prelude::*;
use js_sys::*;
use yaml_rust::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn parse(text: &str) -> Result<JsValue, JsValue> {
    let vec = YamlLoader::load_from_str(text)
        .map_err(|_err| JsValue::from("Failed to parse YAML"))?
        .iter()
        .map(|x| yaml2js(x))
        .collect::<Vec<JsValue>>();
    Ok(js_array(vec))
}

fn yaml2js(yaml: &Yaml) -> JsValue {
    use Yaml::*;

    match yaml {
        Real(x) => match x.parse::<f64>() {
            Ok(x) => x.into(),
            _ => JsValue::from(x),
        },
        Integer(x) => (x.clone() as i32).into(),
        String(x) => x.into(),
        Boolean(x) => (*x).into(),
        Array(x) => js_array(x
            .iter()
            .map(|x| yaml2js(x))
            .collect::<Vec<JsValue>>()
        ),
        Hash(x) => {
            let mut acc = Vec::<(JsValue, JsValue)>::new();
            for (key, value) in x.iter() {
                let js_key = yaml2js(key);
                let js_value = yaml2js(value);
                acc.push((js_key, js_value));
            }
            js_object(acc)
        },
        Null => JsValue::NULL,
        _ => JsValue::UNDEFINED,
    }
}

fn js_array(vec: Vec<JsValue>) -> JsValue {
    let array = Array::new_with_length(vec.len() as u32);
    let mut index: u32 = 0;
    for item in vec {
        Array::set(&array, index, item);
        index += 1;
    }
    JsValue::from(array)
}

fn js_object(pairs: Vec<(JsValue, JsValue)>) -> JsValue {
    let object = Object::new();
    for (key, value) in pairs.iter() {
        Reflect::set(&object, key, value).unwrap();
    }
    JsValue::from(object)
}
