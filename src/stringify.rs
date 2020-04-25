use wasm_bindgen::prelude::*;
use js_sys::*;
use yaml_rust::*;
use super::utils::*;

#[wasm_bindgen(inline_js = r"
    export const is_map = obj => obj instanceof Map
")]
extern {
    fn is_map(obj: &JsValue) -> bool;
}

/// Encode a JavaScript value into a YAML text.
///
/// Throws on failure.
///
/// **NOTE:** Circular object will result in infinite loop.
#[wasm_bindgen]
pub fn stringify(value: &JsValue) -> Result<String, JsValue> {
    set_panic_hook();
    let mut text = String::new();
    let mut emitter = YamlEmitter::new(&mut text);
    if let Some(doc) = js2yaml(value) {
        emitter
            .dump(&doc)
            .map_err(|error| Error::new(&format!("{}", error)))?;
    } else {
        return Err(JsValue::from(TypeError::new("Bad value")));
    }
    Ok(text)
}

fn js2yaml(js: &JsValue) -> Option<Yaml> {
    if js.is_function() || js.is_symbol() || js.is_undefined() {
        return None;
    }

    if js.is_null() {
        return Some(Yaml::Null);
    }

    if js.is_string() {
        return Some(Yaml::String(js.as_string().unwrap()));
    }

    if Number::is_integer(&js) {
        return Some(Yaml::Integer(js.as_f64().unwrap() as i64));
    }

    if Number::is_finite(&js) {
        return Some(Yaml::Real(js.as_f64().unwrap().to_string()));
    }

    if js.is_object() {
        return Some(if Array::is_array(&js) {
            let vec = Array::from(&js)
                .iter()
                .filter_map(|x| js2yaml(&x))
                .collect::<Vec<Yaml>>();
            Yaml::Array(vec)
        } else {
            use linked_hash_map::LinkedHashMap;
            let mut hash = LinkedHashMap::new();
            let entries: Array = if is_map(&js) {
                Array::from(&js)
            } else {
                Array::from(&Object::entries(&Object::from(JsValue::from(js))))
            };
            for entry in entries.iter() {
                let js_pair = Array::from(&entry);
                let js_key = js_pair.get(0);
                let js_value = js_pair.get(1);
                if let (Some(yaml_key), Some(yaml_value)) = (js2yaml(&js_key), js2yaml(&js_value)) {
                    hash.insert(yaml_key, yaml_value);
                }
            }
            Yaml::Hash(hash)
        })
    }

    if js.is_falsy() {
        return Some(Yaml::Boolean(false));
    }

    if js.is_truthy() {
        return Some(Yaml::Boolean(true));
    }

    unreachable!();
}
