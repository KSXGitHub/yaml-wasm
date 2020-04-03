use wasm_bindgen::prelude::*;
use js_sys::*;
use yaml_rust::*;
use super::utils::*;

/// Encode a JavaScript value into a YAML text.
///
/// Throws on failure.
///
/// **NOTE:** Circular object will result in infinite loop.
#[wasm_bindgen]
pub fn stringify(value: JsValue) -> Result<String, JsValue> {
    set_panic_hook();
    let mut text = String::new();
    let mut emitter = YamlEmitter::new(&mut text);
    let doc = js2yaml(value);
    emitter.dump(&doc).map_err(|_err| Error::new("Something goes wrong"))?;
    Ok(text)
}

fn js2yaml(js: JsValue) -> Yaml {
    fn compute<'js>(js: &'js JsValue, tracker: &mut Vec<&'js JsValue>) -> Yaml {
        tracker.push(js);

        if js.is_function() || js.is_symbol() || js.is_undefined() {
            return Yaml::BadValue;
        }

        if js.is_null() {
            return Yaml::Null;
        }

        if js.is_string() {
            return Yaml::String(js.as_string().unwrap());
        }

        if Number::is_integer(&js) {
            return Yaml::Integer(js.as_f64().unwrap() as i64);
        }

        if Number::is_finite(&js) {
            return Yaml::Real(js.as_f64().unwrap().to_string());
        }

        if js.is_object() {
            return if Array::is_array(&js) {
                let vec = Array::from(&js)
                    .iter()
                    .map(|x| js2yaml(x))
                    .collect::<Vec<Yaml>>();
                Yaml::Array(vec)
            } else {
                use linked_hash_map::LinkedHashMap;
                let mut hash = LinkedHashMap::new();
                let entries = Array::from(&Object::entries(&Object::from(js.clone())));
                for entry in entries.iter() {
                    let pair = Array::from(&entry);
                    let key = pair.get(0);
                    let value = pair.get(1);
                    hash.insert(js2yaml(key), js2yaml(value));
                }
                Yaml::Hash(hash)
            }
        }

        if js.is_falsy() {
            return Yaml::Boolean(false);
        }

        if js.is_truthy() {
            return Yaml::Boolean(true);
        }

        unreachable!();
    }

    compute(&js, &mut Vec::new())
}
