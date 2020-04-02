wasm-pack: src/**
	wasm-pack build --target web --out-dir wasm-pack --release

lib: wasm-pack
	cp -u wasm-pack/* lib/
