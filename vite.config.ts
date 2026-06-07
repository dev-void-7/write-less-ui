import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
    plugins: [solidPlugin(), dts({ insertTypesEntry: true })],
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "write-less-ui",
            fileName: "index",
            formats: ["es"],
        },
        rollupOptions: {
            // Make sure to externalize deps that shouldn't be bundled
            external: ["solid-js", "solid-js/web", "solid-js/store"],
        },
    },
});
