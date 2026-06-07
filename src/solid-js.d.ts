import "solid-js";

declare module "solid-js" {
    namespace JSX {
        interface IntrinsicElements {
            // Registers <selectedcontent> with standard HTML attributes for SolidJS
            selectedcontent: JSX.HTMLAttributes<HTMLElement>;
        }
    }
}
