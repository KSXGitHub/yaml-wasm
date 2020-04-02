mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

/// Message class
#[wasm_bindgen]
pub struct Message {
    msg: String,
}

impl Message {
    /// Create new `Message`
    pub fn new (msg: String) -> Self {
        Message { msg }
    }

    /// Get message
    pub fn message (&self) -> String {
        self.msg.clone()
    }
}

#[wasm_bindgen]
pub fn message (msg: &str) -> Message {
    Message::new(msg.to_owned())
}
