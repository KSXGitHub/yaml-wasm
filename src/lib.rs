mod utils;

use wasm_bindgen::prelude::*;
use js_sys::*;
use yaml_rust::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

/// Encode a JavaScript value into a YAML text.
///
/// Throws on failure.
///
/// **NOTE:** Circular object will result in infinite loop.
#[wasm_bindgen]
pub fn stringify(value: JsValue) -> Result<String, JsValue> {
    let mut text = String::new();
    let mut emitter = YamlEmitter::new(&mut text);
    let doc = js2yaml(value);
    emitter.dump(&doc).map_err(|_err| Error::new("Something goes wrong"))?;
    Ok(text)
}

fn js2yaml(js: JsValue) -> Yaml {
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
            let entries = Array::from(&Object::entries(&Object::from(js)));
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

/// Parse a YAML Text into a JavaScript value.
///
/// Throws on failure.
#[wasm_bindgen]
pub fn parse(text: &str) -> Result<JsValue, JsValue> {
    let vec = YamlLoader::load_from_str(text)
        .map_err(|_err| SyntaxError::new("Text is not valid YAML"))?
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
