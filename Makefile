node_modules: package.json
	pnpm install

wasm-pack: src/**
	wasm-pack build --target bundler --out-dir wasm-pack --release

pkg: wasm-pack tsconfig.json node_modules
	pnpx pika-pack build
