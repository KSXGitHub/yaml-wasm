wasm-pack: src/** Cargo.toml
	wasm-pack build --target web --out-dir wasm-pack --release

lib: wasm-pack
	cp -u wasm-pack/* lib/
	deno run --allow-read=lib --allow-write scripts/add-missing-headers.ts
