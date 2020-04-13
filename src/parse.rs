use wasm_bindgen::prelude::*;
use js_sys::*;
use yaml_rust::*;
use super::utils::*;

#[wasm_bindgen(typescript_custom_section)]
const _TS_TYPES: &'static str = r"
interface ParseOptions {
    readonly map?: boolean;
}
";

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "ParseOptions")]
    pub type ParseOptions;
}

/// Parse a YAML Text into a JavaScript value.
///
/// Throws on failure.
#[wasm_bindgen]
pub fn parse(text: &str, options: Option<ParseOptions>) -> Result<JsValue, JsValue> {
    set_panic_hook();

    let use_map: bool = if let Some(opt) = options {
        Reflect::get(&opt, &JsValue::from("map"))
            .unwrap_or(JsValue::FALSE)
            .as_bool()
            .unwrap_or(false)
    } else { false };
    let js_hash = &if use_map { js_map } else { js_object };

    let vec = YamlLoader::load_from_str(text)
        .map_err(|error| SyntaxError::new(&format!("{}", error)))?
        .iter()
        .map(|x| yaml2js(x, js_hash))
        .collect::<Vec<JsValue>>();
    Ok(js_array(vec))
}

fn yaml2js(
    yaml: &Yaml,
    js_hash: &dyn Fn(Vec<(JsValue, JsValue)>) -> JsValue,
) -> JsValue {
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
            .map(|x| yaml2js(x, js_hash))
            .collect::<Vec<JsValue>>()
        ),
        Hash(x) => {
            let mut acc = Vec::<(JsValue, JsValue)>::new();
            for (key, value) in x.iter() {
                let js_key = yaml2js(key, js_hash);
                let js_value = yaml2js(value, js_hash);
                acc.push((js_key, js_value));
            }
            js_hash(acc)
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

fn js_map(pairs: Vec<(JsValue, JsValue)>) -> JsValue {
    let map = Map::new();
    for (key, value) in pairs.iter() {
        map.set(key, value);
    }
    JsValue::from(map)
}
