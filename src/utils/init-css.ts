const outer = document.createElement("div");
outer.style.visibility = "hidden";
outer.style.overflow = "scroll"; // Force scrollbar to appear
document.body.appendChild(outer);

// 2. Create an inner child
const inner = document.createElement("div");
outer.appendChild(inner);

// 3. Measure the difference using getBoundingClientRect (returns floats)
// The inner div will be forced smaller by the scrollbar
const scrollbarWidth = outer.getBoundingClientRect().width - inner.getBoundingClientRect().width;
// 4. Clean up
outer.remove();
document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarWidth.toFixed(3)}px`);
