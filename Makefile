wasm-pack/web: src/** Cargo.toml
	wasm-pack build --target web --out-dir wasm-pack/web --release

lib: wasm-pack/web
	cp -ru wasm-pack/web/* lib/
	deno run --allow-read=lib --allow-write scripts/add-missing-headers.ts
