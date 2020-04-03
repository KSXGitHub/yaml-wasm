wasm-pack/web: src/** Cargo.toml
	wasm-pack build --target web --out-dir wasm-pack/web --release

wasm-pack/nodejs: src/** Cargo.toml
	wasm-pack build --target nodejs --out-dir wasm-pack/nodejs --release

lib: wasm-pack/web
	cp -u wasm-pack/web/* lib/
	deno run --allow-read=lib --allow-write scripts/add-missing-headers.ts

nodejs:	wasm-pack/nodejs
	cp -u wasm-pack/nodejs/* nodejs/
